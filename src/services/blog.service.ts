import { BlogProps, Comment } from "@/interfaces/insights.interface";
import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://centralia-travel-agency-back.onrender.com') + '/api';



export const BlogService = {
  async getAllBlogs(): Promise<BlogProps[]> {
    const url = `${API_BASE_URL}/blogs`;
    
    try {
      const { data } = await axios.get<BlogProps[]>(url);      
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
    
    try {
      const { data } = await axios.get<BlogProps>(url);
      
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
    
    try {
      const { data } = await axios.get<BlogProps>(url);
      
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

  // Get blog comments separately (approved only)
  async getBlogComments(slug: string): Promise<Comment[]> {
    const url = `${API_BASE_URL}/blogs/${slug}/comments`;
    try {
      const { data } = await axios.get<{ success: boolean; data: Comment[] }>(url);
      if (data?.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('Frontend: Error fetching blog comments:', error);
      return [];
    }
  },





  async updateBlog(updateData: BlogProps, id: string, token: string): Promise<BlogProps | null> {
    const url = `${API_BASE_URL}/blogs/${id}`;
    
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
