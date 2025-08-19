import { Blog } from "@/components";
import { BlogService } from "@/services/blog.service";
import React from "react";

const BlogPage = async () => {
  try {
    const blogs = await BlogService.getAllBlogs();

    return (
      <div className="min-h-screen">
        <Blog data={blogs} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return (
      <div className="min-h-screen mt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Blogs
          </h2>
          <p className="text-gray-600 mb-6">
            Failed to load blog posts. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
};

export default BlogPage;
