import { BlogProps } from "@/interfaces/insights.interface";
import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://centralia-travel-agency-back.onrender.com') + '/api';

console.log('Frontend Blog Service - API Base URL:', API_BASE_URL);

export const BlogService = {
  async getAllBlogs(): Promise<BlogProps[]> {
    const url = `${API_BASE_URL}/blogs`;
    console.log('Frontend: Fetching blogs from:', url);
    
    try {
      const { data } = await axios.get<BlogProps[]>(url);
      console.log('Frontend: Blog response received:', data);
      console.log('Frontend: Number of blogs:', data?.length || 0);
      
      if (data && Array.isArray(data)) {
        data.forEach((blog, index) => {
          console.log(`Frontend: Blog ${index + 1}:`, {
            id: blog._id,
            title: blog.title?.en,
            status: blog.status,
            slug: blog.slug
          });
        });
      }
      
      return data || [];
    } catch (error) {
      console.error('Frontend: Error fetching blogs:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend: Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      return [];
    }
  },

  async getBySlugBlog(slug: string): Promise<BlogProps | null> {
    const url = `${API_BASE_URL}/blogs/${slug}`;
    console.log('Frontend: Fetching blog by slug from:', url);
    
    try {
      const { data } = await axios.get<BlogProps>(url);
      console.log('Frontend: Blog by slug response:', data);
      
      if (data) {
        console.log('Frontend: Blog found successfully:', {
          id: data._id,
          title: data.title?.en,
          slug: data.slug,
          status: data.status
        });
      }
      
      return data;
    } catch (error) {
      console.error('Frontend: Error fetching blog by slug:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend: Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      return null;
    }
  },

  // Get blog with comments
  async getBySlugBlogWithComments(slug: string): Promise<BlogProps | null> {
    const url = `${API_BASE_URL}/blogs/${slug}?includeComments=true`;
    console.log('Frontend: Fetching blog with comments from:', url);
    
    try {
      const { data } = await axios.get<BlogProps>(url);
      console.log('Frontend: Blog with comments response:', data);
      
      if (data) {
        console.log('Frontend: Blog with comments found successfully:', {
          id: data._id,
          title: data.title?.en,
          slug: data.slug,
          status: data.status,
          commentsCount: data.comments?.length || 0
        });
      }
      
      return data;
    } catch (error) {
      console.error('Frontend: Error fetching blog with comments:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend: Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      return null;
    }
  },

  // Get blog comments separately
  async getBlogComments(slug: string): Promise<Comment[]> {
    const url = `${API_BASE_URL}/blogs/${slug}/comments`;
    console.log('Frontend: Fetching blog comments from:', url);
    
    try {
      const { data } = await axios.get<{ success: boolean; data: Comment[] }>(url);
      console.log('Frontend: Blog comments response:', data);
      
      if (data.success && data.data) {
        console.log('Frontend: Comments found successfully:', {
          count: data.data.length
        });
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Frontend: Error fetching blog comments:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend: Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      return [];
    }
  },

  // Create comment for a blog
  async createComment(commentData: {
    blogId: string;
    fullName: string;
    email: string;
    rating: number;
    comment: string;
  }): Promise<Comment | null> {
    // First get the blog slug from blogId
    try {
      const blog = await this.getBySlugBlog(commentData.blogId);
      if (!blog) {
        console.error('Frontend: Blog not found for comment creation');
        return null;
      }
      
      const url = `${API_BASE_URL}/blogs/${blog.slug}/comments`;
      console.log('Frontend: Creating comment at:', url);
      console.log('Frontend: Comment data:', commentData);
      
      const { data } = await axios.post<{ success: boolean; message: string; data: Comment }>(url, {
        fullName: commentData.fullName,
        email: commentData.email,
        rating: commentData.rating,
        comment: commentData.comment
      });
      
      console.log('Frontend: Comment creation response:', data);
      
      if (data.success && data.data) {
        console.log('Frontend: Comment created successfully:', data.data);
        return data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Frontend: Error creating comment:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend: Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      return null;
    }
  },

  // Add comment method (alias for createComment)
  async addComment(blogId: string, commentData: {
    fullName: string;
    email: string;
    rating: string;
    comment: string;
  }): Promise<Comment | null> {
    return this.createComment({
      blogId,
      fullName: commentData.fullName,
      email: commentData.email,
      rating: parseInt(commentData.rating),
      comment: commentData.comment
    });
  },

  async updateBlog(updateData: BlogProps, id: string, token: string): Promise<BlogProps | null> {
    const url = `${API_BASE_URL}/blogs/${id}`;
    console.log('Frontend: Updating blog at:', url);
    
    try {
      const { data } = await axios.patch<BlogProps>(
        url,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      console.error('Frontend: Error updating blog:', error);
      return null;
    }
  },

  async deleteBlog(id: string): Promise<boolean> {
    const url = `${API_BASE_URL}/blogs/${id}`;
    console.log('Frontend: Deleting blog at:', url);
    
    try {
      await axios.delete(url);
      return true;
    } catch (error) {
      console.error('Frontend: Error deleting blog:', error);
      return false;
    }
  },

  async createBlog(form: BlogProps, token: string): Promise<BlogProps | null> {
    const url = `${API_BASE_URL}/blogs`;
    console.log('Frontend: Creating blog at:', url);
    
    try {
      const { data } = await axios.post<BlogProps>(
        url,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      console.error('Frontend: Error creating blog:', error);
      return null;
    }
  },
};
