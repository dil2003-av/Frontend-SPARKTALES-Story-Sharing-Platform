// services/admin-dashboard.ts
import api from "./api";

// --------------------------------------
// DASHBOARD STATISTICS
// --------------------------------------

export const getDashboardStats = async () => {
  try {
    const res = await api.get("/admin/dashboard/stats");
    return res.data.data;
  } catch (err: any) {
    console.error("getDashboardStats error:", err);
    throw err;
  }
};

export const getAnalytics = async (period: "week" | "month" | "year" = "week") => {
  try {
    const res = await api.get(`/admin/analytics?period=${period}`);
    return res.data.data;
  } catch (err: any) {
    console.error("getAnalytics error:", err);
    throw err;
  }
};

// --------------------------------------
// POSTS MANAGEMENT
// --------------------------------------

export const getAllPosts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}) => {
  try {
    const res = await api.get("/admin/posts", { params });
    return Array.isArray(res.data.data) ? res.data.data : res.data.data || [];
  } catch (err: any) {
    console.error("getAllPosts error:", err);
    throw err;
  }
};

export const getPostById = async (id: string) => {
  const res = await api.get(`/admin/posts/${id}/stats`);
  return res.data.data;
};

export const approvePost = async (id: string) => {
  const res = await api.put(`/post/approve/${id}`);
  return res.data;
};

export const declinePost = async (id: string) => {
  const res = await api.put(`/post/decline/${id}`);
  return res.data;
};

export const deletePost = async (id: string) => {
  const res = await api.delete(`/post/${id}`);
  return res.data;
};

// --------------------------------------
// USER MANAGEMENT
// --------------------------------------

export const getAllUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    return Array.isArray(res.data.data) ? res.data.data : res.data.data || [];
  } catch (err: any) {
    console.error("getAllUsers error:", err);
    throw err;
  }
};

export const getUserById = async (id: string) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data.data;
};

export const updateUserRole = async (id: string, roles: string[]) => {
  const res = await api.put(`/admin/users/${id}/role`, { roles });
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export default {
  getDashboardStats,
  getAnalytics,
  getAllPosts,
  getPostById,
  approvePost,
  declinePost,
  deletePost,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
