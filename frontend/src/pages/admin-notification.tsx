import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Users,
  Bell,
  LogOut,
  UserCheck,
  Menu,
  X,
  MessageSquare,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  Inbox,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import {
  getAllNotificationsAdmin,
  markAsReadAdmin,
  deleteNotificationAdmin,
  type Notification,
} from "../services/notification";

interface AdminNotification extends Notification {
  user?: {
    email?: string;
    firstname?: string;
    lastname?: string;
  };
  isRead?: boolean;
}

const AdminNotification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (user && !user.roles?.includes("ADMIN")) {
      navigate("/home");
    }
  }, [user, navigate]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getAllNotificationsAdmin(page, limit);
      setNotifications(data.notifications || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
      Swal.fire("Error", "Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filtered = notifications.filter((n) => {
    const userName = `${n.user?.firstname || ""} ${n.user?.lastname || ""}`.trim();
    const haystack = `${n.title} ${n.message} ${userName} ${n.user?.email || ""}`.toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || n.type === typeFilter;
    const matchesRead =
      readFilter === "all" || (readFilter === "read" ? n.isRead === true : n.isRead === false || !n.isRead);
    return matchesSearch && matchesType && matchesRead;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const markRead = async (id: string) => {
    try {
      setActionId(id);
      await markAsReadAdmin(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error("Mark read failed", err);
      Swal.fire("Error", "Could not mark as read", "error");
    } finally {
      setActionId(null);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const confirm = await Swal.fire({
        title: "Delete notification?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
      });
      if (!confirm.isConfirmed) return;

      setActionId(id);
      await deleteNotificationAdmin(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error("Delete failed", err);
      Swal.fire("Error", "Could not delete notification", "error");
    } finally {
      setActionId(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-72" : "w-20"} bg-white border-r border-gray-200 shadow-lg transition-all duration-300 fixed h-screen left-0 top-0 z-40 flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-center">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">SparkTales</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl shadow-md transition ${
              location.pathname === "/admin-dashboard"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-purple-50"
            } ${!sidebarOpen && "justify-center"}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span className="font-semibold">Dashboard</span>}
          </button>

          <button
            onClick={() => navigate("/admin-posts")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
              location.pathname === "/admin-posts"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-purple-50"
            } ${!sidebarOpen && "justify-center"}`}
          >
            <FileText className="w-5 h-5" />
            {sidebarOpen && <span>Posts Management</span>}
          </button>

          <button
            onClick={() => navigate("/admin-users")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
              location.pathname === "/admin-users"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-purple-50"
            } ${!sidebarOpen && "justify-center"}`}
          >
            <Users className="w-5 h-5" />
            {sidebarOpen && <span>Users Management</span>}
          </button>

          <button
            onClick={() => navigate("/admin-reviews")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
              location.pathname === "/admin-reviews"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-purple-50"
            } ${!sidebarOpen && "justify-center"}`}
          >
            <MessageSquare className="w-5 h-5" />
            {sidebarOpen && <span>Reviews</span>}
          </button>

          <button
            onClick={() => navigate("/admin-notifications")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
              location.pathname === "/admin-notifications"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-purple-50"
            } ${!sidebarOpen && "justify-center"}`}
          >
            <Bell className="w-5 h-5" />
            {sidebarOpen && <span>Notifications</span>}
          </button>

          <button
            className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-gray-700 transition ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <UserCheck className="w-5 h-5" />
            {sidebarOpen && <span>Profile</span>}
          </button>
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-3">
          {sidebarOpen && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.email?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Logged in as</p>
                  <p className="font-semibold text-sm text-gray-900 truncate">{user?.email || "Admin"}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${sidebarOpen ? "ml-72" : "ml-20"} transition-all duration-300`}>
        <header className="shadow-sm border-b sticky top-0 z-30 backdrop-blur-sm bg-white/90">
          <div className="flex items-center justify-between p-4 md:p-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-purple-50 rounded-xl transition text-gray-700"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">View and manage all user notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-purple-50 rounded-xl transition">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <section className="p-4 md:p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search title, message, or user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
              <option value="info">Info</option>
            </select>
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Showing {filtered.length} of {total} notifications</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 text-purple-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No notifications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-md">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((n) => {
                    const displayName = `${n.user?.firstname || ""} ${n.user?.lastname || ""}`.trim() || n.user?.email || "-";
                    return (
                      <tr key={n._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">{displayName}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate">{n.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">{n.message}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 capitalize">{n.type}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              n.isRead ? "bg-gray-100 text-gray-700" : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {n.isRead ? "Read" : "Unread"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(n.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              disabled={n.isRead}
                              onClick={() => markRead(n._id)}
                              className={`p-2 rounded-lg border transition ${
                                n.isRead
                                  ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                                  : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                              }`}
                              title="Mark as read"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteNotification(n._id)}
                              className="p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition"
                              title="Delete"
                              disabled={actionId === n._id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <button
              disabled={page * limit >= total && filtered.length < limit}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminNotification;
