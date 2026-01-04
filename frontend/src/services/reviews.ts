import api from "./api"

export interface Post {
  _id: string
  title: string
  category: string
}

export interface Review {
  _id: string
  post: string | Post
  name: string
  rating: number
  comment: string
  createdAt: string
  updatedAt?: string
}

export interface CreateReviewPayload {
  post: string
  rating: number
  comment: string
  name?: string
}

export interface UpdateReviewPayload {
  rating?: number
  comment?: string
}

// Get all reviews for a post by post ID
export const getReviewsByPostId = async (postId: string) => {
  const res = await api.get(`/review/post/${postId}`)
  return res.data
}

// Get all reviews (paginated)
export const getAllReviews = async (page = 1, limit = 10) => {
  const res = await api.get(`/review?page=${page}&limit=${limit}`)
  return Array.isArray(res.data) ? res.data : res.data.reviews || []
}

// Get my reviews
export const getMyReviews = async () => {
  const res = await api.get("/review/my-reviews")
  return res.data
}

// Create a review
export const createReview = async (payload: CreateReviewPayload) => {
  const res = await api.post("/review", payload)
  return res.data
}

// Update a review
export const updateReview = async (id: string, payload: UpdateReviewPayload) => {
  const res = await api.put(`/review/${id}`, payload)
  return res.data
}

// Delete a review
export const deleteReview = async (id: string) => {
  const res = await api.delete(`/review/${id}`)
  return res.data
}

// Get review by ID
export const getReviewById = async (id: string) => {
  const res = await api.get(`/review/${id}`)
  return res.data
}

// Approve review (ADMIN)
export const approveReview = async (id: string) => {
  const res = await api.patch(`/review/${id}/approve`)
  return res.data
}

// Decline review (ADMIN)
export const declineReview = async (id: string) => {
  const res = await api.patch(`/review/${id}/decline`)
  return res.data
}