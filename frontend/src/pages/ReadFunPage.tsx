import { useState, useEffect, type MouseEvent } from "react";
import { Sparkles, Search, Filter, Tag, Eye, BookOpen, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import api from "../services/api";

interface Post {
  _id: string
  title: string
  category: string
  content: string
  tags: string
  createdAt: string
  views?: number
  image?: string
  likes?: number
  likedBy?: string[]
}

export default function ReadFunPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likingId, setLikingId] = useState<string | null>(null);

  const getCurrentUserId = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      return payload?.sub || payload?._id || payload?.id || null;
    } catch (err) {
      console.warn("Failed to decode token", err);
      return null;
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  const fetchApproved = async () => {
    try {
      setLoading(true);
      console.log("Fetching approved posts from /post/approved...");
      
      const response = await api.get("/post/approved");
      console.log("Response:", response);
      
      const postsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      console.log("Posts data:", postsData);
      setPosts(postsData);
      setFiltered(postsData);

      const userId = getCurrentUserId();
      if (userId) {
        const liked: Record<string, boolean> = {};
        postsData.forEach((p: Post) => {
          if (p.likedBy?.some((id) => id === userId)) {
            liked[p._id] = true;
          }
        });
        setLikedMap(liked);
      } else {
        setLikedMap({});
      }
      
      if (!postsData || postsData.length === 0) {
        Swal.fire("Info", "No approved posts found yet.", "info");
      }
    } catch (error: any) {
      console.error("Failed to fetch posts:", error);
      Swal.fire("Error", "Failed to load posts: " + (error?.response?.data?.message || error.message), "error");
      setPosts([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterLogic();
  }, [search, category]);

  const filterLogic = () => {
    let data = posts.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(search.toLowerCase());
      const tagsMatch = item.tags.toLowerCase().includes(search.toLowerCase());
      return titleMatch || tagsMatch;
    });

    if (category !== "all") {
      data = data.filter((item) => item.category === category);
    }

    setFiltered(data);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleLikeClick = async (e: MouseEvent, postId: string) => {
    e.stopPropagation();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire("Login required", "Please login to like posts.", "info");
      return;
    }

    try {
      setLikingId(postId);
      const { data } = await api.put(`/post/${postId}/like`);

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: data.likes } : p))
      );

      setFiltered((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: data.likes } : p))
      );

      setLikedMap((prev) => ({ ...prev, [postId]: data.liked }));

      setSelectedPost((prev) =>
        prev && prev._id === postId ? { ...prev, likes: data.likes } : prev
      );
    } catch (error: any) {
      if (error?.response?.status === 401) {
        Swal.fire("Login required", "Please login to like posts.", "info");
      } else {
        Swal.fire("Error", "Failed to update like.", "error");
      }
    } finally {
      setLikingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-fuchsia-50 via-violet-50 to-slate-50">
      {/* Hero */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-fuchsia-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-md">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Read & Fun</h1>
              <p className="text-gray-600 text-lg">
                Explore approved stories, poems & creative magic 🌟
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stories or tags..."
                className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-fuchsia-500 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-fuchsia-500 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option>Story</option>
                <option>Poem</option>
                <option>Quote</option>
                <option>Short Tale</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-fuchsia-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-gray-900">Loading posts...</h3>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {filtered.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                {post.image ? (
                  <div className="h-44 relative overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-44 bg-linear-to-br from-violet-500 to-fuchsia-500 relative">
                    <Sparkles className="absolute inset-0 m-auto text-white/40 w-14 h-14" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-3">
                    {post.title}
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views || 0}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="flex items-center gap-1 text-fuchsia-600 hover:text-fuchsia-700 font-semibold disabled:opacity-50"
                        disabled={likingId === post._id}
                        onClick={(e) => handleLikeClick(e, post._id)}
                        aria-label="Like post"
                      >
                        <Heart
                          className="w-4 h-4"
                          fill={likedMap[post._id] ? "#e11d48" : "none"}
                          strokeWidth={likedMap[post._id] ? 0 : 2}
                        />
                        {post.likes ?? 0}
                      </button>
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {post.tags ? post.tags.substring(0, 20) + (post.tags.length > 20 ? "..." : "") : "No tags"}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No results found</h3>
            <p className="text-gray-600">Try different search or filters</p>
          </div>
        )}
      </div>

      {/* Read More Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              className="bg-white max-w-3xl w-full mx-4 rounded-2xl shadow-xl p-8 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-black mb-4">{selectedPost.title}</h2>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-lg">{selectedPost.category}</span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" /> {selectedPost.views} reads
                  </span>
                </div>
                <button
                  className="flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 font-semibold disabled:opacity-50"
                  disabled={likingId === selectedPost._id}
                  onClick={(e) => handleLikeClick(e, selectedPost._id)}
                  aria-label="Like post"
                >
                  <Heart
                    className="w-5 h-5"
                    fill={likedMap[selectedPost._id] ? "#e11d48" : "none"}
                    strokeWidth={likedMap[selectedPost._id] ? 0 : 2}
                  />
                  {selectedPost.likes ?? 0}
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </p>
              <button
                className="mt-6 px-6 py-3 bg-fuchsia-600 text-white rounded-xl hover:bg-fuchsia-700"
                onClick={() => setSelectedPost(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer (same as Home/About) */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold">SparkTales</span>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} SparkTales — Built for storytellers with ❤️
            </p>
            <div className="flex gap-6 text-gray-400">
              <span className="hover:text-white cursor-pointer transition">Privacy</span>
              <span className="hover:text-white cursor-pointer transition">Terms</span>
              <span className="hover:text-white cursor-pointer transition">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
