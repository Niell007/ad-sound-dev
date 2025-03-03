"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Trash2, MessageSquare, Check, X, Star as StarIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  author_name: string;
  author_email: string | null;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  source: string;
  created_at: string;
  updated_at: string | null;
  response: string | null;
  response_date: string | null;
}

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [responseText, setResponseText] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let url = '/api/reviews';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error(`Failed to ${action} review`);
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, status: action === 'approve' ? 'approved' : 'rejected' } 
          : review
      ));
      
      toast({
        title: 'Success',
        description: `Review ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });
    } catch (error) {
      console.error(`Error ${action}ing review:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} review. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const handleFeatureToggle = async (reviewId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'feature',
          featured 
        }),
      });

      if (!response.ok) throw new Error('Failed to update featured status');
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, is_featured: featured } 
          : review
      ));
      
      toast({
        title: 'Success',
        description: `Review ${featured ? 'featured' : 'unfeatured'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update featured status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    
    try {
      const response = await fetch(`/api/reviews/${selectedReview.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete review');
      
      // Update local state
      setReviews(reviews.filter(review => review.id !== selectedReview.id));
      
      toast({
        title: 'Success',
        description: 'Review deleted successfully.',
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleResponseSubmit = async () => {
    if (!selectedReview || !responseText.trim()) return;
    
    try {
      const response = await fetch(`/api/reviews/${selectedReview.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'respond',
          response: responseText 
        }),
      });

      if (!response.ok) throw new Error('Failed to add response');
      
      const updatedReview = await response.json();
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === selectedReview.id 
          ? updatedReview
          : review
      ));
      
      toast({
        title: 'Success',
        description: 'Response added successfully.',
      });
      
      setIsResponseDialogOpen(false);
      setResponseText('');
    } catch (error) {
      console.error('Error adding response:', error);
      toast({
        title: 'Error',
        description: 'Failed to add response. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openResponseDialog = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.response || '');
    setIsResponseDialogOpen(true);
  };

  const openDeleteDialog = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Manage Reviews</CardTitle>
          <CardDescription>
            Review, approve, and respond to customer feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <span>Filter by status:</span>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchReviews} variant="outline">
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No reviews found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{review.author_name}</div>
                          {review.author_email && (
                            <div className="text-sm text-gray-500">{review.author_email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{review.content}</div>
                        {review.response && (
                          <div className="mt-1 text-sm text-gray-500 italic">
                            Has response
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(review.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant={review.is_featured ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleFeatureToggle(review.id, !review.is_featured)}
                          disabled={review.status !== 'approved'}
                        >
                          <StarIcon className={`h-4 w-4 ${review.is_featured ? 'fill-current' : ''}`} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {review.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(review.id, 'approve')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(review.id, 'reject')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openResponseDialog(review)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(review)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Add a public response to this review. This will be visible to all users.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">{selectedReview.author_name}</span>
                {renderStars(selectedReview.rating)}
              </div>
              <p className="text-gray-700">{selectedReview.content}</p>
            </div>
          )}
          
          <Textarea
            placeholder="Write your response here..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            className="min-h-[120px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResponseSubmit}>
              Save Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReview}>
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 