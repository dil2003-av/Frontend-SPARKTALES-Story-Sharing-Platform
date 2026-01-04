import api from "./api";

export interface Post {
  _id: string;
  title: string;
  category: string;
}

export interface Review {
  _id: string;
  post: string | Post;
  name: string;
  rating: number;
  comment: string;
  status?: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewWithPostTitle extends Review {
  post: any;
}

export interface ReviewStats {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  declinedReviews: number;
  averageRating: number;
}

// Get all reviews (Admin) - with pagination
export const getAllReviews = async (page = 1, limit = 20): Promise<ReviewWithPostTitle[]> => {
  const res = await api.get(`/review?page=${page}&limit=${limit}`);
  return Array.isArray(res.data) ? res.data : res.data.reviews || [];
};

// Get review statistics (Admin)
export const getReviewStats = async (): Promise<ReviewStats> => {
  const res = await api.get("/review/admin/stats");
  return res.data;
};

// Approve review (Admin)
export const approveReview = async (id: string) => {
  const res = await api.patch(`/review/${id}/approve`);
  return res.data;
};

// Decline review (Admin)
export const declineReview = async (id: string) => {
  const res = await api.patch(`/review/${id}/decline`);
  return res.data;
};

// Delete review (Admin)
export const deleteReview = async (id: string) => {
  const res = await api.delete(`/review/${id}`);
  return res.data;
};

// Bulk approve reviews (Admin)
export const bulkApproveReviews = async (ids: string[]) => {
  const res = await api.post("/review/bulk/approve", { ids });
  return res.data;
};

// Bulk decline reviews (Admin)
export const bulkDeclineReviews = async (ids: string[]) => {
  const res = await api.post("/review/bulk/decline", { ids });
  return res.data;
};

// Bulk delete reviews (Admin)
export const bulkDeleteReviews = async (ids: string[]) => {
  const res = await api.post("/review/bulk/delete", { ids });
  return res.data;
};

// Get reviews by status (Admin)
export const getReviewsByStatus = async (
  status: "PENDING" | "APPROVED" | "DECLINED",
  page = 1,
  limit = 20
) => {
  const res = await api.get(`/review/admin/status/${status}?page=${page}&limit=${limit}`);
  return res.data;
};

// Search reviews (Admin)
export const searchReviews = async (query: string, page = 1, limit = 20) => {
  const res = await api.get(`/review/admin/search?q=${query}&page=${page}&limit=${limit}`);
  return res.data;
};

// Get reviews by rating filter (Admin)
export const getReviewsByRating = async (rating: number, page = 1, limit = 20) => {
  const res = await api.get(`/review/admin/rating/${rating}?page=${page}&limit=${limit}`);
  return res.data;
};

// Get review by ID (Admin)
export const getReviewById = async (id: string): Promise<Review> => {
  const res = await api.get(`/review/${id}`);
  return res.data;
};

// Update review (Admin)
export const updateReview = async (id: string, payload: { rating?: number; comment?: string }) => {
  const res = await api.put(`/review/${id}`, payload);
  return res.data;
};
