import api from "./api"

export interface Post {
  _id: string
  title: string
  category: string
  content: string
  tags: string
  image: string | null
  status?: string
  views?: number
  likes?: number
  likedBy?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreatePostPayload {
  title: string
  category: string
  content: string
  tags?: string
  image?: string | null
}

export interface UpdatePostPayload {
  title?: string
  category?: string
  content?: string
  tags?: string
  image?: string | null
  status?: string
}

// Create a new post
export const createPost = async (payload: FormData | CreatePostPayload) => {
  // If FormData is provided (for image upload), let Axios set multipart headers
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData
  const res = await api.post("/post", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
  })
  return res.data
}

// Get all approved posts (public)
export const getApprovedPosts = async (page = 1, limit = 10) => {
  const res = await api.get(`/post/approved?page=${page}&limit=${limit}`)
  return res.data
}

// Get all approved posts for dropdown (no pagination)
export const getAllApprovedPosts = async () => {
  const res = await api.get(`/post/approved?limit=1000`)
  return Array.isArray(res.data) ? res.data : res.data.posts || []
}

// Get all posts (admin/author)
export const getAllPosts = async (page = 1, limit = 10) => {
  const res = await api.get(`/post?page=${page}&limit=${limit}`)
  return res.data
}

// Get my posts (current user's posts)
export const getMyPosts = async () => {
  const res = await api.get("/post/my-posts")
  return res.data as Post[]
}

// Get single post by ID
export const getPostById = async (id: string) => {
  const res = await api.get(`/post/${id}`)
  return res.data
}

// Update post
export const updatePost = async (id: string, payload: FormData | UpdatePostPayload) => {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData
  const res = await api.put(`/post/${id}`, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
  })
  return res.data
}

// Delete post
export const deletePost = async (id: string) => {
  const res = await api.delete(`/post/${id}`)
  return res.data
}

// Like / Unlike a post
export const toggleLike = async (id: string) => {
  const res = await api.put(`/post/${id}/like`)
  return res.data as { success: boolean; liked: boolean; likes: number }
}

// Search posts
export const searchPosts = async (query: string, category?: string) => {
  const params = new URLSearchParams({ q: query })
  if (category && category !== "all") {
    params.append("category", category)
  }
  const res = await api.get(`/post/search?${params.toString()}`)
  return res.data
}
