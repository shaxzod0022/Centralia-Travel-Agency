import { TourProps } from "@/interfaces/signature.interface";
import axios from "axios";

// Use localhost:8080 for development, fallback to production URL
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/api';

console.log('TourService API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

export const TourService = {
  async getAllTours(): Promise<TourProps[]> {
    try {
      console.log('Fetching tours from:', `${API_BASE_URL}/tours`);
      const { data } = await axios.get<TourProps[]>(
        `${API_BASE_URL}/tours`,
        { timeout: 10000 } // 10 second timeout
      );
      console.log('Tours fetched successfully:', data?.length || 0, 'tours');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching tours:', error.response?.status, error.response?.data || error.message);
      return [];
    }
  },

  async getByIdCountryTours(slug: string): Promise<TourProps[]> {
    try {
      const { data } = await axios.get<TourProps[]>(
        `${API_BASE_URL}/tours/country/${slug}`,
        { timeout: 10000 }
      );
      return data || [];
    } catch (error: any) {
      console.error('Error fetching country tours:', error.response?.status, error.response?.data || error.message);
      return [];
    }
  },

  async getBySlugTour(slug: string): Promise<TourProps | null> {
    try {
      const { data } = await axios.get<TourProps>(
        `${API_BASE_URL}/tours/slug/${slug}`,
        { timeout: 10000 }
      );
      return data;
    } catch (error: any) {
      console.error('Error fetching tour by slug:', error.response?.status, error.response?.data || error.message);
      return null;
    }
  },

  async updateTour(updateData: TourProps, id: string, token: string): Promise<TourProps | null> {
    try {
      const { data } = await axios.patch<TourProps>(
        `${API_BASE_URL}/tours/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error: any) {
      console.error('Error updating tour:', error.response?.status, error.response?.data || error.message);
      return null;
    }
  },

  async deleteTour(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/tours/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting tour:', error.response?.status, error.response?.data || error.message);
      return false;
    }
  },

  async createTour(form: TourProps, token: string): Promise<TourProps | null> {
    try {
      const { data } = await axios.post<TourProps>(
        `${API_BASE_URL}/tours`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error: any) {
      console.error('Error creating tour:', error.response?.status, error.response?.data || error.message);
      return null;
    }
  },
};
