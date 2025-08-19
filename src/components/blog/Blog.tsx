"use client";
import { BlogProps } from "@/interfaces/insights.interface";
import { TranslationsProps } from "@/interfaces/helper.interface";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { FC, useState, useEffect } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Star,
  User,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface Props {
  data: BlogProps[];
}

const Blog: FC<Props> = ({ data }) => {
  const lang = useLocale();
  const router = useRouter();
  const t = useTranslations("Blog");
  const [likedBlogs, setLikedBlogs] = useState<Set<string>>(new Set());


  // Filter only published blogs
  const publishedBlogs = data.filter((blog) => blog.status === "published");

  if (!publishedBlogs || publishedBlogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="relative">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
              <MessageCircle className="h-12 w-12 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("noBlogs.title")}
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("noBlogs.description")}
          </p>
        </div>
      </div>
    );
  }

  const handleBlogClick = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  const handleLike = (blogId: string) => {
    setLikedBlogs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(blogId)) {
        newSet.delete(blogId);
      } else {
        newSet.add(blogId);
      }
      return newSet;
    });
  };

  const formatTimeAgo = (dateString: string | undefined) => {
    if (!dateString) return t("unknownDate");

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("timeAgo.today");
    if (diffDays < 7) return t("timeAgo.daysAgo", { days: diffDays });
    if (diffDays < 30)
      return t("timeAgo.weeksAgo", { weeks: Math.ceil(diffDays / 7) });
    if (diffDays < 365)
      return t("timeAgo.monthsAgo", { months: Math.ceil(diffDays / 30) });

    return date.toLocaleDateString(lang, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLocalizedText = (textObj: TranslationsProps, lang: string) => {
    return textObj[lang as keyof TranslationsProps] || textObj.en || "";
  };

  const getSingleImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${imagePath}`;
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-blue-600 mb-6">
              <TrendingUp className="h-4 w-4" />
              {t("latestTravelInsights")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              {t("subtitle")}
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{publishedBlogs.length} {t("articles")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{t("expertWriters")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>{t("travelTips")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedBlogs.map((blog, index) => (
            <article
              key={blog._id}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 cursor-pointer overflow-hidden border border-white/20 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-[2px] rounded-3xl bg-white"></div>

              {/* Image Container */}
              <div className="relative h-72 overflow-hidden rounded-t-3xl">
                {blog.coverImage ? (
                  <img
                    src={getSingleImageUrl(blog.coverImage)}
                    alt={getLocalizedText(blog.title, lang)}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-blog.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                    <MessageCircle className="h-20 w-20 text-gray-400" />
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Status Badge */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg">
                    {t("status.published")}
                  </span>
                </div>

                {/* Like Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(blog._id);
                  }}
                  className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                    likedBlogs.has(blog._id)
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl"
                      : "bg-white/90 text-gray-700 hover:bg-white shadow-lg"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      likedBlogs.has(blog._id) ? "fill-current" : ""
                    }`}
                  />
                </button>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="absolute top-6 right-20 flex flex-wrap gap-2">
                    {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                <span
                        key={tagIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md text-gray-700 shadow-md"
                >
                        #{tag}
                </span>
              ))}
            </div>
                )}

                {/* Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{blog.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{blog.comments?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{blog.likeCount || 0}</span>
          </div>
        </div>

                    {blog.ratingAvg > 0 && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-bold">
                          {blog.ratingAvg.toFixed(1)}
            </span>
          </div>
                    )}
          </div>
        </div>
      </div>

              {/* Content */}
              <div className="relative p-8">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                  {getLocalizedText(blog.title, lang)}
                </h3>

                {/* Summary */}
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {getLocalizedText(blog.summary, lang)}
                </p>

                {/* Meta Information */}
                <div className="space-y-4 mb-6">
                  {/* Author and Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {blog.author?.name || t("unknownAuthor")}
                        </p>
                        <p className="text-xs text-gray-500">Author</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatTimeAgo(blog.publishedAt || blog.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500">Published</p>
                  </div>
                </div>
              </div>

                {/* Read More Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-500">
                    {t("readMore")}
                </span>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-500">
                    <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-500" />
        </div>
      </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {publishedBlogs.length >= 9 && (
          <div className="text-center mt-16">
            <button className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl">
              <span className="relative z-10">{t("loadMore")}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .border-gradient-to-r {
          background: linear-gradient(to right, var(--tw-gradient-stops));
        }
        .from-blue-500 {
          --tw-gradient-from: #3b82f6;
          --tw-gradient-stops: var(--tw-gradient-from),
            var(--tw-gradient-to, rgba(59, 130, 246, 0));
        }
        .via-purple-500 {
          --tw-gradient-stops: var(--tw-gradient-from), #8b5cf6,
            var(--tw-gradient-to, rgba(139, 92, 246, 0));
        }
        .to-pink-500 {
          --tw-gradient-to: #ec4899;
        }
      `}</style>
    </div>
  );
};

export default Blog;
