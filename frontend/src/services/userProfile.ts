import api from "./api";
import { getMyDetails } from "./auth";
import { getMyPosts, type Post } from "./posts";

export type UserProfile = {
  firstname?: string;
  lastname?: string;
  email?: string;
  roles?: string[];
  createdAt?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
};

const normalizeProfile = (raw: any): UserProfile => {
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
  } as UserProfile;
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const res = await getMyDetails();
  return normalizeProfile(res);
};

export const updateUserProfile = async (
  payload: Partial<UserProfile> & { avatarFile?: File | null }
): Promise<UserProfile> => {
  const formData = new FormData();
  if (payload.firstname) formData.append("firstname", payload.firstname);
  if (payload.lastname) formData.append("lastname", payload.lastname);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.address) formData.append("address", payload.address);
  if (payload.avatarFile) formData.append("avatar", payload.avatarFile);

  const res = await api.put("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return normalizeProfile(res.data);
};

export const fetchMyPostsWithStats = async (): Promise<{
  posts: Post[];
  totals: { total: number; approved: number; pending: number; declined: number };
}> => {
  const posts = await getMyPosts();
  const totals = {
    total: posts.length,
    approved: posts.filter((p) => p.status === "APPROVED").length,
    pending: posts.filter((p) => p.status === "PENDING").length,
    declined: posts.filter((p) => p.status === "DECLINED").length
  };
  return { posts, totals };
};
