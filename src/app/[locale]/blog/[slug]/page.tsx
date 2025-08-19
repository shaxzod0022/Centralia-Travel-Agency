"use client";
import { BlogService } from "@/services/blog.service";
import { BlogProps, Comment } from "@/interfaces/insights.interface";
import { TranslationsProps } from "@/interfaces/helper.interface";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Eye,
  MessageCircle,
  Share2,
  Star,
  User,
  Bookmark,
  ThumbsDown,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin
} from "lucide-react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default function BlogDetailPage({ params }: Props) {
  const [blog, setBlog] = useState<BlogProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentForm, setCommentForm] = useState({
    fullName: "",
    email: "",
    rating: 5,
    comment: ""
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const lang = useLocale();
  const t = useTranslations("Blog");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const resolvedParams = await params;
        const blogData = await BlogService.getBySlugBlogWithComments(resolvedParams.slug);
        
        if (blogData) {
          setBlog(blogData);
          
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || submittingComment) return;

    setSubmittingComment(true);
    try {
      // Get the slug directly from the URL params
      const resolvedParams = await params;
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://centralia-travel-agency-back.onrender.com'}/api/blogs/${resolvedParams.slug}/comments`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: commentForm.fullName,
          email: commentForm.email,
          rating: commentForm.rating,
          comment: commentForm.comment
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCommentForm({
            fullName: "",
            email: "",
            rating: 5,
            comment: ""
          });
          setCommentSubmitted(true);
          setShowCommentForm(false);
          setTimeout(() => setCommentSubmitted(false), 3000);
          // Refresh the blog data to show the new comment
          const updatedBlog = await BlogService.getBySlugBlogWithComments(resolvedParams.slug);
          if (updatedBlog) {
            setBlog(updatedBlog);
          }
        } else {
          alert("Failed to submit comment. Please try again.");
        }
      } else {
        const errorData = await response.json();
        console.error("Comment submission failed:", errorData);
        alert(`Failed to submit comment: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t("timeAgo.today");
    if (diffDays < 7) return t("timeAgo.daysAgo", { days: diffDays });
    if (diffDays < 30) return t("timeAgo.weeksAgo", { weeks: Math.ceil(diffDays / 7) });
    return t("timeAgo.monthsAgo", { months: Math.ceil(diffDays / 30) });
  };

  const getLocalizedContent = (content: TranslationsProps) => {
    return content[lang as keyof TranslationsProps] || content.en || t("contentNotAvailable");
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </div>
          </div>
          <p className="text-xl text-gray-600 font-medium">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="relative">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-red-100 to-pink-100 mb-6">
              <ThumbsDown className="h-12 w-12 text-red-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            {error || "Blog not found"}
          </h3>
          <p className="text-gray-600 mb-6">The requested blog could not be found.</p>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t("backToBlogs")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Back Button */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">{t("backToBlogs")}</span>
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4" />
              Travel Blog
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {getLocalizedContent(blog.title)}
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {getLocalizedContent(blog.summary)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Meta Information */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-white/20 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Author */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{blog.author?.name || t("unknownAuthor")}</h3>
              <p className="text-gray-500 text-sm">Author</p>
            </div>

            {/* Published Date */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                {formatDate(blog.createdAt || "")}
              </h3>
              <p className="text-gray-500 text-sm">Published</p>
            </div>

            {/* Views */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{blog.views || 0}</h3>
              <p className="text-gray-500 text-sm">Views</p>
            </div>

            {/* Rating */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-yellow-600 fill-current" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                {blog.ratingAvg > 0 ? blog.ratingAvg.toFixed(1) : 'N/A'}
              </h3>
              <p className="text-gray-500 text-sm">
                {blog.ratingCount > 0 ? `${blog.ratingCount} ratings` : 'No ratings'}
              </p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL || 'https://centralia-travel-agency-back.onrender.com'}${blog.coverImage}`}
              alt={getLocalizedContent(blog.title)}
              className="w-full h-96 md:h-[500px] object-cover"
            />
            
            {/* Action Buttons Overlay */}
            <div className="absolute top-6 right-6 flex gap-3">
              
              <button className="p-4 rounded-full bg-white/90 text-gray-700 hover:bg-white backdrop-blur-md transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Bookmark className="h-6 w-6" />
              </button>
              
              <button className="p-4 rounded-full bg-white/90 text-gray-700 hover:bg-white backdrop-blur-md transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Share2 className="h-6 w-6" />
              </button>
            </div>

            {/* Stats Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    <span className="font-bold">{blog.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-bold">{blog.comments?.length || 0}</span>
                  </div>
                  
                </div>
                
                {blog.ratingAvg > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-lg">{blog.ratingAvg.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Blog Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-white/20 backdrop-blur-sm">
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: getLocalizedContent(blog.content) }}
          />
        </div>

        {/* Additional Info */}
        {blog.additionalInfo && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl border border-green-200 p-8 md:p-12 mb-12">
            <h3 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-green-600" />
              {t("additionalInfo")}
            </h3>
            <div 
              className="text-green-700 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: getLocalizedContent(blog.additionalInfo) }}
            />
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-white/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MapPin className="h-6 w-6 text-blue-600" />
              {t("tags")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium hover:from-purple-100 hover:to-pink-100 transition-all duration-300 cursor-pointer hover:scale-105 shadow-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-emerald-500 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold text-lg"
              >
                <MessageCircle className="h-6 w-6" />
                <span>{showCommentForm ? 'Hide Comment Form' : 'Leave a Comment'}</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-sm font-medium">Share this post</span>
              <button className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-300">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              {t("comments")} ({blog.comments?.length || 0})
            </h3>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Total Comments:</span> {blog.comments?.length || 0}
            </div>
          </div>
          
          {/* Comment Form */}
          {showCommentForm && (
            <div className="mb-12 p-10 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl border-2 border-blue-200 shadow-2xl">
              <h4 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3 text-center justify-center">
                <Sparkles className="h-8 w-8 text-blue-600" />
                {t("leaveComment")}
              </h4>
              <p className="text-gray-600 text-center mb-8 text-lg">
                Share your thoughts and experiences about this amazing travel destination!
              </p>
              
              {commentSubmitted && (
                <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200 text-green-800 rounded-2xl text-center">
                  <div className="flex items-center gap-3 justify-center">
                    <Sparkles className="h-6 w-6 text-green-600" />
                    <span className="font-bold text-lg">{t("commentSubmitted")}</span>
                  </div>
                  <p className="text-green-700 mt-2">Your comment has been submitted successfully!</p>
                  <p className="text-green-600 mt-1 text-sm">It will be visible after approval.</p>
                </div>
              )}

              <form onSubmit={handleCommentSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">
                      {t("fullName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={commentForm.fullName}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder={t("enterFullName")}
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">
                      {t("email")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={commentForm.email}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder={t("enterEmail")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">
                    {t("rating")} *
                  </label>
                  <select
                    value={commentForm.rating}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ {t("excellent")} (5)</option>
                    <option value={4}>⭐⭐⭐⭐ {t("veryGood")} (4)</option>
                    <option value={3}>⭐⭐⭐ {t("good")} (3)</option>
                    <option value={2}>⭐⭐ {t("fair")} (2)</option>
                    <option value={1}>⭐ {t("poor")} (1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">
                    {t("comment")} *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={commentForm.comment}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder={t("shareYourThoughts")}
                  />
                </div>

                <div className="flex justify-center gap-6 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    className="px-8 py-4 text-gray-600 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    {submittingComment ? t("submitting") : t("submitComment")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Comments List */}
          {blog.comments && blog.comments.length > 0 ? (
            <div className="space-y-6">
              {blog.comments.filter(comment => comment.isApproved).map((comment) => (
                <div key={comment._id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{comment.fullName}</h4>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < comment.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        {comment.blogSlug && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Blog: {comment.blogSlug}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">{comment.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-blue-100 mb-6">
                <MessageCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("noCommentsYet")}</h3>
              <p className="text-gray-600 text-lg">{t("beFirstToComment")}</p>
            </div>
          )}
        </div>

        {/* Related Posts Suggestion */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-white/20 backdrop-blur-sm">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            Explore More Travel Stories
          </h3>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Discover more amazing travel destinations, tips, and stories from our expert writers
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span>Explore All Posts</span>
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
