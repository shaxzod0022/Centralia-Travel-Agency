"use client";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { useState, FormEvent, useEffect, useCallback } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import axios from "axios";

interface FormData {
  fullName: string;
  whatsappNumber: string;
  detailedInformation: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const B2bRequest = () => {
  const t = useTranslations("b2bPage");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    whatsappNumber: "",
    detailedInformation: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  // Timer to clear API response after 4 seconds
  useEffect(() => {
    if (apiResponse) {
      const timer = setTimeout(() => {
        setApiResponse(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [apiResponse]);

  // Clear API response manually
  const clearApiResponse = useCallback(() => {
    setApiResponse(null);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const { fullName, detailedInformation } = formData;
    const trimmedPhone = formData.whatsappNumber.trim();

    if (!fullName.trim()) {
      newErrors.fullName = t("reqFullName") || "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName =
        t("charFullName") || "Full name must be at least 2 characters";
    }

    if (!trimmedPhone) {
      newErrors.whatsappNumber = t("reqWhats") || "WhatsApp number is required";
    } else if (trimmedPhone.replace(/\D/g, "").length < 4) {
      newErrors.whatsappNumber =
        t("validWhats") || "Please enter a valid WhatsApp number";
    }

    if (!detailedInformation.trim()) {
      newErrors.detailedInformation =
        t("reqDetail") || "Detailed information is required";
    } else if (detailedInformation.trim().length < 10) {
      newErrors.detailedInformation =
        t("charDetail") ||
        "Please provide more detailed information (at least 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearApiResponse();

    if (!validateForm()) {
      setApiResponse({
        success: false,
        message: t("validetForm") || "Please fill in all fields correctly",
      });
      return;
    }

    const trimmedData = {
      fullName: formData.fullName.trim(),
      whatsappNumber: formData.whatsappNumber.trim().replace(/\D/g, ""),
      detailedInformation: formData.detailedInformation.trim(),
    };

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/api/travel-agent-request`,
        trimmedData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201 && response.data.success) {
        setFormData({
          fullName: "",
          whatsappNumber: "",
          detailedInformation: "",
        });

        // Delay showing success message to prevent race condition with onChange clearing it
        setTimeout(() => {
          setApiResponse({
            success: true,
            message: t("reqSuccess") || "Request sent successfully!",
          });
        }, 100);
      } else {
        setApiResponse({
          success: false,
          message:
            response.data.message || t("reqError") || "Something went wrong",
        });
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
        t("serverError") ||
        "Server error occurred"
        : t("tryAgain") || "Failed to send request. Please try again.";
      setApiResponse({ success: false, message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if exists
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear API response when user starts typing
    if (apiResponse) {
      clearApiResponse();
    }
  };

  return (
    <div className={`${styles.paddingCont} !pt-10`}>
      <div
        className={`bg-[#F2F2F2] rounded-2xl md:p-16 p-5 ${styles.flexCol} !items-center w-full`}
      >
        <h2 className={`${styles.h2} mb-5 text-center text-[#056D50]`}>
          {t("title")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-[800px] w-full space-y-4 relative"
          noValidate
        >
          {/* Full Name Field */}
          <div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full py-2 px-4 border-2 outline-none border-gray-300 rounded-lg focus:border-[#6EBB2D] transition-colors ${errors.fullName ? "border-red-500 focus:border-red-500" : ""
                }`}
              placeholder={t("fullName") || "Full name"}
              disabled={loading}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* WhatsApp Field */}
          <div>
            <PhoneInput
              defaultCountry="us"
              value={formData.whatsappNumber}
              onChange={(phone) => {
                setFormData((prev) => ({ ...prev, whatsappNumber: phone }));
                if (errors.whatsappNumber) {
                  setErrors((prev) => ({ ...prev, whatsappNumber: undefined }));
                }
                if (apiResponse) {
                  clearApiResponse();
                }
              }}
              inputClassName={`w-full py-2 px-4 border-2 outline-none border-gray-300 rounded-lg focus:border-[#6EBB2D] !bg-transparent transition-colors ${errors.whatsappNumber
                  ? "border-red-500 focus:border-red-500"
                  : ""
                }`}
              disabled={loading}
              placeholder={t("whatsappNumber") || "WhatsApp number"}
            />
            {errors.whatsappNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.whatsappNumber}
              </p>
            )}
          </div>

          {/* Detailed Information Field */}
          <div>
            <textarea
              name="detailedInformation"
              value={formData.detailedInformation}
              onChange={handleInputChange}
              placeholder={t("detailedInformation") || "Detailed information"}
              rows={5}
              className={`w-full py-2 px-4 border-2 outline-none border-gray-300 rounded-lg focus:border-[#6EBB2D] transition-colors ${errors.detailedInformation
                  ? "border-red-500 focus:border-red-500"
                  : ""
                }`}
              disabled={loading}
            />
            {errors.detailedInformation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.detailedInformation}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#6EBB2D] hover:bg-[#5EA329] active:bg-[#4C8A20] transition-all duration-300 p-2 font-semibold text-white rounded-md w-full ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("sending")}
              </span>
            ) : (
              t("btn")
            )}
          </button>

          {/* API Response Message - POSITIONED UNDER BUTTON */}
          {apiResponse && (
            <div
              className={`absolute left-0 right-0 mt-2 p-4 rounded-lg shadow-lg animate-fade-in-up ${apiResponse.success
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
                }`}
              style={{ top: "calc(100% + 8px)" }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{apiResponse.message}</p>
                <button
                  onClick={clearApiResponse}
                  className="ml-4 text-lg font-bold hover:opacity-70 transition-opacity"
                  aria-label="Close message"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default B2bRequest;
