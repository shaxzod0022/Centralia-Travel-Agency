"use client";
import { styles } from "@/styles/styles";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const SuccessModal = () => {
  const t = useTranslations("tourBookingModal");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t("succesTitle")}
        </h2>

        {/* Message */}
        <p className={`${styles.p} mb-2`}>{t("successDesc")}</p>

        {/* Go to Home Button */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full py-3 px-6 bg-[#6EBB2D] hover:bg-[#5da825] text-white font-medium rounded-xl transition-colors flex items-center justify-center"
          >
            {t("goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
