import { CountryProps } from "@/interfaces/country.interface";
import axios from "axios";

export const CountryService = {
  async getAllCountries() {
    const { data } = await axios.get<CountryProps[]>(
      `https://centralia-travel-agency-back.onrender.com/api/countries`
    );
    return data;
  },
  async getByIdCountry(id: string) {
    const { data } = await axios.get<CountryProps>(
      `https://centralia-travel-agency-back.onrender.com/api/countries/${id}`
    );
    return data;
  },
  async updateCountry(updateData: CountryProps, id: string, token: string) {
    const { data } = await axios.patch<CountryProps>(
      `https://centralia-travel-agency-back.onrender.com/api/countries/${id}`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
  async deleteCountry(id: string) {
    const { data } = await axios.delete<CountryProps>(
      `https://centralia-travel-agency-back.onrender.com/api/countries/${id}`
    );
    return data;
  },
  async createTour(form: CountryProps, token: string) {
    const { data } = await axios.post<CountryProps>(
      `https://centralia-travel-agency-back.onrender.com/api/countries`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
};
