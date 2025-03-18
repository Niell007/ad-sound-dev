"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Edit, Plus, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LoadingPage } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { useReviews } from "@/hooks/use-reviews";

interface Review {
  id: string;
  author_name: string;
  rating: number;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function DashboardReviewsPage() {
  const { reviews, loading, fetchReviews, deleteReview } = useReviews();
  const router = useRouter();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    await deleteReview(selectedReview.id);
    setIsDeleteDialogOpen(false);
    setSelectedReview(null);
  };

  const openDeleteDialog = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const handleEditReview = (review: Review) => {
    router.push(`/dashboard/reviews/edit/${review.id}`);
  };

  const handleNewReview = () => {
    router.push("/dashboard/reviews/new");
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
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
            <CardDescription>Manage your reviews and feedback</CardDescription>
          </div>
          <Button onClick={handleNewReview} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                You haven't submitted any reviews yet
              </p>
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
                        <div className="max-w-xs truncate">
                          {review.content}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(review.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditReview(review)}
                            disabled={review.status === "approved"}
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
              Are you sure you want to delete this review? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReview}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
