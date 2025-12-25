import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { register } from "../services/auth";
import Swal from "sweetalert2";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload = {
        firstname: firstName,
        lastname: lastName,
        email,
        password
      }

      const res = await register(payload)

      await Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: res?.message || "Your account has been created.",
        confirmButtonText: "Continue to login"
      })

      // registration success -> redirect to login
      window.location.href = "/login"
    } catch (err: any) {
      console.error(err)
      const message = err?.response?.data?.message || err?.message || "Registration failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: branding */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-linear-to-br from-purple-600 to-pink-500 text-white gap-6">
          <div>
           
            <h2 className="text-3xl font-extrabold">Create your SparkTales account</h2>
            <p className="mt-2 text-sm opacity-90">Join our community of writers — share your stories and reach new readers.</p>
          </div>
          <img src="/images/s-register.png" alt="illustration" className="w-full max-w-xs opacity-95 mt-4" />
          <div className="mt-4">
            <p className="text-sm">Already registered?</p>
            <a href="/login" className="mt-2 inline-block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-semibold">Sign in</a>
          </div>
        </div>

        {/* Right: form */}
        <div className="p-8 md:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
                 <div className="flex justify-center mb-4">
              <img src="/images/s-logo.png" alt="decor" className="w-28 h-auto opacity-95" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-sm text-gray-500 mb-6">Enter your details to register an account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="First name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow hover:scale-[1.01] transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Creating..." : "Create account"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-600">
              By creating an account you agree to our <a href="#" className="text-purple-600 font-medium hover:underline">Terms</a> and <a href="#" className="text-purple-600 font-medium hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;