import { CountryProps } from "@/interfaces/country.interface";
import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://centralia-travel-agency-back.onrender.com') + '/api';

export const CountryService = {
  async getAllCountries(): Promise<CountryProps[]> {
    try {
      const { data } = await axios.get<CountryProps[]>(
        `${API_BASE_URL}/countries`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Return empty array if backend is not available
      return [];
    }
  },

  async getByIdCountry(id: string): Promise<CountryProps | null> {
    try {
      const { data } = await axios.get<CountryProps>(
        `${API_BASE_URL}/countries/${id}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching country by ID:', error);
      return null;
    }
  },

  async getBySlug(slug: string): Promise<CountryProps | null> {
    try {
      const { data } = await axios.get<CountryProps>(
        `${API_BASE_URL}/countries/${slug}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching country by slug:', error);
      return null;
    }
  },

  async updateCountry(updateData: CountryProps, id: string, token: string): Promise<CountryProps | null> {
    try {
      const { data } = await axios.patch<CountryProps>(
        `${API_BASE_URL}/countries/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      console.error('Error updating country:', error);
      return null;
    }
  },

  async deleteCountry(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/countries/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting country:', error);
      return false;
    }
  },

  async createCountry(form: CountryProps, token: string): Promise<CountryProps | null> {
    try {
      const { data } = await axios.post<CountryProps>(
        `${API_BASE_URL}/countries`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      console.error('Error creating country:', error);
      return null;
    }
  },
};
