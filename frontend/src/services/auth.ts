import api from "./api"

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { email: username, password })

  return res.data
}

export const register = async (payload: {
  firstname: string
  lastname: string
  email: string
  password: string
}) => {
  const res = await api.post("/auth/register", payload)

  return res.data
}

export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", {
    token: refreshToken
  })
  return res.data
}

export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forgot", { email })
  return res.data
}

export const resetPassword = async (token: string, password: string) => {
  const res = await api.post("/auth/reset", { token, password })
  return res.data
}

export const forgotOtp = async (email: string) => {
  const res = await api.post("/auth/forgot-otp", { email })
  return res.data
}

export const verifyOtp = async (email: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", { email, otp })
  return res.data
}

export const resetWithOtp = async (email: string, otp: string, password: string) => {
  const res = await api.post("/auth/reset-otp", { email, otp, password })
  return res.data
}