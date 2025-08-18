// app/[locale]/blog/[slug]/page.tsx
import { BlogService } from "@/services/blog.service";
import { styles } from "@/styles/styles";
import React, { useState } from "react";
import { notFound } from "next/navigation";
import { BlogProps, Comment } from "@/interfaces/insights.interface";
import { getImageUrl } from "@/utils/imageUtils";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  try {
    console.log('Frontend: Fetching blog with comments by slug:', slug);
    const blog: BlogProps | null = await BlogService.getBySlugBlogWithComments(slug);
    
    if (!blog) {
      console.log('Frontend: Blog not found for slug:', slug);
      notFound();
    }

    console.log('Frontend: Blog found with comments:', blog.title?.en);
    console.log('Frontend: Comments count:', blog.comments?.length || 0);
    
    return (
      <div className={`mt-16 max-w-[1800px] mx-auto ${styles.paddingCont}`}>
        <BlogDetail data={blog} />
      </div>
    );
  } catch (error) {
    console.error('Frontend: Error fetching blog:', error);
    notFound();
  }
}

// Blog Detail Component
function BlogDetail({ data }: { data: BlogProps }) {
  const lang = 'en'; // Default to English for now
  
  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h2>
        <p className="text-gray-600">The requested blog could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1B4332] mb-4" style={{ fontFamily: "Playfair Display" }}>
          {data.title?.[lang as keyof typeof data.title] || "Blog Title"}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {data.summary?.[lang as keyof typeof data.summary] || "Blog summary"}
        </p>
      </div>

      {/* Cover Image */}
      {data.coverImage && (
        <div className="relative">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${data.coverImage}`}
            alt={data.title?.[lang as keyof typeof data.title] || "Blog cover"}
            className="w-full h-96 md:h-[500px] object-cover rounded-2xl shadow-lg"
          />
          
          {/* Category Badge */}
          {data.category && (
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-sm font-semibold text-gray-800 capitalize">
                {data.category[lang as keyof typeof data.category]}
              </span>
            </div>
          )}
          
          {/* Tags Badge */}
          {data.tags && data.tags.length > 0 && !data.category && (
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-sm font-semibold text-gray-800 capitalize">
                {data.tags[0]}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Blog Meta Information */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-lg">
                {data.author?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{data.author?.name || 'Unknown Author'}</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>

          {/* Published Date */}
          {data.publishedAt && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">📅</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {new Date(data.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-500">Published</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          {data.views !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{data.views}</p>
              <p className="text-sm text-gray-500">Views</p>
            </div>
          )}
          
          {data.ratingAvg !== undefined && data.ratingCount !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{data.ratingAvg.toFixed(1)}</p>
              <p className="text-sm text-gray-500">{data.ratingCount} ratings</p>
            </div>
          )}
        </div>
      </div>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: data.content?.[lang as keyof typeof data.content] || "Content not available" 
            }}
          />
        </div>
      </div>

      {/* Additional Information */}
      {data.additionalInfo && (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Additional Information</h3>
          <div 
            className="text-green-700"
            dangerouslySetInnerHTML={{ 
              __html: data.additionalInfo?.[lang as keyof typeof data.additionalInfo] || "" 
            }}
          />
        </div>
      )}

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-[#1B4332]">Comments ({data.comments?.length || 0})</h3>
        
        {/* Comment Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h4>
          <CommentForm blogId={data._id} />
        </div>

        {/* Comments List */}
        {data.comments && data.comments.length > 0 ? (
          <div className="space-y-4">
            {data.comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>

      {/* Back to Blogs Button */}
      <div className="text-center pt-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B4332] text-white rounded-lg font-medium hover:bg-[#2d6c52] transition-colors duration-300"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

// Comment Form Component
function CommentForm({ blogId }: { blogId: string }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rating: '',
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await BlogService.addComment(blogId, formData);
      alert('Comment submitted successfully!');
      // Optionally, refresh the comments list or update the state
    } catch (error) {
      console.error('Frontend: Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
          Rating *
        </label>
        <select
          id="rating"
          name="rating"
          required
          value={formData.rating}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select rating</option>
          <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
          <option value="4">⭐⭐⭐⭐ Very Good (4)</option>
          <option value="3">⭐⭐⭐ Good (3)</option>
          <option value="2">⭐⭐ Fair (2)</option>
          <option value="1">⭐ Poor (1)</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comment *
        </label>
        <textarea
          id="comment"
          name="comment"
          required
          rows={4}
          value={formData.comment}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Share your thoughts about this blog post..."
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300"
      >
        Submit Comment
      </button>
    </form>
  );
}

// Comment Card Component
function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold text-sm">
              {comment.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{comment.fullName}</p>
            <p className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-lg ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ⭐
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
    </div>
  );
}
