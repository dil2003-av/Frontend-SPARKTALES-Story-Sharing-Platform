import api from "./api";

export type NotificationType = "approved" | "declined" | "info";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead?: boolean;
}

export interface AdminNotification extends Notification {
  user?: {
    email?: string;
    firstname?: string;
    lastname?: string;
  };
}

export interface NotificationResponse {
  notifications: AdminNotification[];
  total: number;
  page: number;
  limit: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: {
    approved: number;
    declined: number;
    info: number;
  };
}

// Get all notifications (Admin) - with pagination
export const getAllNotificationsAdmin = async (
  page = 1,
  limit = 20
): Promise<NotificationResponse> => {
  const res = await api.get(`/notifications/admin?page=${page}&limit=${limit}`);
  const data = res.data || {};
  return {
    notifications: data.notifications ?? [],
    total: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
};

// Mark notification as read (Admin)
export const markAsReadAdmin = async (id: string): Promise<boolean> => {
  await api.patch(`/notifications/admin/${id}/read`);
  return true;
};

// Delete notification (Admin)
export const deleteNotificationAdmin = async (id: string): Promise<boolean> => {
  await api.delete(`/notifications/admin/${id}`);
  return true;
};

// Get notification statistics (Admin)
export const getNotificationStats = async (): Promise<NotificationStats> => {
  const res = await api.get("/notifications/admin/stats");
  return res.data;
};

// Mark all notifications as read (Admin)
export const markAllAsReadAdmin = async (): Promise<boolean> => {
  await api.patch("/notifications/admin/read-all");
  return true;
};

// Delete all notifications (Admin)
export const deleteAllNotificationsAdmin = async (): Promise<boolean> => {
  await api.delete("/notifications/admin/all");
  return true;
};

// Get notifications by type (Admin)
export const getNotificationsByType = async (
  type: NotificationType,
  page = 1,
  limit = 20
): Promise<NotificationResponse> => {
  const res = await api.get(
    `/notifications/admin/type/${type}?page=${page}&limit=${limit}`
  );
  const data = res.data || {};
  return {
    notifications: data.notifications ?? [],
    total: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
};

// Get unread notifications (Admin)
export const getUnreadNotificationsAdmin = async (
  page = 1,
  limit = 20
): Promise<NotificationResponse> => {
  const res = await api.get(`/notifications/admin/unread?page=${page}&limit=${limit}`);
  const data = res.data || {};
  return {
    notifications: data.notifications ?? [],
    total: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
};

// Search notifications (Admin)
export const searchNotificationsAdmin = async (
  query: string,
  page = 1,
  limit = 20
): Promise<NotificationResponse> => {
  const res = await api.get(
    `/notifications/admin/search?q=${query}&page=${page}&limit=${limit}`
  );
  const data = res.data || {};
  return {
    notifications: data.notifications ?? [],
    total: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
};

// Bulk delete notifications (Admin)
export const bulkDeleteNotificationsAdmin = async (ids: string[]): Promise<boolean> => {
  await api.post("/notifications/admin/bulk/delete", { ids });
  return true;
};

// Bulk mark as read (Admin)
export const bulkMarkAsReadAdmin = async (ids: string[]): Promise<boolean> => {
  await api.post("/notifications/admin/bulk/read", { ids });
  return true;
};

// Get notification by ID (Admin)
export const getNotificationByIdAdmin = async (id: string): Promise<AdminNotification> => {
  const res = await api.get(`/notifications/admin/${id}`);
  return res.data;
};
