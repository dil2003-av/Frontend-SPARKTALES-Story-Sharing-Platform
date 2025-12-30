import { lazy, Suspense, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/authContext"
import Layout from "../components/Layout"

const Index = lazy(() => import("../pages/index"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))
const About = lazy(() => import("../pages/About"))
const Home = lazy(() => import("../pages/Home"))
// const Post = lazy(() => import("../pages/Post"))
// const MyPost = lazy(() => import("../pages/MyPost"))
const CreatePage = lazy(() => import("../pages/CreatePage"))
const ReadFunPage = lazy(() => import("../pages/ReadFunPage"))
const ContactUs = lazy(() => import("../pages/Contact"))
const Reviews = lazy(() => import("../pages/Reviews"))
const AdminDashboard = lazy(() => import("../pages/admin-dashboard"))
const AdminPosts = lazy(() => import("../pages/admin-posts"))
const AdminUsers = lazy(() => import("../pages/admin-users"))
const AdminReviews = lazy(() => import("../pages/admin-reviews"))
const AdminNotification = lazy(() => import("../pages/admin-notification"))
const Notifications = lazy(() => import("../pages/Notification"))
const UserProfile = lazy(() => import("../pages/UserProfile"))


type RequireAuthTypes = { children: ReactNode; roles?: string[] }

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.some((role) => user.roles?.includes(role))) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  return <>{children}</>
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/notifications"
            element={
              <RequireAuth>
                <Notifications />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-posts"
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminPosts />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-users"
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminUsers />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-notifications"
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminNotification />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-reviews"
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminReviews />
              </RequireAuth>
            }
          />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/home" element={<Home />} />
            {/* <Route path="/post" element={<Post />} /> */}
            <Route path="/create" element={<CreatePage />} />
            <Route path="/read" element={<ReadFunPage />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/profile" element={<UserProfile />} />
            
            <Route
              path="/my-post"
              element={
                <RequireAuth roles={["ADMIN", "AUTHOR"]}>
                  <CreatePage />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}