import { BlogProps } from "@/interfaces/insights.interface";
import axios from "axios";

export const BlogService = {
  async getAllBlogs() {
    const { data } = await axios.get<BlogProps[]>(
      `https://centralia-travel-agency-back.onrender.com/api/blogs`
    );
    return data;
  },
  async getBySlugBlog(slug: string) {
    const { data } = await axios.get<BlogProps>(
      `https://centralia-travel-agency-back.onrender.com/api/blogs/${slug}`
    );
    return data;
  },
  async updateBlog(updateData: BlogProps, id: string, token: string) {
    const { data } = await axios.patch<BlogProps>(
      `https://centralia-travel-agency-back.onrender.com/api/blogs/${id}`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
  async deleteBlog(id: string) {
    const { data } = await axios.delete<BlogProps>(
      `https://centralia-travel-agency-back.onrender.com/api/blogs/${id}`
    );
    return data;
  },
  async createBlog(form: BlogProps, token: string) {
    const { data } = await axios.post<BlogProps>(
      `https://centralia-travel-agency-back.onrender.com/api/blogs`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
};
