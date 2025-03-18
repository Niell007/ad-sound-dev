export interface Review {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string | null;
    author_name: string;
    rating: number;
    content: string;
    event_type?: string | null;
    event_date?: string | null;
    status: "pending" | "approved" | "rejected";
    is_featured?: boolean;
    response?: string | null;
    response_date?: string | null;
}

export interface ReviewReaction {
    id: string;
    created_at: string;
    review_id: string;
    user_id: string;
    reaction_type: "helpful" | "not_helpful";
}
