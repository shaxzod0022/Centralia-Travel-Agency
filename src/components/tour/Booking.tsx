"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, AlertCircle, Minus, Plus, Users, User } from "lucide-react";
import { styles } from "@/styles/styles";
import { OrderService, CreateOrderData } from "@/services/order.service";
import Btn from "../helpers/Btn";
import { useRouter } from "next/navigation";

interface BookingProps {
  tourSlug: string;
  tourPrice: number;
}

const Booking: React.FC<BookingProps> = ({ tourSlug, tourPrice }) => {
  const t = useTranslations("TourPage");
  const router = useRouter();
  const [inc, setInc] = useState<number>(1);
  const [bookingType, setBookingType] = useState<'group' | 'individual'>('individual');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    numberOfPeople: 1,
    bookingType: 'individual' as 'group' | 'individual',
    tourDate: '',
    customerNote: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const myPrice = tourPrice;

  // Calculate price based on booking type and number of people
  const calculatePrice = () => {
    const basePrice = myPrice * inc;
    if (bookingType === 'group') {
      return basePrice * 0.6; // 40% discount for group
    }
    return basePrice;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) errors.firstName = t("validationErrors.firstNameRequired");
    if (!formData.lastName.trim()) errors.lastName = t("validationErrors.lastNameRequired");
    if (!formData.email.trim()) errors.email = t("validationErrors.emailRequired");
    if (inc < 1) errors.numberOfPeople = t("validationErrors.numberOfPeopleMin");
    if (!formData.tourDate) errors.tourDate = t("validationErrors.tourDateRequired");
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderData: CreateOrderData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber || '',
        numberOfPeople: inc,
        bookingType: formData.bookingType,
        tourDate: formData.tourDate,
        totalPrice: calculatePrice(),
        customerNote: formData.customerNote || '',
        tourSlug: tourSlug
      };

      const response = await OrderService.createOrder(orderData);
      
      if (response && response.success) {
        setSubmitSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          numberOfPeople: 1,
          bookingType: 'individual',
          tourDate: '',
          customerNote: ''
        });
        setFormErrors({});
      } else {
        setSubmitError(t("orderErrors.failedToCreate"));
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setSubmitError(t("orderErrors.errorOccurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (submitSuccess) {
    return (
      <div className={`lg:w-[34%] mb-5 w-full p-5 border border-green-300 rounded-xl ${styles.flexCol} md:gap-5 gap-3 bg-green-50`}>
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 mb-2">{t("bookingSuccessful")}</h3>
          <p className="text-center text-green-600 font-medium">
            {t("bookingSuccessMessage")}
          </p>
          <p className="text-sm text-green-500">
            {t("redirectingMessage")}
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
              formErrors.firstName ? 'border-red-500' : ''
            }`}
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
          {formErrors.firstName && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {formErrors.firstName}
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
              formErrors.lastName ? 'border-red-500' : ''
            }`}
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
          {formErrors.lastName && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {formErrors.lastName}
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
              formErrors.email ? 'border-red-500' : ''
            }`}
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          {formErrors.email && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {formErrors.email}
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
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
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
                formErrors.numberOfPeople ? 'border-red-500' : ''
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
          {formErrors.numberOfPeople && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {formErrors.numberOfPeople}
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
              <p className="text-sm text-gray-600">{t("groupDiscount")}</p>
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
              <p className="text-sm text-gray-600">{t("standardPrice")}</p>
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
              formErrors.tourDate ? 'border-red-500' : ''
            }`}
            type="date"
            name="date"
            id="date"
            value={formData.tourDate}
            onChange={(e) => handleInputChange('tourDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          {formErrors.tourDate && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              {formErrors.tourDate}
            </div>
          )}
        </div>

        {/* Price Display */}
        <div className={`${styles.flexBetween} bg-gray-50 p-3 rounded-lg`}>
          <p className={`${styles.p}`}>{t("totalPrice")}:</p>
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
            value={formData.customerNote}
            onChange={(e) => handleInputChange('customerNote', e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <Btn 
          myClass="font-semibold" 
          title={isSubmitting ? t("creatingOrder") : t("btn")}
          disabled={isSubmitting}
        />
      </form>

      {/* Expert Contact */}
      <div className={`${styles.flex} border rounded-xl p-3 border-gray-400 gap-2 w-full`}>
        <img
          className="rounded-full w-20 h-20 object-cover"
          src="https://thumbs.dreamstime.com/b/consulting-expert-advice-support-service-business-concept-98129276.jpg"
          alt="Expert"
        />
        <div>
          <p className="mb-2">{t("expert")}</p>
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
