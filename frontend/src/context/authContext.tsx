import { createContext, useContext, useEffect, useState } from "react"
import { getMyDetails } from "../services/auth"

const AuthContext = createContext<any>(null)

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      getMyDetails()
        .then((res) => {
          console.log("AuthContext: getMyDetails response:", res)
          if (res.data) {
            console.log("AuthContext: Setting user with data:", res.data)
            setUser(res.data)
          } else {
            console.warn("AuthContext: No data in response")
            setUser(null)
          }
        })
        .catch((err) => {
          console.error("AuthContext: Failed to fetch user details:", err)
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      console.log("AuthContext: No token found in localStorage")
      setUser(null)
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}