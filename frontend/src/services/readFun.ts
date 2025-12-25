import api from "./api"

export interface ReadFunPost {
  _id: string
  title: string
  category: string
  content: string
  tags: string
  createdAt: string
  views?: number
  image?: string
  admin?: string
  status?: string
}

export interface ReadFunFilters {
  search?: string
  category?: string
  page?: number
  limit?: number
}

// Get approved posts for Read & Fun page (from Post collection)
export const getApprovedStoriesForReading = async (filters: ReadFunFilters = {}) => {
  const { search, category, page = 1, limit = 10 } = filters
  
  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())
  
  if (search) {
    params.append("search", search)
  }
  
  if (category && category !== "all") {
    params.append("category", category)
  }
  
  try {
    // First try the readfun endpoint
    const res = await api.get(`/readfun?${params.toString()}`)
    return res.data
  } catch (err) {
    console.error("ReadFun endpoint error, trying post endpoint:", err);
    // Fallback to post/approved endpoint
    const res = await api.get(`/post/approved`)
    return Array.isArray(res.data) ? res.data : res.data
  }
}

// Get single post details for modal/view
export const getPostDetails = async (postId: string) => {
  try {
    const res = await api.get(`/readfun/post/${postId}`)
    return res.data
  } catch (err) {
    console.error("ReadFun post endpoint error");
    throw err;
  }
}

// Increment post view count
export const incrementPostViews = async (postId: string) => {
  try {
    const res = await api.post(`/readfun/post/${postId}/view`)
    return res.data
  } catch (err) {
    console.error("Failed to increment views:", err);
    // Don't throw, view increment is not critical
    return null;
  }
}

// Search posts by title and tags
export const searchReadFunPosts = async (searchQuery: string, category?: string) => {
  const params = new URLSearchParams({ q: searchQuery })
  
  if (category && category !== "all") {
    params.append("category", category)
  }
  
  const res = await api.get(`/readfun/search?${params.toString()}`)
  return res.data
}

// Get trending posts (most viewed)
export const getTrendingPosts = async (limit = 6) => {
  const res = await api.get(`/readfun/trending?limit=${limit}`)
  return res.data
}

// Get posts by category
export const getPostsByCategory = async (category: string, page = 1, limit = 10) => {
  const res = await api.get(`/readfun/category/${category}?page=${page}&limit=${limit}`)
  return res.data
}
