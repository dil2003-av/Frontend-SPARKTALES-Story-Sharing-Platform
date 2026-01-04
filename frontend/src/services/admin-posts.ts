import api from "./api";

export interface AdminUser {
  firstname?: string;
  lastname?: string;
  email?: string;
}

export interface AdminPost {
  _id: string;
  title: string;
  category: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
  admin?: AdminUser;
  image?: string;
  content?: string;
  description?: string;
  updatedAt?: string;
}

export interface PostsResponse {
  data: AdminPost[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface PostStats {
  totalPosts: number;
  approvedPosts: number;
  pendingPosts: number;
  declinedPosts: number;
  postsByCategory: {
    [key: string]: number;
  };
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

// Get all posts (Admin)
export const getAllPosts = async (params?: GetPostsParams): Promise<AdminPost[]> => {
  try {
    const res = await api.get("/admin/posts", { params });
    return Array.isArray(res.data.data) ? res.data.data : res.data.data || [];
  } catch (err: any) {
    console.error("getAllPosts error:", err);
    throw err;
  }
};

// Get post by ID (Admin)
export const getPostById = async (id: string): Promise<AdminPost> => {
  const res = await api.get(`/admin/posts/${id}/stats`);
  return res.data.data;
};

// Approve post (Admin)
export const approvePost = async (id: string) => {
  const res = await api.put(`/post/approve/${id}`);
  return res.data;
};

// Decline post (Admin)
export const declinePost = async (id: string) => {
  const res = await api.put(`/post/decline/${id}`);
  return res.data;
};

// Delete post (Admin)
export const deletePost = async (id: string) => {
  const res = await api.delete(`/post/${id}`);
  return res.data;
};

// Get posts statistics (Admin)
export const getPostStats = async (): Promise<PostStats> => {
  const res = await api.get("/admin/posts/stats");
  return res.data.data;
};

// Get posts by status (Admin)
export const getPostsByStatus = async (
  status: "PENDING" | "APPROVED" | "DECLINED",
  page = 1,
  limit = 20
): Promise<AdminPost[]> => {
  const res = await api.get("/admin/posts", {
    params: { status, page, limit },
  });
  return Array.isArray(res.data.data) ? res.data.data : res.data.data || [];
};

// Get posts by category (Admin)
export const getPostsByCategory = async (
  category: string,
  page = 1,
  limit = 20
): Promise<AdminPost[]> => {
  const res = await api.get("/admin/posts", {
    params: { category, page, limit },
  });
  return Array.isArray(res.data.data) ? res.data.data : res.data.data || [];
};

// Search posts (Admin)
export const searchPosts = async (
  search: string,
  page = 1,
  limit = 20
): Promise<AdminPost[]> => {
  const res = await api.get("/admin/posts", {
    params: { search, page, limit },
  });
  return Array.isArray(res.data.data) ? res.data.data : res.data.data || [];
};

// Bulk approve posts (Admin)
export const bulkApprovePosts = async (ids: string[]) => {
  const res = await api.post("/admin/posts/bulk/approve", { ids });
  return res.data;
};

// Bulk decline posts (Admin)
export const bulkDeclinePosts = async (ids: string[]) => {
  const res = await api.post("/admin/posts/bulk/decline", { ids });
  return res.data;
};

// Bulk delete posts (Admin)
export const bulkDeletePosts = async (ids: string[]) => {
  const res = await api.post("/admin/posts/bulk/delete", { ids });
  return res.data;
};

// Update post (Admin)
export const updatePost = async (
  id: string,
  data: Partial<Pick<AdminPost, "title" | "content" | "category" | "description">>
) => {
  const res = await api.put(`/admin/posts/${id}`, data);
  return res.data;
};

// Get pending posts count (Admin)
export const getPendingPostsCount = async (): Promise<number> => {
  const res = await api.get("/admin/posts/pending/count");
  return res.data.count || 0;
};

// Get recent posts (Admin)
export const getRecentPosts = async (limit = 10): Promise<AdminPost[]> => {
  const res = await api.get("/admin/posts/recent", { params: { limit } });
  return Array.isArray(res.data.data) ? res.data.data : res.data.data || [];
};
