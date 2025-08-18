"use client";
import { styles } from "@/styles/styles";
import React, { FC, useState } from "react";
import Btn from "../helpers/Btn";
import { useTranslations } from "next-intl";
import { Minus, Plus, User, Users, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderService, CreateOrderData } from "@/services/order.service";

interface Props {
  tourId?: string;
  price?: number;
  tourSlug?: string; // Add tourSlug prop
}

const Booking: FC<Props> = ({ tourId, price, tourSlug }) => {
  const t = useTranslations("TourPage");
  const [inc, setInc] = useState<number>(1);
  const [bookingType, setBookingType] = useState<'group' | 'individual'>('individual');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tourDate: '',
    info: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const myPrice = price || 500;
  const router = useRouter();

  // Calculate price based on booking type and number of people
  const calculatePrice = () => {
    const basePrice = myPrice * inc;
    if (bookingType === 'group') {
      return basePrice * 0.6; // 40% discount for group
    }
    return basePrice;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.tourDate) {
      newErrors.tourDate = 'Tour date is required';
    }
    if (inc < 1) {
      newErrors.number = 'Number of people must be at least 1';
    }
    if (!tourSlug) {
      newErrors.tour = 'Tour information is missing';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare order data for backend
      const orderData: CreateOrderData = {
        tourSlug: tourSlug!,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim() || undefined,
        numberOfPeople: inc,
        bookingType: bookingType,
        tourDate: formData.tourDate,
        customerNote: formData.info.trim() || undefined
      };

      console.log('Submitting order data:', orderData);
      
      // Send order to backend
      const response = await OrderService.createOrder(orderData);
      
      console.log('Order created successfully:', response);
      
      // Show success state
      setIsSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          tourDate: '',
          info: ''
        });
        setInc(1);
        setBookingType('individual');
      }, 3000);
      
    } catch (error: any) {
      console.error('Booking error:', error);
      
      // Handle specific error cases
      let errorMessage = 'Failed to submit booking. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className={`lg:w-[34%] mb-5 w-full p-5 border border-green-300 rounded-xl ${styles.flexCol} md:gap-5 gap-3 bg-green-50`}>
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 mb-2">Booking Successful!</h3>
          <p className="text-green-600 mb-4">
            Your tour has been booked successfully. We'll send you a confirmation email shortly.
          </p>
          <p className="text-sm text-green-500">
            Redirecting back to form...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`lg:w-[34%] mb-5 w-full p-5 border border-gray-300 rounded-xl ${styles.flexCol} md:gap-5 gap-3`}
    >
      <p className={`${styles.p} font-semibold`}>{t("booking")}</p>
      
      <form onSubmit={handleSubmit} className={`${styles.flexCol} gap-4`}>
        {/* First Name */}
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("firstName")} <span className="text-red-500">*</span>
          </label>
          <input
            className={`border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F] ${
              errors.firstName ? 'border-red-500' : ''
            }`}
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
          {errors.firstName && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {errors.firstName}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="lastName" className={`${styles.p}`}>
            {t("lastName")} <span className="text-red-500">*</span>
          </label>
          <input
            className={`border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F] ${
              errors.lastName ? 'border-red-500' : ''
            }`}
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
          {errors.lastName && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {errors.lastName}
            </div>
          )}
        </div>

        {/* Email */}
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="email" className={`${styles.p}`}>
            {t("email")} <span className="text-red-500">*</span>
          </label>
          <input
            className={`border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F] ${
              errors.email ? 'border-red-500' : ''
            }`}
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          {errors.email && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {errors.email}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="phone" className={`${styles.p}`}>
            {t("phone")}
          </label>
          <input
            className="border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F]"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>

        {/* Number of People */}
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="number" className={`${styles.p}`}>
            {t("travelNumber")} <span className="text-red-500">*</span>
          </label>
          <div className={`${styles.flexBetween} gap-3`}>
            <button
              disabled={inc <= 1}
              onClick={() => setInc(inc - 1)}
              type="button"
              className={`${
                inc <= 1 ? "cursor-no-drop opacity-50" : "cursor-pointer"
              } active:bg-red-300 bg-red-500 text-white py-2 px-7 rounded transition-colors`}
            >
              <Minus />
            </button>
            <input
              className={`border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F] text-center w-30 ${
                errors.number ? 'border-red-500' : ''
              }`}
              type="number"
              name="number"
              onChange={(e) => setInc(Number(e.target.value))}
              min={1}
              value={inc}
              required
            />
            <button
              onClick={() => setInc(inc + 1)}
              type="button"
              className="cursor-pointer active:bg-[#b6f186] bg-[#6ebb2f] text-white py-2 px-7 rounded transition-colors"
            >
              <Plus />
            </button>
          </div>
          {errors.number && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {errors.number}
            </div>
          )}
        </div>

        {/* Booking Type */}
        <div className="flex gap-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="group"
              checked={bookingType === 'group'}
              onChange={() => setBookingType('group')}
              className="hidden peer"
            />
            <div className="p-4 border border-gray-300 rounded-lg peer-checked:border-[#6EBB2F] peer-checked:bg-green-50 text-center transition-colors">
              <span className="text-2xl">
                <Users className="w-full" />
              </span>
              <p className="font-semibold mt-2">{t("group")}</p>
              <p className="text-sm text-gray-600">40% discount</p>
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="individual"
              checked={bookingType === 'individual'}
              onChange={() => setBookingType('individual')}
              className="hidden peer"
            />
            <div className="p-4 border border-gray-300 rounded-lg peer-checked:border-[#6EBB2F] peer-checked:bg-green-50 text-center transition-colors">
              <span className="text-2xl">
                <User className="w-full" />
              </span>
              <p className="font-semibold mt-2">{t("individual")}</p>
              <p className="text-sm text-gray-600">Standard price</p>
            </div>
          </label>
        </div>

        {/* Tour Date */}
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="date" className={`${styles.p}`}>
            {t("tourDate")}
            <span className="text-red-500">*</span>
          </label>
          <input
            className={`border-1 w-full border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F] ${
              errors.tourDate ? 'border-red-500' : ''
            }`}
            type="date"
            name="date"
            id="date"
            value={formData.tourDate}
            onChange={(e) => handleInputChange('tourDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          {errors.tourDate && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {errors.tourDate}
            </div>
          )}
        </div>

        {/* Price Display */}
        <div className={`${styles.flexBetween} bg-gray-50 p-3 rounded-lg`}>
          <p className={`${styles.p}`}>Total Price:</p>
          <p className={`${styles.p} text-green-950 font-semibold text-lg`}>
            ${calculatePrice().toLocaleString()}
          </p>
        </div>

        {/* Additional Info */}
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="description" className={`${styles.p}`}>
            {t("info")}
          </label>
          <textarea
            className="border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F]"
            name="description"
            id="description"
            rows={5}
            placeholder={t("infoPlaceholder")}
            value={formData.info}
            onChange={(e) => handleInputChange('info', e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <Btn 
          myClass="font-semibold" 
          title={isSubmitting ? "Creating Order..." : t("btn")}
          disabled={isSubmitting}
        />
      </form>

      {/* Expert Contact */}
      <div className={`${styles.flex} gap-2 w-full`}>
        <img
          className="rounded-full w-24 h-24 object-cover"
          src="https://thumbs.dreamstime.com/b/consulting-expert-advice-support-service-business-concept-98129276.jpg"
          alt="Expert"
        />
        <div>
          <p className="mb-2">Expert</p>
          <Btn
            onClick={() => router.push("/meeting")}
            myClass="!w-full rounded-lg"
            title={t("call")}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;
