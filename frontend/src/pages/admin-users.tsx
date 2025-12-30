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
  Edit2,
  Check,
  Trash2,
  Crown,
  UserPlus,
  Mail,
  Calendar,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import { getAllUsers, deleteUser, updateUserRole } from "../services/admin-dashboard";

interface AdminUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRoles, setEditingRoles] = useState<string[]>([]);

  // Redirect if not admin
  useEffect(() => {
    if (user && !user.roles?.includes("ADMIN")) {
      navigate("/home");
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users", err);
      Swal.fire("Error", "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || u.roles.includes(roleFilter.toUpperCase());

    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete User?",
        text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        Swal.fire({ title: "Deleting...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        await deleteUser(userId);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        Swal.fire({ icon: "success", title: "User deleted", timer: 1400, showConfirmButton: false });
      }
    } catch (err) {
      console.error("Delete failed", err);
      Swal.fire({ icon: "error", title: "Delete failed", text: "Please try again" });
    }
  };

  const handleEditRole = (userId: string, currentRoles: string[]) => {
    setEditingId(userId);
    setEditingRoles([...currentRoles]);
  };

  const handleSaveRole = async (userId: string) => {
    try {
      if (editingRoles.length === 0) {
        Swal.fire("Error", "User must have at least one role", "error");
        return;
      }

      Swal.fire({ title: "Updating role...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      await updateUserRole(userId, editingRoles);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, roles: editingRoles } : u))
      );
      setEditingId(null);
      Swal.fire({ icon: "success", title: "Role updated", timer: 1400, showConfirmButton: false });
    } catch (err) {
      console.error("Update failed", err);
      Swal.fire({ icon: "error", title: "Update failed", text: "Please try again" });
    }
  };

  const toggleRole = (role: string) => {
    setEditingRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-purple-100 text-purple-800",
      AUTHOR: "bg-blue-100 text-blue-800",
      USER: "bg-gray-100 text-gray-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
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
                <h1 className="text-2xl font-black text-gray-900">Users Management</h1>
                <p className="text-sm text-gray-500">Manage user roles and permissions</p>
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
        <div className="p-4 md:p-8">
          {/* Search & Filter */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="author">Author</option>
              <option value="user">User</option>
            </select>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
              </p>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-md">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                            {u.firstname[0]}
                            {u.lastname[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {u.firstname} {u.lastname}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {u.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === u._id ? (
                          <div className="flex flex-wrap gap-2">
                            {["ADMIN", "AUTHOR", "USER"].map((role) => (
                              <button
                                key={role}
                                onClick={() => toggleRole(role)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                  editingRoles.includes(role)
                                    ? getRoleColor(role)
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {u.roles.map((role) => (
                              <span
                                key={role}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${getRoleColor(
                                  role
                                )}`}
                              >
                                {role === "ADMIN" && <Crown className="w-3 h-3" />}
                                {role === "AUTHOR" && <UserPlus className="w-3 h-3" />}
                                {role}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(u.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {editingId === u._id ? (
                            <>
                              <button
                                onClick={() => handleSaveRole(u._id)}
                                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditRole(u._id, u.roles)}
                                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                                title="Edit roles"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteUser(u._id, `${u.firstname} ${u.lastname}`)
                                }
                                className="p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
