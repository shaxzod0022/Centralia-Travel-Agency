// components/tour/GroupBookingModal.tsx
"use client";
import axios from "axios";
import { useState, FormEvent, useMemo, useEffect } from "react";
import { X, MoveLeft, SquareCheck, Square, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Link } from "@/i18n/routing";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import SuccessModal from "./SuccessModal";
import { Option } from "@/interfaces/calendar.interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { removeFromCart } from "@/store/cartSlice";

interface GroupBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourOption: Option;
  selectedDate: Date | null;
  participants: {
    adults: number;
    children: number;
    infants: number;
  };
  selectedAddOns?: Record<number, number>;
  tourId?: number;
}

export default function GroupBookingModal({
  isOpen,
  onClose,
  tourOption,
  selectedDate,
  participants,
  selectedAddOns = {},
  tourId,
}: GroupBookingModalProps) {
  const t = useTranslations("tourBookingModal");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const cartData = useSelector((state: RootState) => state.cart.data);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // 1. Redux'dan ushbu turga tegishli savatcha elementini topamiz
  const cartItem = useMemo(() => {
    return cartData.find(
      (item) =>
        item.tourId === tourId || item.id.includes(tourOption.id.toString()),
    );
  }, [cartData, tourId, tourOption.id]);

  useEffect(() => {
    if (!isOpen || !cartItem?.expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = cartItem.expiresAt - now;

      if (distance <= 0) {
        clearInterval(interval);
        // VAQT TUGADI: Redux'dan o'chirish va modalni yopish
        dispatch(removeFromCart(cartItem.id));
        onClose?.();
        alert("Booking time expired. Your spot has been released.");
      } else {
        // Millisekundlarni MM:SS formatiga o'tkazish
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, cartItem, dispatch, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // SessionStoragedan tourId ni olish
      const storedTourId = sessionStorage.getItem("currentTourId");
      const parsedTourId = storedTourId ? parseInt(storedTourId) : null;

      // Agar prop'dan tourId kelgan bo'lsa, undan foydalanamiz
      const finalTourId = parsedTourId || tourId;

      if (!finalTourId) {
        throw new Error("Tour ID not found");
      }

      // Add-Ons larni formatlash
      const addOnsArray = Object.entries(selectedAddOns).map(
        ([id, quantity]) => ({
          id: parseInt(id),
          quantity: quantity,
        }),
      );

      // Backend formatiga mos payload tayyorlash
      const bookingPayload = {
        tourId: finalTourId,
        optionId: tourOption.id,
        selectedDate: selectedDate?.toISOString().split("T")[0] || "",
        participants: {
          adults: participants.adults || 0,
          children: participants.children || 0,
          infants: participants.infants || 0,
        },
        meetingPoint: tourOption.meetingPoint || {}, // Group turda faqat meeting point bor
        pickupLocation: null, // Group turda pickupLocation null bo'ladi
        addOns: addOnsArray,
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        source: "website",
      };

      // Axios bilan so'rov yuborish
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/api/enquiry`,
        bookingPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (response.status === 201) {
        if (cartItem) {
          dispatch(removeFromCart(cartItem.id));
        }
        setIsSuccessModalOpen(true);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Group booking error:", error);

      // Axios error handling
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const serverError = error.response.data;
          alert(
            serverError.message ||
            `Server error: ${error.response.status} - ${error.response.statusText}`,
          );
        } else if (error.request) {
          alert(
            "No response received from server. Please check your internet connection.",
          );
        } else {
          alert(`Request error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to submit booking. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = () => {
    if (isSubmitting) return true;
    if (!formData.customerName) return true;
    if (!formData.customerEmail) return true;
    if (!formData.customerPhone) return true;
    if (!agreedToPrivacy) return true;

    return false;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 md:p-4">
        <div
          className="
        bg-white rounded-none md:rounded-2xl max-w-4xl w-full
        h-full md:max-h-[90vh] md:h-fit
        overflow-y-auto pb-4
      "
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2">
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-lg"
            >
              <MoveLeft className="w-6 h-6" />
              <span>{t("back")}</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Taymer Vizual qismi */}
          <div className="bg-orange-50 border-b border-orange-200 p-2 flex justify-center items-center gap-2 mb-2">
            <Timer className="w-5 h-5 text-orange-600 animate-pulse" />
            <span className="font-bold text-orange-700">
              {t("reserving")}: {timeLeft}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="px-4 space-y-4">
            {/* Meeting Point Information */}
            <div className="space-y-1">
              <h3 className={`${styles.h3} text-sm md:text-xl !text-black`}>
                {t("groupTourNote")}
              </h3>

              <p className={`${styles.h4} text-xs md:text-lg !text-black`}>{t("meetingPoint")}</p>
              <div className="flex items-center gap-3">
                <div>
                  <p className={`${styles.h4} text-xs md:text-lg !text-black`}>
                    {tourOption.meetingPoint?.name}
                  </p>
                  {tourOption.meetingPoint?.address && (
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      {tourOption.meetingPoint.address}
                    </p>
                  )}
                </div>
              </div>

              {tourOption.meetingPoint?.lat && tourOption.meetingPoint?.lng && (
                <Link
                  href={`https://www.google.com/maps?q=${tourOption.meetingPoint.lat},${tourOption.meetingPoint.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6EBB2D] hover:underline text-xs md:text-lg"
                >
                  {t("viewOnMap")}
                </Link>
              )}
            </div>

            {/* Main contact details */}
            <div className="space-y-2">
              <h3 className={`${styles.h4} text-sm md:text-lg !text-black`}>{t("title")}</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={`${styles.p} text-xs md:text-base block`}>{t("fullName")}</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-[#6EBB2D] focus:ring-1 focus:ring-[#6EBB2D] outline-none text-sm md:text-base"
                    placeholder={t("fullName")}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`${styles.p} text-xs md:text-base block`}>{t("phone")}</label>
                  <PhoneInput
                    required
                    defaultCountry="us"
                    value={formData.customerPhone}
                    onChange={(phone) =>
                      setFormData({ ...formData, customerPhone: phone })
                    }
                    inputClassName="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-[#6EBB2D] focus:ring-1 focus:ring-[#6EBB2D] outline-none text-sm md:text-base"
                    countrySelectorStyleProps={{
                      buttonClassName:
                        "p-3 border border-gray-300 rounded-l-lg border-r-0",
                      dropdownStyleProps: {
                        style: {
                          zIndex: 50,
                        },
                      },
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`${styles.p} text-xs md:text-base block`}>{t("email")}</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
                    }
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-[#6EBB2D] focus:ring-1 focus:ring-[#6EBB2D] outline-none text-sm md:text-base"
                    placeholder={t("email")}
                  />
                </div>
              </div>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    className="absolute opacity-0 w-7 h-7 cursor-pointer"
                  />
                  {agreedToPrivacy ? (
                    <SquareCheck className="w-5 h-5 md:w-7 md:h-7 text-[#6EBB2D]" />
                  ) : (
                    <Square className="w-5 h-5 md:w-7 md:h-7 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`${styles.p} text-xs md:text-base !text-gray-700`}>
                    <span>{t("policyReq")}</span>{" "}
                    <Link
                      target="_blank"
                      className="text-[#6EBB2D] hover:underline"
                      href="/privacy-policy"
                    >
                      {t("policy")}
                    </Link>
                  </p>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 md:py-3 px-4 md:px-6 border border-gray-300 text-gray-700 text-sm md:text-base font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled()}
                className="flex-1 py-2 md:py-3 px-4 md:px-6 bg-[#6EBB2D] hover:bg-[#5da825] text-white text-sm md:text-base font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("proccess") : t("send")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && <SuccessModal />}
    </>
  );
}
