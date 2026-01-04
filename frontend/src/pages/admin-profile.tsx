import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  RefreshCw,
  Mail,
  Shield,
  Calendar,
  PenSquare,
  Phone,
  MapPin,
  Upload,
  BookOpen,
  CheckCircle2,
  Clock3,
  XCircle
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import {
  fetchAdminProfile,
  updateAdminProfile,
  fetchAdminPostStats,
  type AdminProfile
} from "../services/admin-profile";

interface AdminPostStats {
  total: number;
  approved: number;
  pending: number;
  declined: number;
}

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [postStats, setPostStats] = useState<AdminPostStats>(
    { total: 0, approved: 0, pending: 0, declined: 0 }
  );
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    address: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user && !user.roles?.includes("ADMIN")) {
      navigate("/home");
    }
  }, [user, navigate]);

  const displayName = useMemo(() => {
    const source = profile || user;
    if (!source) return "Admin";
    if (source.firstname || source.lastname) {
      return `${source.firstname ?? ""} ${source.lastname ?? ""}`.trim();
    }
    if (source.email) return source.email.split("@")[0];
    return "Admin";
  }, [profile, user]);

  const joinedDate = useMemo(() => {
    const value = profile?.createdAt || (user as any)?.createdAt;
    if (!value) return "—";
    const parsed = new Date(value);
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [profile, user]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        fetchAdminProfile(),
        fetchAdminPostStats()
      ]);
      setProfile(profileData);
      setPostStats(statsData.totals);
      setUser((prev: any) => ({ ...(prev || {}), ...profileData }));
      setForm({
        firstname: profileData.firstname || "",
        lastname: profileData.lastname || "",
        phone: profileData.phone || "",
        address: profileData.address || ""
      });
      setAvatarPreview(profileData.avatarUrl || null);
    } catch (error: any) {
      console.error("Failed to load profile", error);
      Swal.fire("Error", error?.response?.data?.message || "Could not load profile details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await updateAdminProfile({
        ...form,
        avatarFile
      });
      Swal.fire("Saved", "Profile updated successfully", "success");
      setAvatarFile(null);
      setAvatarPreview(updated.avatarUrl || null);
      setProfile(updated);
      setUser((prev: any) => ({ ...(prev || {}), ...updated }));
    } catch (error: any) {
      console.error("Failed to save profile", error);
      Swal.fire("Error", error?.response?.data?.message || "Could not save profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
    { label: "Posts", icon: FileText, path: "/admin-posts" },
    { label: "Users", icon: Users, path: "/admin-users" },
    { label: "Notifications", icon: Bell, path: "/admin-notifications" },
    { label: "Reviews", icon: CheckCircle2, path: "/admin-reviews" }
  ];

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-gray-200 shadow-lg transition-all duration-300 fixed h-screen left-0 top-0 z-40 flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
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
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl shadow-md transition ${
                location.pathname === item.path
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="font-semibold">{item.label}</span>}
            </button>
          ))}

          <button
            onClick={() => navigate("/admin-profile")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl shadow-md transition ${
              location.pathname === "/admin-profile"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <UserCheck className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="font-semibold">My Profile</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 shadow-md transition font-semibold"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"}`}>
        <div className="min-h-screen p-8">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10">
            <div className="bg-linear-to-r from-purple-600 via-indigo-600 to-fuchsia-600 px-8 py-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-8 h-8" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-white text-purple-700 rounded-full p-2 shadow cursor-pointer hover:bg-purple-50">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarChange(e.target.files?.[0] || null)}
                    />
                    <Upload className="w-4 h-4" />
                  </label>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-white/80">Admin Profile</p>
                  <h1 className="text-3xl md:text-4xl font-black leading-tight">{displayName}</h1>
                  <p className="text-white/80 text-sm">Manage your admin account</p>
                </div>
              </div>
              <button
                onClick={loadProfile}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-purple-50 transition disabled:opacity-60"
              >
                <RefreshCw className="w-4 h-4" />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 p-8 bg-white">
              <div className="md:col-span-2 space-y-6">
                {/* Account Details */}
                <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-linear-to-br from-white via-slate-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-purple-600" />
                      <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
                      ADMIN
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <EditableRow
                      label="First name"
                      value={form.firstname}
                      onChange={(v) => handleInputChange("firstname", v)}
                      icon={<PenSquare className="w-4 h-4 text-purple-500" />}
                    />
                    <EditableRow
                      label="Last name"
                      value={form.lastname}
                      onChange={(v) => handleInputChange("lastname", v)}
                      icon={<PenSquare className="w-4 h-4 text-purple-500" />}
                    />
                    <InfoRow label="Email" value={profile?.email || user?.email || "Not provided"} icon={<Mail className="w-4 h-4 text-purple-500" />} />
                    <InfoRow label="Member since" value={joinedDate} icon={<Calendar className="w-4 h-4 text-purple-500" />} />
                    <EditableRow
                      label="Phone"
                      value={form.phone}
                      onChange={(v) => handleInputChange("phone", v)}
                      icon={<Phone className="w-4 h-4 text-purple-500" />}
                    />
                    <EditableRow
                      label="Address"
                      value={form.address}
                      onChange={(v) => handleInputChange("address", v)}
                      icon={<MapPin className="w-4 h-4 text-purple-500" />}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-5 py-3 rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow hover:shadow-lg transition disabled:opacity-60"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Platform Stats */}
                <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900">Platform Posts Overview</h2>
                  </div>

                  <div className="grid sm:grid-cols-4 gap-4">
                    <StatCard label="Total posts" value={postStats.total} accent="from-indigo-500 to-purple-500" icon={<BookOpen className="w-5 h-5" />} />
                    <StatCard label="Approved" value={postStats.approved} accent="from-emerald-500 to-green-500" icon={<CheckCircle2 className="w-5 h-5" />} />
                    <StatCard label="Pending" value={postStats.pending} accent="from-amber-500 to-orange-500" icon={<Clock3 className="w-5 h-5" />} />
                    <StatCard label="Declined" value={postStats.declined} accent="from-rose-500 to-pink-500" icon={<XCircle className="w-5 h-5" />} />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-gray-900">Admin Tips</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Review pending posts regularly.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Monitor user activities and engagement.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Ensure community guidelines are followed.
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-purple-200 bg-linear-to-br from-purple-50 via-white to-fuchsia-50 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900">Admin Dashboard</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">
                    Go to the admin dashboard to manage posts, users, and system notifications.
                  </p>
                  <button
                    onClick={() => navigate("/admin-dashboard")}
                    className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow hover:shadow-lg transition"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type InfoRowProps = { label: string; value: string | number; icon: ReactNode };

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
        <p className="text-sm font-bold text-gray-900">{value || "—"}</p>
      </div>
    </div>
  );
}

type EditableRowProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: ReactNode;
};

function EditableRow({ label, value, onChange, icon }: EditableRowProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">{icon}</div>
      <div className="w-full">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
        <input
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter value"
        />
      </div>
    </div>
  );
}

type StatCardProps = { label: string; value: number; accent: string; icon: ReactNode };

function StatCard({ label, value, accent, icon }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${accent} text-white flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

export default AdminProfilePage;
