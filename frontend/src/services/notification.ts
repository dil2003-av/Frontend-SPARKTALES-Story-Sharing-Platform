import api from "./api";

export type NotificationType = "approved" | "declined" | "info";

export type Notification = {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead?: boolean;
};

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get("/notifications");
  return res.data?.notifications ?? [];
};

export const markAsRead = async (id: string): Promise<boolean> => {
  await api.patch(`/notifications/${id}/read`);
  return true;
};

export const clearNotifications = async (): Promise<boolean> => {
  await api.delete("/notifications");
  return true;
};

// Admin endpoints
export const getAllNotificationsAdmin = async (page = 1, limit = 20) => {
  const res = await api.get(`/notifications/admin?page=${page}&limit=${limit}`);
  const data = res.data || {};
  return {
    notifications: data.notifications ?? [],
    total: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
};

export const markAsReadAdmin = async (id: string): Promise<boolean> => {
  await api.patch(`/notifications/admin/${id}/read`);
  return true;
};

export const deleteNotificationAdmin = async (id: string): Promise<boolean> => {
  await api.delete(`/notifications/admin/${id}`);
  return true;
};
