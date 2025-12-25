import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getDashboardStats } from "../services/admin-dashboard";
import { 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Bell, 
  LogOut, 
  CheckCircle, 
  Menu,
  X,
  Clock,
  UserCheck,
  Eye,
  Heart,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
  posts: {
    total: number;
    pending: number;
    approved: number;
    declined: number;
  };
  users: {
    total: number;
    admins: number;
    authors: number;
    regular: number;
  };
  engagement: {
    totalViews: number;
    totalLikes: number;
  };
  categoryDistribution: Array<{ _id: string; count: number }>;
  recentPosts: any[];
  postsPerDay: Array<{ _id: string; count: number }>;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await getDashboardStats();
      
      console.log("Dashboard stats:", statsData);
      
      setDashboardStats(statsData);
    } catch (err: any) {
      console.error("Fetch dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const stats = dashboardStats?.posts || {
    total: 0,
    pending: 0,
    approved: 0,
    declined: 0,
  };

  const userStats = dashboardStats?.users || {
    total: 0,
    admins: 0,
    authors: 0,
    regular: 0,
  };

  const engagement = dashboardStats?.engagement || {
    totalViews: 0,
    totalLikes: 0,
  };

  // Pie chart data for post status distribution
  const pieChartData = [
    { 
      name: "Approved", 
      value: stats.approved, 
      color: "#10b981", 
      percentage: stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : "0" 
    },
    { 
      name: "Pending", 
      value: stats.pending, 
      color: "#f59e0b", 
      percentage: stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : "0" 
    },
    { 
      name: "Declined", 
      value: stats.declined, 
      color: "#ef4444", 
      percentage: stats.total > 0 ? ((stats.declined / stats.total) * 100).toFixed(1) : "0" 
    },
  ];

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
            className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-gray-700 transition ${
              !sidebarOpen && "justify-center"
            }`}
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
                <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500">Manage posts, users, and content</p>
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

        {/* Content */}
        <div className="p-4 md:p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +12%
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Posts</p>
              <p className="text-3xl font-black text-gray-900">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-black text-blue-600">{userStats.total}</p>
              <p className="text-xs text-gray-500 mt-2">
                {userStats.admins} Admins • {userStats.authors} Authors
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Published
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-black text-green-600">{stats.approved}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                  Review
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-black text-yellow-600">{stats.pending}</p>
            </motion.div>
          </div>

          {/* Engagement Stats */}
          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-black text-gray-900">
                    {engagement.totalViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Likes</p>
                  <p className="text-2xl font-black text-gray-900">
                    {engagement.totalLikes.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Posts & Top Categories */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : dashboardStats?.recentPosts && dashboardStats.recentPosts.length > 0 ? (
                  dashboardStats.recentPosts.map((post: any) => (
                    <div
                      key={post._id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {post.category} • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          post.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : post.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent posts</p>
                )}
              </div>
            </motion.div>

            {/* Top Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">Top Categories</h3>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : dashboardStats && dashboardStats.categoryDistribution && dashboardStats.categoryDistribution.length > 0 ? (
                  dashboardStats.categoryDistribution.slice(0, 5).map((cat: any) => {
                    const percentage = stats.total > 0 ? ((cat.count / stats.total) * 100).toFixed(1) : "0";
                    return (
                      <div key={cat._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{cat._id}</span>
                          <span className="text-sm font-semibold text-purple-600">
                            {cat.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-linear-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No category data</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Pie Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Status Distribution Pie Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">Post Status Distribution</h3>
              <div className="flex flex-col items-center">
                {/* Simple Pie Chart Visualization */}
                <div className="relative w-48 h-48 mb-6">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {pieChartData.reduce((acc, item, index) => {
                      const prevSum = pieChartData.slice(0, index).reduce((sum, d) => sum + d.value, 0);
                      const offset = (prevSum / stats.total) * 100;
                      const length = (item.value / stats.total) * 100;
                      
                      return [
                        ...acc,
                        <circle
                          key={item.name}
                          cx="50"
                          cy="50"
                          r="15.915"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="31.83"
                          strokeDasharray={`${length} ${100 - length}`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-500"
                        />
                      ];
                    }, [] as React.ReactElement[])}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-500">Total Posts</p>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="w-full space-y-3">
                  {pieChartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="font-semibold text-gray-700">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                        <span className="text-sm font-semibold text-gray-500">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Category Distribution Pie Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">Category Distribution</h3>
              <p className="text-sm text-gray-500">Category analytics visualization coming soon...</p>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
