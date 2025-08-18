import { TourProps } from "@/interfaces/signature.interface";
import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/api';

export const TourService = {
  async getAllTours(): Promise<TourProps[]> {
    try {
      const { data } = await axios.get<TourProps[]>(
        `${API_BASE_URL}/tours`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  },

  async getByIdCountryTours(slug: string): Promise<TourProps[]> {
    try {
      const { data } = await axios.get<TourProps[]>(
        `${API_BASE_URL}/tours/country/${slug}`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching country tours:', error);
      return [];
    }
  },

  async getBySlugTour(slug: string): Promise<TourProps | null> {
    try {
      const { data } = await axios.get<TourProps>(
        `${API_BASE_URL}/tours/slug/${slug}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching tour by slug:', error);
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
    } catch (error) {
      console.error('Error updating tour:', error);
      return null;
    }
  },

  async deleteTour(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/tours/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting tour:', error);
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
    } catch (error) {
      console.error('Error creating tour:', error);
      return null;
    }
  },
};
