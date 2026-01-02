import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle, Info, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  getNotifications,
  type Notification,
  markAsRead,
  clearNotifications,
} from "../services/notification";

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    loadNotifications();
  }, [navigate]);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await getNotifications();
    setNotifications(data);
    setLoading(false);
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleClearAll = async () => {
    await clearNotifications();
    setNotifications([]);
  };

  const iconByType = (type: string) => {
    switch (type) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "declined":
        return <XCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-md">
                <Bell className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Notifications</h1>
                <p className="text-gray-600 text-lg">
                  Stay updated with approvals & system updates 🔔
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200 px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Messages
                  </h2>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-full shadow-sm">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Filter Tabs */}
                  <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                        filter === "all"
                          ? "bg-gray-900 text-white shadow-md"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("unread")}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                        filter === "unread"
                          ? "bg-gray-900 text-white shadow-md"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Unread
                    </button>
                  </div>

                  {/* Clear All Button */}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* States */}
            <div className="p-8">
              {loading ? (
                <div className="text-center py-24">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-fuchsia-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600 font-semibold mt-6">
                    Loading notifications...
                  </p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-24">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Bell className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {filter === "unread" ? "All caught up!" : "No notifications yet"}
                  </h3>
                  <p className="text-gray-500">
                    {filter === "unread"
                      ? "You've read all your notifications"
                      : "We'll notify you when something arrives"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredNotifications.map((n, index) => (
                      <motion.div
                        key={n._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.03 }}
                        className={`group relative flex gap-4 p-6 rounded-2xl border-2 transition-all duration-300 ${
                          !n.isRead
                            ? "border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-violet-50 shadow-sm hover:shadow-md"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        {/* Unread Indicator */}
                        {!n.isRead && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b from-fuchsia-600 to-violet-600 rounded-r-full"></div>
                        )}

                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                          n.type === "approved"
                            ? "bg-emerald-50 border-2 border-emerald-200"
                            : n.type === "declined"
                            ? "bg-rose-50 border-2 border-rose-200"
                            : "bg-blue-50 border-2 border-blue-200"
                        }`}>
                          {iconByType(n.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">
                            {n.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {n.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(n.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkRead(n._id)}
                            className="flex-shrink-0 self-start flex items-center gap-2 px-4 py-2 text-sm font-semibold text-fuchsia-600 hover:text-white bg-white hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-violet-600 border-2 border-fuchsia-200 hover:border-transparent rounded-xl transition-all shadow-sm hover:shadow-md"
                          >
                            <Check className="w-4 h-4" />
                            Mark Read
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;