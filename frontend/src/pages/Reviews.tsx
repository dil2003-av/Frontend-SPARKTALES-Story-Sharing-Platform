import { useState, useEffect } from "react";
import { Star, User, Award, MessageCircle, Filter, TrendingUp, Edit2, Trash2, Eye, X } from "lucide-react";
import Swal from "sweetalert2";
import { getAllReviews, createReview, updateReview, deleteReview } from "../services/reviews";
import type { Review as ApiReview } from "../services/reviews";
import { getAllApprovedPosts } from "../services/posts";
import type { Post } from "../services/posts";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [approvedPosts, setApprovedPosts] = useState<Post[]>([]);
  const [postId, setPostId] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit/Delete/View states
  const [viewingReview, setViewingReview] = useState<ApiReview | null>(null);
  const [editingReview, setEditingReview] = useState<ApiReview | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  useEffect(() => {
    fetchAllReviews();
    fetchApprovedPosts();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const data = await getAllReviews();
      console.log("Reviews data:", data);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load reviews", err);
      Swal.fire("Error", err?.response?.data?.message || "Failed to load reviews", "error");
    }
  };

  const fetchApprovedPosts = async () => {
    try {
      const data = await getAllApprovedPosts();
      console.log("Approved posts:", data);
      setApprovedPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load approved posts", err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!postId || !comment || rating < 1 || rating > 5) {
      Swal.fire("Missing fields", "Post ID, rating, and comment are required", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      await createReview({ post: postId, rating, comment, name: name || undefined });
      Swal.fire("Success!", "Your review has been submitted", "success");
      setPostId("");
      setName("");
      setRating(5);
      setComment("");
      fetchAllReviews();
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || "Failed to submit review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewReview = (review: ApiReview) => {
    setViewingReview(review);
  };

  const handleEditClick = (review: ApiReview) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleEditSubmit = async () => {
    if (!editingReview || !editComment || editRating < 1 || editRating > 5) {
      Swal.fire("Missing fields", "Rating and comment are required", "warning");
      return;
    }

    try {
      setIsEditSubmitting(true);
      await updateReview(editingReview._id, { rating: editRating, comment: editComment });
      Swal.fire("Success!", "Review updated successfully", "success");
      setEditingReview(null);
      fetchAllReviews();
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || "Failed to update review", "error");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: "Are you sure you want to delete this review? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await deleteReview(reviewId);
        Swal.fire("Deleted!", "Your review has been deleted.", "success");
        fetchAllReviews();
      } catch (err: any) {
        Swal.fire("Error", err?.response?.data?.message || "Failed to delete review", "error");
      }
    }
  };

  const getFilteredReviews = () => {
    let filtered = [...reviews];
    
    if (filterRating !== "all") {
      filtered = filtered.filter(r => r.rating === Number(filterRating));
    }
    
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "highest") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      filtered.sort((a, b) => a.rating - b.rating);
    }
    
    return filtered;
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                <Star className="w-9 h-9 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black text-gray-900">Community Reviews</h1>
                <p className="text-gray-600 text-lg mt-1">Share your thoughts and discover what others are saying</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-4xl font-black text-pink-600 mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-4xl font-black text-purple-600 mb-2">{reviews.length}</div>
            <MessageCircle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">
              {reviews.length}
            </div>
            <Award className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">
              {ratingCounts[0].count}
            </div>
            <Star className="w-6 h-6 text-amber-400 fill-amber-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600">5-Star Reviews</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Filter className="w-4 h-4" />
                    Filter by Rating
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-medium"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    Sort By
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-medium"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {getFilteredReviews().map((review) => (
              <div key={review._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-linear-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-900">{review.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Post: {typeof review.post === 'string' ? review.post : review.post.title || review.post._id}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-gray-700">{review.rating}.0</span>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewReview(review)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleEditClick(review)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {getFilteredReviews().length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-3">
                {ratingCounts.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-semibold text-gray-700">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-pink-600" />
                Write a Review
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select a Post (Required)</label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                  >
                    <option value="">-- Select a post to review --</option>
                    {approvedPosts.map((post) => (
                      <option key={post._id} value={post._id}>
                        {post.title} ({post.category})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Only approved posts are available for review</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to use your account name</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="group"
                      >
                        <Star
                          className={`w-8 h-8 transition-all ${
                            star <= rating
                              ? "text-yellow-400 fill-yellow-400 scale-110"
                              : "text-gray-300 group-hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{rating} out of 5 stars</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all resize-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this post..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{comment.length} characters</p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Review Modal */}
      {viewingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingReview(null)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Details</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{viewingReview.name}</h3>
                <p className="text-sm text-gray-500">
                  Post: {typeof viewingReview.post === 'string' ? viewingReview.post : viewingReview.post.title || viewingReview.post._id}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Rating</h4>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < viewingReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold text-gray-700">{viewingReview.rating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Review</h4>
                <p className="text-gray-700 leading-relaxed">{viewingReview.comment}</p>
              </div>

              <div className="text-xs text-gray-500">
                Posted on {new Date(viewingReview.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingReview(null)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Review</h2>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Rating</h4>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="group"
                    >
                      <Star
                        className={`w-8 h-8 transition-all ${
                          star <= editRating
                            ? "text-yellow-400 fill-yellow-400 scale-110"
                            : "text-gray-300 group-hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">{editRating} out of 5 stars</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all resize-none"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Update your review..."
                />
                <p className="text-xs text-gray-500 mt-1">{editComment.length} characters</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleEditSubmit}
                  disabled={isEditSubmitting}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditSubmitting ? "Updating..." : "Update Review"}
                </button>
                <button
                  onClick={() => setEditingReview(null)}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-pink-400 fill-pink-400" />
            <span className="text-xl font-bold">SparkTales</span>
          </div>
          <p className="text-gray-400">
            © {new Date().getFullYear()} SparkTales — Your feedback matters
          </p>
          <div className="flex gap-6 text-gray-400">
            <span className="hover:text-white cursor-pointer transition">Privacy</span>
            <span className="hover:text-white cursor-pointer transition">Terms</span>
            <span className="hover:text-white cursor-pointer transition">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}