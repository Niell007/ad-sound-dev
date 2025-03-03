"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash } from "lucide-react"
import { useToast } from "@/components/ui/custom-toast-provider"

const reviews = [
  {
    id: "1",
    author: "Sarah Johnson",
    avatar: "/placeholder.svg",
    rating: 5,
    content: "Amazing service! The sound quality was perfect for our wedding.",
    date: "2024-02-15T10:00:00Z",
    eventType: "Wedding",
  },
  {
    id: "2",
    author: "Michael Brown",
    avatar: "/placeholder.svg",
    rating: 4,
    content: "Great DJ and excellent song selection for our corporate event.",
    date: "2024-02-10T15:30:00Z",
    eventType: "Corporate Event",
  },
  // Add more reviews as needed
]

export function ReviewsList() {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (reviewId: string) => {
    setIsDeleting(reviewId)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Review deleted",
        description: "The review has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="grid gap-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={review.avatar} alt={review.author} />
                <AvatarFallback>{review.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{review.author}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{review.eventType}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(review.date), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDelete(review.id)}
                  disabled={isDeleting === review.id}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {isDeleting === review.id ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <StarRating rating={review.rating} />
            <p className="mt-2 text-muted-foreground">{review.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

