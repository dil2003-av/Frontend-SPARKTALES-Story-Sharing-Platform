import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  RefreshCcw,
  Bell,
  UserCheck,
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import { getAllPosts, approvePost, declinePost } from "../services/admin-dashboard";

interface AdminUser {
  firstname?: string;
  lastname?: string;
  email?: string;
}

interface AdminPost {
  _id: string;
  title: string;
  category: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
  admin?: AdminUser;
  image?: string;
}

const AdminPosts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts({ limit: 200 });
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleApprove = async (id: string) => {
    try {
      setActionId(id);
      Swal.fire({ title: "Sending email...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      await approvePost(id);
      setPosts((prev) => prev.map((p) => (p._id === id ? { ...p, status: "APPROVED" } : p)));
      Swal.fire({ icon: "success", title: "Post approved", timer: 1400, showConfirmButton: false });
    } catch (err) {
      console.error("Approve failed", err);
      Swal.fire({ icon: "error", title: "Approve failed", text: "Please try again" });
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      setActionId(id);
      Swal.fire({ title: "Sending email...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      await declinePost(id);
      setPosts((prev) => prev.map((p) => (p._id === id ? { ...p, status: "DECLINED" } : p)));
      Swal.fire({ icon: "success", title: "Post declined", timer: 1400, showConfirmButton: false });
    } catch (err) {
      console.error("Decline failed", err);
      Swal.fire({ icon: "error", title: "Decline failed", text: "Please try again" });
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

  const statusBadge = (status: AdminPost["status"]) => {
    const styles: Record<AdminPost["status"], string> = {
      APPROVED: "bg-green-100 text-green-800",
      PENDING: "bg-amber-100 text-amber-800",
      DECLINED: "bg-rose-100 text-rose-800",
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-gray-200 shadow-lg transition-all duration-300 fixed h-screen left-0 top-0 z-40 flex flex-col`}
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
            <Sparkles className="w-5 h-5" />
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
            onClick={() => navigate("/admin-profile")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
              location.pathname === "/admin-profile"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-purple-50"
            } ${!sidebarOpen && "justify-center"}`}
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
      <div className={`flex-1 min-h-screen ${sidebarOpen ? "ml-72" : "ml-20"} transition-all duration-300`}>
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
                <h1 className="text-2xl font-black text-gray-900">Posts Management</h1>
                <p className="text-sm text-gray-500">Approve or decline user submissions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-purple-50 rounded-xl transition">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={fetchPosts}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-white border border-gray-200 rounded-xl shadow-sm hover:border-purple-400 hover:text-purple-600"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900">All Posts</p>
                <p className="text-sm text-gray-500">Approve or decline user submissions</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-600" /> Approved</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-600" /> Pending</div>
                <div className="flex items-center gap-1"><XCircle className="w-4 h-4 text-rose-600" /> Declined</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-500">Loading posts...</td>
                    </tr>
                  ) : posts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-500">No posts found.</td>
                    </tr>
                  ) : (
                    posts.map((post) => {
                      const authorName = post.admin?.firstname || post.admin?.lastname
                        ? `${post.admin?.firstname || ""} ${post.admin?.lastname || ""}`.trim()
                        : post.admin?.email || "Unknown";

                      const isApproving = actionId === post._id && post.status !== "APPROVED";
                      const isDeclining = actionId === post._id && post.status !== "DECLINED";

                      return (
                        <tr key={post._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-center">
                            {post.image ? (
                              <img src={post.image} alt={post.title} className="h-16 w-16 object-cover rounded-lg shadow-md" />
                            ) : (
                              <div className="inline-flex items-center justify-center h-16 w-16 bg-gray-100 rounded-lg">
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate">{post.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{authorName || "Unknown"}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{post.category || "-"}</td>
                          <td className="px-6 py-4">{statusBadge(post.status)}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              disabled={post.status === "APPROVED" || isApproving}
                              onClick={() => handleApprove(post._id)}
                              className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border transition ${
                                post.status === "APPROVED"
                                  ? "bg-green-50 text-green-400 border-green-100 cursor-not-allowed"
                                  : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                              {isApproving ? "Approving..." : "Approve"}
                            </button>

                            <button
                              disabled={post.status === "DECLINED" || isDeclining}
                              onClick={() => handleDecline(post._id)}
                              className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border transition ${
                                post.status === "DECLINED"
                                  ? "bg-rose-50 text-rose-300 border-rose-100 cursor-not-allowed"
                                  : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50"
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                              {isDeclining ? "Declining..." : "Decline"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        
      </div>
    </div>
  );
};
export default AdminPosts;
