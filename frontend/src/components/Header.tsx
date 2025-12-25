import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Menu, X, ChevronDown, LogOut, User, PenTool } from "lucide-react";
import { useAuth } from "../context/authContext";

export default function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  console.log("Header: Current user:", user);
  console.log("Header: User roles:", user?.roles);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-4">

        {/* TOP LEFT LOGO + MAIN CONTENT WRAPPER */}
        <div className="flex items-center justify-between">

          {/* LEFT SECTION: IMAGE + LOGO */}
          <div className="flex items-center gap-4">

            {/* Small Top Image */}
            <div className="flex justify-center">
              <img
                src="/images/s-logo.png"
                alt="decor"
                className="w-14 h-auto opacity-95"
              />
            </div>

            {/* LOGO TEXT */}
            <Link to="/home" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SparkTales
              </span>
            </Link>

          </div>

          {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/home" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-purple-600 font-medium">About</Link>
              <Link to="/create" className="text-gray-700 hover:text-purple-600 font-medium">Creative</Link>
              <Link to="/read" className="text-gray-700 hover:text-purple-600 font-medium">Read & Fun</Link>
              <Link to="/reviews" className="text-gray-700 hover:text-purple-600 font-medium">Reviews</Link>
              <Link to="/contact" className="text-gray-700 hover:text-purple-600 font-medium">Contact Us</Link>
              
            </nav>

          {/* DESKTOP PROFILE DROPDOWN */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100 transition"
              >
                <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-gray-700 font-medium max-w-[120px] truncate">
                  {user?.email?.split("@")[0] || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border py-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    My Profile
                  </Link>

                  <Link
                    to="/notifications"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <PenTool className="w-4 h-4 text-gray-600" />
                    Notifications
                  </Link>

                  {/* {user?.roles?.includes("ADMIN") && (
                    <Link
                      to="/admin-dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <PenTool className="w-4 h-4 text-gray-600" />
                      Admin Dashboard
                    </Link>
                  )} */}

                  <div className="border-t my-2" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* MOBILE NAV MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-5 border-t pt-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 backdrop-blur-sm shadow-sm p-4 space-y-4">
              {user ? (
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.email || "User"}</p>
                    <p className="text-xs text-gray-500">Signed in</p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-sm font-semibold text-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-3 rounded-xl bg-white border border-gray-200 font-semibold text-gray-800 shadow-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-md"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              <nav className="grid gap-2">
                <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm">Home</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm">About Us</Link>
                <Link to="/create" onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm">Creative</Link>
                <Link to="/read" onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm">Read & Fun</Link>
                <Link to="/reviews" onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm">Reviews</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm">Contact Us</Link>
              </nav>

              {user && (
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <p className="text-xs font-semibold text-gray-500">Your stuff</p>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm">My Profile</Link>
                  <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm">Notifications</Link>
                  {/* {user.roles?.includes("ADMIN") && (
                    <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-800 font-medium shadow-sm">Admin Dashboard</Link>
                  )} */}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
