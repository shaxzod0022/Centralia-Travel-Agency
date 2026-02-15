"use client";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { useState, FormEvent, useEffect, useCallback } from "react";
import axios from "axios";
import { Playfair } from "next/font/google";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface FormData {
  fullName: string;
  email: string;
  message: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const GetInTouch = () => {
  const t = useTranslations("contacts");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  // Timer to clear API response after 5 seconds
  useEffect(() => {
    if (apiResponse) {
      const timer = setTimeout(() => {
        setApiResponse(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [apiResponse]);

  // Clear API response manually
  const clearApiResponse = useCallback(() => {
    setApiResponse(null);
  }, []);

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const { fullName, email, message } = formData;

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = t("reqFullName");
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = t("charFullName");
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = t("reqEmail");
    } else if (!validateEmail(email.trim())) {
      newErrors.email = t("validEmail");
    }

    // Message validation
    if (!message.trim()) {
      newErrors.message = t("reqMessage");
    } else if (message.trim().length < 10) {
      newErrors.message = t("charMessage");
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
        message: t("validetForm"),
      });
      return;
    }

    const trimmedData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/api/personalized-trip-request`,
        trimmedData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 201 && response.data.success) {
        setApiResponse({
          success: true,
          message: t("messageSent"),
        });
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          message: "",
        });
      } else {
        setApiResponse({
          success: false,
          message: response.data.message || t("tryAgain"),
        });
      }
    } catch (error) {
      console.error("API Error:", error);

      let errorMessage = t("tryAgain");

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data?.message ||
            error.response.statusText ||
            `Server error (${error.response.status})`;
        } else if (error.request) {
          errorMessage = t("networkError");
        }
      }

      setApiResponse({
        success: false,
        message: errorMessage,
      });
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
        className={`bg-[#F2F2F2] rounded-2xl md:p-16 p-5 ${styles.flexCol} !items-center w-full relative`}
      >
        <h2 className={`${styles.h2} mb-2 text-center text-[#056D50]`}>
          {t("formTitle")}
        </h2>
        <p
          className={`${styles.h3} !text-[#6EBB2D] text-center max-w-2xl ${playfair.className}`}
        >
          {t("desc")}
        </p>
        <p className={`${styles.p} mb-10 text-center max-w-2xl`}>
          {t("description")}
        </p>

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
              className={`w-full py-2 px-4 border-2 outline-none border-gray-300 rounded-lg focus:border-[#6EBB2D] transition-colors ${
                errors.fullName ? "border-red-500 focus:border-red-500" : ""
              }`}
              placeholder={t("fullName")}
              disabled={loading}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full py-2 px-4 border-2 outline-none border-gray-300 rounded-lg focus:border-[#6EBB2D] transition-colors ${
                errors.email ? "border-red-500 focus:border-red-500" : ""
              }`}
              placeholder={t("email")}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t("message")}
              rows={5}
              className={`w-full py-2 px-4 border-2 outline-none border-gray-300 rounded-lg focus:border-[#6EBB2D] transition-colors ${
                errors.message ? "border-red-500 focus:border-red-500" : ""
              }`}
              disabled={loading}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#6EBB2D] hover:bg-[#5EA329] active:bg-[#4C8A20] transition-all duration-300 p-2 font-semibold text-white rounded-md w-full ${
              loading ? "opacity-70 cursor-not-allowed" : ""
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
              className={`absolute left-0 right-0 mt-2 p-4 rounded-lg shadow-lg animate-fade-in-up ${
                apiResponse.success
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

export default GetInTouch;
