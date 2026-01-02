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
  CheckCircle,
  XCircle,
  Star,
  Search,
  Calendar,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import { getAllReviews, deleteReview, approveReview, declineReview, type Review, type ReviewWithPostTitle } from "../services/admin-reviews";

const AdminReviews: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewWithPostTitle[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
 

  useEffect(() => {
    if (user && !user.roles?.includes("ADMIN")) {
      navigate("/home");
    }
  }, [user, navigate]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews(page, limit);
      setReviews(Array.isArray(data) ? (data as ReviewWithPostTitle[]) : []);
    } catch (err) {
      console.error("Failed to load reviews", err);
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filtered = reviews.filter((r) => {
    const postTitle = typeof r.post === "object" ? r.post?.title || "" : "";
    const matchesSearch =
      postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === "all" || String(r.rating) === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const approveItem = async (id: string) => {
    try {
      await approveReview(id);
      setReviews((prev) => prev.map((r) => (r._id === id ? { ...r, status: "APPROVED" } : r)));
      Swal.fire({ icon: "success", title: "Review approved", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error("Approve failed", err);
      Swal.fire({ icon: "error", title: "Approve failed", text: "Please try again" });
    }
  };

  const declineItem = async (id: string) => {
    try {
      await declineReview(id);
      setReviews((prev) => prev.map((r) => (r._id === id ? { ...r, status: "DECLINED" } : r)));
      Swal.fire({ icon: "success", title: "Review declined", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error("Decline failed", err);
      Swal.fire({ icon: "error", title: "Decline failed", text: "Please try again" });
    }
  };

  const removeReview = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete Review?",
        text: "Are you sure you want to delete this review?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        Swal.fire({ title: "Deleting...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        await deleteReview(id);
        setReviews((prev) => prev.filter((r) => r._id !== id));
        Swal.fire({ icon: "success", title: "Review deleted", timer: 1200, showConfirmButton: false });
      }
    } catch (err) {
      console.error("Delete failed", err);
      Swal.fire({ icon: "error", title: "Delete failed", text: "Please try again" });
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
      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-gray-200 shadow-lg transition-all duration-300 fixed h-screen left-0 top-0 z-40 flex flex-col`}
      >
        {/* Logo */}
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

        {/* Navigation */}
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

        {/* User Profile & Logout */}
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

      {/* ===================== MAIN CONTENT ===================== */}
      <main className={`flex-1 ${sidebarOpen ? "ml-72" : "ml-20"} transition-all duration-300`}>
        {/* Top Bar */}
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
                <h1 className="text-2xl font-black text-gray-900">Reviews Management</h1>
                <p className="text-sm text-gray-500">Moderate user reviews</p>
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

        {/* Filters */}
        <div className="p-4 md:p-8">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by post title, name, or comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">All Ratings</option>
              {[5,4,3,2,1].map((r) => (
                <option key={r} value={String(r)}>{r} stars</option>
              ))}
            </select>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Showing <strong>{filtered.length}</strong>
              </p>
            </div>
          </div>

          {/* Reviews Table */}
          {loading ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No reviews found</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-md">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Post</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reviewer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Comment</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((r) => {
                    const postTitle = typeof r.post === "object" ? r.post?.title || "-" : "-";
                    return (
                      <tr key={r._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">{postTitle}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{r.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-500" />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">{r.comment}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            r.status === "APPROVED" ? "bg-green-100 text-green-800" :
                            r.status === "DECLINED" ? "bg-rose-100 text-rose-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {r.status || "PENDING"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(r.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              disabled={r.status === "APPROVED"}
                              onClick={() => approveItem(r._id)}
                              className={`p-2 rounded-lg border transition ${r.status === "APPROVED" ? "bg-green-50 text-green-400 border-green-100 cursor-not-allowed" : "bg-white text-green-700 border-green-200 hover:bg-green-50"}`}
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              disabled={r.status === "DECLINED"}
                              onClick={() => declineItem(r._id)}
                              className={`p-2 rounded-lg border transition ${r.status === "DECLINED" ? "bg-rose-50 text-rose-300 border-rose-100 cursor-not-allowed" : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50"}`}
                              title="Decline"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeReview(r._id)}
                              className="p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition"
                              title="Delete"
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

          {/* Pagination */}
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
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReviews;
