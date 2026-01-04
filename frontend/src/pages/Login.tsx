
// import axios from "axios";
import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { login, getMyDetails, forgotOtp, resetWithOtp } from "../services/auth"
import Swal from "sweetalert2"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { setUser } = useAuth()
  const navigate = useNavigate()
  const passwordRef = useRef<HTMLInputElement | null>(null)

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  const focusPasswordOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      passwordRef.current?.focus()
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // prevent page refresh

    if (!username.trim() || !password.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please enter both username and password."
      })
      return
    }

    try {
      const data: any = await login(username, password)
      console.log("Login response:", data)

      if (data?.data?.accessToken) {
        await localStorage.setItem("accessToken", data.data.accessToken)
        await localStorage.setItem("refreshToken", data.data.refreshToken)
        console.log("Tokens saved. Login data roles:", data.data.roles)

        const resData = await getMyDetails()
        console.log("getMyDetails response:", resData)
        console.log("Setting user with roles:", resData.data?.roles)

        setUser(resData.data)

        await Swal.fire({
          icon: "success",
          title: "Login successful",
          text: "Welcome back!",
          timer: 1400,
          showConfirmButton: false
        })

        // Redirect based on role
        const userRoles = resData.data?.roles || []
        if (userRoles.includes("ADMIN")) {
          console.log("Admin detected, redirecting to admin-dashboard")
          navigate("/admin-dashboard")
        } else {
          console.log("Regular user, redirecting to home")
          navigate("/home")
        }
      } else {
        await Swal.fire({
          icon: "error",
          title: "Login failed",
          text: "Please check your credentials."
        })
      }
    } catch (err) {
      console.error("Login error:", err)
      await Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Please check your credentials."
      })
    }

    // ----- Example of axios call (besic) -----
    /*
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email: username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
    */
  }

  const handleForgot = async () => {
    const { value: email } = await Swal.fire({
      title: 'Reset password',
      input: 'email',
      inputLabel: 'Enter your account email',
      inputPlaceholder: 'name@example.com',
      showCancelButton: true
    })

    if (!email) return

    try {
      // request OTP to be sent to user's email
      const res: any = await forgotOtp(email)

      // if SMTP not configured the backend returns OTP in response for dev convenience
      const otpFromServer = res?.otp

      await Swal.fire({ icon: 'success', title: 'OTP requested', text: 'If the email exists, an OTP has been sent.' })

      // ask user for OTP
      const { value: enteredOtp } = await Swal.fire({
        title: 'Enter OTP',
        input: 'text',
        inputLabel: 'Enter the 6-digit code sent to your email',
        inputPlaceholder: '123456',
        showCancelButton: true
      })

      if (!enteredOtp && !otpFromServer) return

      const otpToUse = enteredOtp || otpFromServer

      // ask for new password
      const { value: newPassword } = await Swal.fire({
        title: 'Set new password',
        input: 'password',
        inputLabel: 'Enter your new password',
        inputPlaceholder: 'New password',
        inputAttributes: { autocapitalize: 'off' },
        showCancelButton: true
      })

      if (!newPassword) return

      // call reset with otp
      await resetWithOtp(email, otpToUse, newPassword)

      await Swal.fire({ icon: 'success', title: 'Password reset', text: 'You can now log in with your new password.' })
    } catch (err: any) {
      console.error('Forgot/reset error', err)
      const message = err?.response?.data?.message || err?.message || 'Failed to reset password'
      await Swal.fire({ icon: 'error', title: 'Error', text: message })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: branding / illustration */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-linear-to-br from-purple-600 to-pink-500 text-white gap-6">
          <div>
            <h2 className="text-3xl font-extrabold">Welcome back to SparkTales</h2>
            <p className="mt-2 text-sm opacity-90">Write, share and discover stories with a vibrant community.</p>
          </div>
          <img src="/images/s-login.png" alt="illustration" className="w-full max-w-xs opacity-95 mt-4" />
          <div className="mt-4">
            <p className="text-sm">New here?</p>
            <button
              onClick={() => navigate("/register")}
              className="mt-2 inline-block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-semibold"
            >
              Create an account
            </button>
          </div>
        </div>

        {/* Right: form */}
        <div className="p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* small right-side image */}
            <div className="flex justify-center mb-4">
              <img src="/images/s-logo.png" alt="decor" className="w-28 h-auto opacity-95" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in to SparkTales</h1>
            <p className="text-sm text-gray-500 mb-6">Enter your username and password to continue.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={focusPasswordOnEnter}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
                onKeyDown={submitOnEnter}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                  <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={handleForgot} className="text-sm text-purple-600 font-medium hover:underline">Forgot password?</button>
                  <button type="button" onClick={() => navigate("/register")} className="text-sm text-purple-600 font-medium hover:underline">Register</button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow hover:scale-[1.01] transition"
                >
                  Login
                </button>
              </div>

              <div className="pt-3 text-center text-sm text-gray-500">
                Or continue without an account
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}