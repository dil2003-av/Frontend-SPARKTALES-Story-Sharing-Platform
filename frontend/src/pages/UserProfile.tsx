import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Sparkles,
  Mail,
  Shield,
  Calendar,
  User,
  BookOpen,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  PenSquare,
  Phone,
  MapPin,
  Upload
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/authContext";
import {
  fetchUserProfile,
  fetchMyPostsWithStats,
  updateUserProfile,
  type UserProfile
} from "../services/userProfile";

export default function UserProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [postStats, setPostStats] = useState<{ total: number; approved: number; pending: number; declined: number }>(
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

  const displayName = useMemo(() => {
    const source = profile || user;
    if (!source) return "Storyteller";
    if (source.firstname || source.lastname) {
      return `${source.firstname ?? ""} ${source.lastname ?? ""}`.trim();
    }
    if ((source as any).username) return (source as any).username;
    if (source.email) return source.email.split("@")[0];
    return "Storyteller";
  }, [profile, user]);

  const avatarToShow = useMemo(() => {
    return avatarPreview || profile?.avatarUrl || (user as any)?.avatarUrl || null;
  }, [avatarPreview, profile, user]);

  const joinedDate = useMemo(() => {
    const value = profile?.createdAt || (user as any)?.createdAt;
    if (!value) return "—";
    const parsed = new Date(value);
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [profile, user]);

  const displayInitial = useMemo(() => {
    const source = profile || user;
    const email = source?.email || "";
    if (email) return email.charAt(0).toUpperCase();
    if (displayName) return displayName.charAt(0).toUpperCase();
    return "S";
  }, [profile, user, displayName]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [profileData, postData] = await Promise.all([
        fetchUserProfile(),
        fetchMyPostsWithStats()
      ]);
      setProfile(profileData);
      setPostStats(postData.totals);
      // keep auth context in sync if backend returned fresher info
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
      const updated = await updateUserProfile({
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-fuchsia-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10">
          <div className="bg-linear-to-r from-purple-600 via-indigo-600 to-fuchsia-600 px-8 py-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                  {avatarToShow ? (
                    <img src={avatarToShow} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-2xl font-black text-white bg-purple-500/60">
                      {displayInitial}
                    </span>
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
                <p className="text-sm uppercase tracking-widest text-white/80">Your Profile</p>
                <h1 className="text-3xl md:text-4xl font-black leading-tight">{displayName}</h1>
                <p className="text-white/80 text-sm">Manage your account and track your storytelling journey</p>
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
              <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-linear-to-br from-white via-slate-50 to-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
                    {profile?.roles?.[0] || (user?.roles?.[0] ?? "READER")}
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
                  <AvatarEmailRow
                    label="Email"
                    email={profile?.email || user?.email || "Not provided"}
                    avatarUrl={avatarToShow}
                    fallbackInitial={displayInitial}
                  />
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
                  <InfoRow
                    label="Roles"
                    value={(profile?.roles || user?.roles || ["READER"]).join(", ")}
                    icon={<Shield className="w-4 h-4 text-purple-500" />}
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

              <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Story Performance</h2>
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  <StatCard label="Total posts" value={postStats.total} accent="from-indigo-500 to-purple-500" icon={<BookOpen className="w-5 h-5" />} />
                  <StatCard label="Approved" value={postStats.approved} accent="from-emerald-500 to-green-500" icon={<CheckCircle2 className="w-5 h-5" />} />
                  <StatCard label="Pending" value={postStats.pending} accent="from-amber-500 to-orange-500" icon={<Clock3 className="w-5 h-5" />} />
                  <StatCard label="Declined" value={postStats.declined} accent="from-rose-500 to-pink-500" icon={<XCircle className="w-5 h-5" />} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-gray-900">Quick Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Keep your email verified and up to date.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Publish consistently to grow your audience.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Use tags so readers can discover your stories faster.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-linear-to-br from-purple-50 via-white to-fuchsia-50 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Need changes?</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Profile edits are currently handled by our support team. If something looks incorrect, let us know and we will update it.
                </p>
                <a
                  href="mailto:support@sparktales.com?subject=Profile%20update%20request"
                  className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow hover:shadow-lg transition"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type InfoRowProps = { label: string; value: string | number; icon: React.ReactNode };

type AvatarEmailRowProps = {
  label: string;
  email: string;
  avatarUrl?: string | null;
  fallbackInitial: string;
};

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

function AvatarEmailRow({ label, email, avatarUrl, fallbackInitial }: AvatarEmailRowProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 overflow-hidden flex items-center justify-center text-sm font-bold text-purple-700">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          fallbackInitial
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
        <p className="text-sm font-bold text-gray-900 break-all">{email || "—"}</p>
      </div>
    </div>
  );
}

type StatCardProps = { label: string; value: number; accent: string; icon: React.ReactNode };

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
