import { TourProps } from "@/interfaces/signature.interface";
import axios from "axios";

export const TourService = {
  async getAllTours() {
    const { data } = await axios.get<TourProps[]>(
      `https://centralia-travel-agency-back.onrender.com/api/tours`
    );
    return data;
  },
  async getByIdCountryTours(slug: string) {
    const { data } = await axios.get<TourProps[]>(
      `https://centralia-travel-agency-back.onrender.com/api/tours/country/${slug}`
    );
    return data;
  },

  async getBySlugTour(slug: string) {
    const { data } = await axios.get<TourProps>(
      `https://centralia-travel-agency-back.onrender.com/api/tours/${slug}`
    );
    return data;
  },
  async updateTour(updateData: TourProps, id: string, token: string) {
    const { data } = await axios.patch<TourProps>(
      `https://centralia-travel-agency-back.onrender.com/api/tours/${id}`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
  async deleteTour(id: string) {
    const { data } = await axios.delete<TourProps>(
      `https://centralia-travel-agency-back.onrender.com/api/tours/${id}`
    );
    return data;
  },
  async createTour(form: TourProps, token: string) {
    const { data } = await axios.post<TourProps>(
      `https://centralia-travel-agency-back.onrender.com/api/tours`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
};
