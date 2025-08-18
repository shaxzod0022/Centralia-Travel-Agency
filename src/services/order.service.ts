import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/api';

export interface CreateOrderData {
  tourSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  numberOfPeople: number;
  bookingType: 'individual' | 'group';
  tourDate: string;
  customerNote?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: any;
}

export const OrderService = {
  async createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
    try {
      const { data } = await axios.post<OrderResponse>(
        `${API_BASE_URL}/orders`,
        orderData
      );
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrdersByTourSlug(slug: string): Promise<OrderResponse> {
    try {
      const { data } = await axios.get<OrderResponse>(
        `${API_BASE_URL}/orders/tour/${slug}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching tour orders:', error);
      throw error;
    }
  },

  async getOrdersByCustomerEmail(email: string): Promise<OrderResponse> {
    try {
      const { data } = await axios.get<OrderResponse>(
        `${API_BASE_URL}/orders/customer/${email}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  async getOrderById(id: string): Promise<OrderResponse> {
    try {
      const { data } = await axios.get<OrderResponse>(
        `${API_BASE_URL}/orders/${id}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
};
