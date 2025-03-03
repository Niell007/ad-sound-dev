"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Trash2, Edit, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Toast } from '@/components/ui/toast';

interface Review {
  id: string;
  author_name: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Local toast implementation
const useLocalToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; description: string; variant?: 'default' | 'destructive' }>>([]);
  
  const showToast = ({ title, description, variant = 'default' }: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };
  
  return {
    toast: showToast,
    toasts,
    dismissToast: (id: string) => setToasts(prev => prev.filter(toast => toast.id !== id))
  };
};

export default function DashboardReviewsPage() {
  const { toast, toasts, dismissToast } = useLocalToast();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch only the current user's reviews
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      
      // Filter reviews to only show the current user's reviews
      // This is a simplified approach - in a real app, you'd have a dedicated API endpoint
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your reviews. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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

  const openDeleteDialog = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const handleEditReview = (review: Review) => {
    router.push(`/dashboard/reviews/edit/${review.id}`);
  };

  const handleNewReview = () => {
    router.push('/dashboard/reviews/new');
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Reviews</CardTitle>
            <CardDescription>
              Manage your reviews and feedback
            </CardDescription>
          </div>
          <Button onClick={handleNewReview}>
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading your reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">You haven't submitted any reviews yet</p>
              <Button onClick={handleNewReview}>
                <Plus className="h-4 w-4 mr-2" />
                Write Your First Review
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{review.content}</div>
                      </TableCell>
                      <TableCell>{formatDate(review.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditReview(review)}
                            disabled={review.status === 'approved'}
                          >
                            <Edit className="h-4 w-4" />
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

      {/* Toast display */}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col p-4 gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md transform transition-all duration-300 ease-in-out ${
              toast.variant === "destructive" ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
            }`}
            onClick={() => dismissToast(toast.id)}
          >
            {toast.title && <h3 className="font-medium">{toast.title}</h3>}
            {toast.description && <p className="text-sm text-gray-500 dark:text-gray-400">{toast.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

