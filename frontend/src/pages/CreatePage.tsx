import { useState, useEffect } from "react";
import { Sparkles, Upload, Image as ImageIcon, Tag, FileText, Calendar, Eye, Edit, Trash2, CheckCircle2, Clock, XCircle, X } from "lucide-react";
import Swal from "sweetalert2";
import { createPost, getMyPosts, updatePost } from "../services/posts";
import type { Post as ApiPost } from "../services/posts";

export default function Creative() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Story");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [myPosts, setMyPosts] = useState<ApiPost[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("create");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalData, setModalData] = useState<{ type: "view" | "edit" | "delete"; post: ApiPost } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);


  useEffect(() => {
    fetchMyPostsFromApi();
  }, []);

  const fetchMyPostsFromApi = async () => {
    try {
      const data = await getMyPosts();
      setMyPosts((data as ApiPost[]) || []);
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || "Failed to load your posts", "error");
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("File too large", "Image must be less than 5MB", "warning");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!title || !content || !category) {
      Swal.fire("Missing fields", "Title, content, and category are required", "warning");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("tags", tags);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createPost(formData);

      Swal.fire("Submitted", "Your creation has been submitted for review!", "success");

      setTitle("");
      setCategory("Story");
      setTags("");
      setContent("");
      setPreviewImage(null);
      setImageFile(null);
      fetchMyPostsFromApi();
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || "Failed to submit post", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPosts = filterStatus === "all"
    ? myPosts
    : myPosts.filter(post => post.status === filterStatus.toUpperCase());

  const statusConfig = {
    APPROVED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
    PENDING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
    DECLINED: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: XCircle }
  };

  const handleModalClose = () => setModalData(null);

  const handleDelete = async (postId: string) => {
    const result = await Swal.fire({
      title: "Delete Post?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        setMyPosts(prev => prev.filter(p => p._id !== postId));
        handleModalClose();
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete post", "error");
      }
    }
  };

  const handleEditImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("File too large", "Image must be less than 5MB", "warning");
      return;
    }
    setEditImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setEditPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEditSave = async () => {
    if (!modalData) return;
    const { post } = modalData;
    if (!post.title || !post.content || !post.category) {
      Swal.fire("Missing fields", "Title, content, and category are required", "warning");
      return;
    }
    try {
      setIsSubmitting(true);

      let payload: FormData | Partial<ApiPost>;
      if (editImageFile) {
        const fd = new FormData();
        fd.append("title", post.title);
        fd.append("content", post.content);
        fd.append("category", post.category);
        fd.append("tags", post.tags || "");
        fd.append("image", editImageFile);
        payload = fd;
      } else {
        payload = {
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags || "",
        };
      }

      const res = await updatePost(post._id, payload);
      const updatedPost: ApiPost = (res.post || res) as ApiPost;

      setMyPosts(prev => prev.map(p => (p._id === post._id ? { ...p, ...updatedPost } : p)));
      handleModalClose();
      setEditImageFile(null);
      setEditPreviewImage(null);
      Swal.fire("Updated!", "Your post changes are saved.", "success");
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || "Failed to save post", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-violet-50 to-fuchsia-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              Creative Studio
            </h1>
            <p className="text-gray-600 text-lg">Craft your stories and share them with the world</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "create" ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Create New
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "manage" ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              My Creations
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Create Tab */}
        {activeTab === "create" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Creation Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create Something Magical</h2>
                <p className="text-violet-100">Let your creativity flow and craft your masterpiece</p>
              </div>
              <div className="p-8 space-y-6">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                    <FileText className="w-5 h-5 text-violet-600" /> Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your creation a captivating title..."
                  />
                </div>

                {/* Category & Tags */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                      <Sparkles className="w-5 h-5 text-violet-600" /> Category
                    </label>
                    <select
                      className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>Story</option>
                      <option>Poem</option>
                      <option>Quote</option>
                      <option>Short Tale</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                      <Tag className="w-5 h-5 text-violet-600" /> Tags
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="fantasy, adventure, love"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                    <ImageIcon className="w-5 h-5 text-violet-600" /> Cover Image (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-violet-500 hover:bg-violet-50 transition-all cursor-pointer group"
                    >
                      {previewImage ? (
                        <div className="relative w-full h-full">
                          <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 mb-2 group-hover:text-violet-600 transition-colors" />
                          <p className="text-gray-600 font-medium">Click to upload cover image</p>
                          <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                    <Edit className="w-5 h-5 text-violet-600" /> Your Story
                  </label>
                  <textarea
                    required
                    rows={10}
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Once upon a time... Write your beautiful story here..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">{content.length} characters</p>
                    <p className="text-sm text-gray-500">~{Math.ceil(content.split(" ").length / 200)} min read</p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" /> {isSubmitting ? "Submitting..." : "Submit for Review"}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" /> Writing Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-2 shrink-0" />
                    <span>Create a captivating title that draws readers in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-2 shrink-0" />
                    <span>Use descriptive tags to help readers find your work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-2 shrink-0" />
                    <span>Add a striking cover image to make your story stand out</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-2 shrink-0" />
                    <span>Proofread your work before submitting</span>
                  </li>
                </ul>
              </div>

              <div className="bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-violet-100">Total Posts</span>
                    <span className="text-2xl font-bold">{myPosts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-violet-100">Approved</span>
                    <span className="text-2xl font-bold">{myPosts.filter(p => p.status === "APPROVED").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-violet-100">Pending</span>
                    <span className="text-2xl font-bold">{myPosts.filter(p => p.status === "PENDING").length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-amber-900 mb-2">Review Process</h3>
                <p className="text-sm text-amber-700">
                  All submissions are reviewed within 24-48 hours to ensure quality and adherence to our community guidelines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === "manage" && (
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Creations</h2>
              <div className="flex gap-2">
                {["all", "approved", "pending", "declined"].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setFilterStatus(filter)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${filterStatus === filter ? "bg-violet-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => {
                const status = post.status ?? "PENDING";
                const config = statusConfig[status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                return (
                  <div key={post._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                    <div className="h-48 bg-linear-to-br from-violet-400 to-fuchsia-400 relative overflow-hidden">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-16 h-16 text-white/50" />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{post.title}</h3>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">{post.category}</span>
                        {status === "APPROVED" && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            {post.views}
                          </span>
                        )}
                      </div>

                      <div className={`flex items-center justify-between p-3 rounded-xl border ${config.bg} ${config.border} ${config.text}`}>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-5 h-5" />
                          <span className="font-bold text-sm capitalize">{status.toLowerCase()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button onClick={() => setModalData({ type: "view", post })} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button onClick={() => setModalData({ type: "edit", post })} className="px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-lg font-medium transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setModalData({ type: "delete", post })} className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg font-medium transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No creations found</h3>
                <p className="text-gray-600">Start creating your first masterpiece!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
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
      </footer>

      {/* Modals */}
      {modalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            <button onClick={handleModalClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            {modalData.type === "view" && (
              <>
                <h2 className="text-2xl font-bold mb-2">{modalData.post.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{modalData.post.category} • {modalData.post.status}</p>
                <p className="text-gray-700 whitespace-pre-wrap">{modalData.post.content}</p>
              </>
            )}

            {modalData.type === "edit" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
                <input
                  type="text"
                  className="w-full mb-3 px-4 py-2 border rounded-lg"
                  value={modalData.post.title}
                  onChange={e => setModalData(prev => prev ? { ...prev, post: { ...prev.post, title: e.target.value } } : null)}
                />
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={modalData.post.category}
                    onChange={e => setModalData(prev => prev ? { ...prev, post: { ...prev.post, category: e.target.value } } : null)}
                  >
                    <option>Story</option>
                    <option>Poem</option>
                    <option>Quote</option>
                    <option>Short Tale</option>
                    <option>Other</option>
                  </select>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="tags"
                    value={modalData.post.tags || ""}
                    onChange={e => setModalData(prev => prev ? { ...prev, post: { ...prev.post, tags: e.target.value } } : null)}
                  />
                </div>
                <textarea
                  className="w-full mb-3 px-4 py-2 border rounded-lg"
                  rows={5}
                  value={modalData.post.content}
                  onChange={e => setModalData(prev => prev ? { ...prev, post: { ...prev.post, content: e.target.value } } : null)}
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image (Optional)</label>
                  <div className="relative">
                    <input type="file" id="edit-image-upload" className="hidden" accept="image/*" onChange={handleEditImageChange} />
                    <label htmlFor="edit-image-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-500">
                      {editPreviewImage || modalData.post.image ? (
                        <img src={editPreviewImage || (modalData.post.image as string)} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-gray-500">Click to upload image</span>
                      )}
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleEditSave}
                  className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}

            {modalData.type === "delete" && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-rose-600">Delete Post</h2>
                <p className="mb-4 text-gray-700">Are you sure you want to delete <strong>{modalData.post.title}</strong>? This action cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={handleModalClose} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                  <button 
                    onClick={() => handleDelete(modalData.post._id)} 
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}