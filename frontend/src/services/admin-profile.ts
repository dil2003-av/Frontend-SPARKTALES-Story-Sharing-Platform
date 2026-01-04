import { getMyDetails } from "./auth";
import api from "./api";
import { type Post } from "./posts";

export type AdminProfile = {
  firstname?: string;
  lastname?: string;
  email?: string;
  roles?: string[];
  createdAt?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
};

const normalizeAdminProfile = (raw: any): AdminProfile => {
  if (!raw) return {};
  const base = raw.data || raw;
  return {
    firstname: base.firstname,
    lastname: base.lastname,
    email: base.email,
    roles: base.roles,
    createdAt: base.createdAt,
    phone: base.phone,
    address: base.address,
    avatarUrl: base.avatarUrl || base.avatar || base.profileImage
  } as AdminProfile;
};

export const fetchAdminProfile = async (): Promise<AdminProfile> => {
  const res = await getMyDetails();
  return normalizeAdminProfile(res);
};

export const updateAdminProfile = async (
  payload: Partial<AdminProfile> & { avatarFile?: File | null }
): Promise<AdminProfile> => {
  const formData = new FormData();
  if (payload.firstname) formData.append("firstname", payload.firstname);
  if (payload.lastname) formData.append("lastname", payload.lastname);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.address) formData.append("address", payload.address);
  if (payload.avatarFile) formData.append("avatar", payload.avatarFile);

  const res = await api.put("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return normalizeAdminProfile(res.data);
};

export const fetchAdminPostStats = async (): Promise<{
  posts: Post[];
  totals: { total: number; approved: number; pending: number; declined: number };
}> => {
  const res = await api.get("/admin/posts?limit=1000");
  const posts = Array.isArray(res.data) ? res.data : res.data.data || [];
  const totals = {
    total: posts.length,
    approved: posts.filter((p: Post) => p.status === "APPROVED").length,
    pending: posts.filter((p: Post) => p.status === "PENDING").length,
    declined: posts.filter((p: Post) => p.status === "DECLINED").length
  };
  return { posts, totals };
};
