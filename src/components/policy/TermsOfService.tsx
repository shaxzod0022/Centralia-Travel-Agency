"use client";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";

const TermsOfService = () => {
  const t = useTranslations("termsOfService");

  return (
    <div className={`${styles.paddingCont} !pt-28`}>
      <h2 className={`${styles.h2} mb-4`}>{t("title")}</h2>
      <h2 className={`${styles.h2} text-[#056D50] mb-2`}>{t("agencyName")}</h2>
      <p className={`${styles.h3} mb-8`}>{t("lastUpdated")}</p>
      
      {/* Introduction */}
      <div className="mb-10">
        <p className={`${styles.p} mb-6`}>{t("intro")}</p>
      </div>
      
      {/* 1. Scope of Services */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.scopeOfServices.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.scopeOfServices.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.scopeOfServices.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className={`${styles.p} font-bold mb-2 text-yellow-700`}>
            {t("sections.scopeOfServices.importantNotice.title")}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {t.raw("sections.scopeOfServices.importantNotice.points").map((point: string, index: number) => (
              <li key={index} className={`${styles.p} text-yellow-700`}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* 2. No Online Payments */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.noOnlinePayments.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.noOnlinePayments.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.noOnlinePayments.points").map((point: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{point}</li>
          ))}
        </ul>
      </div>
      
      {/* 3. No User Accounts */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.noUserAccounts.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.noUserAccounts.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.noUserAccounts.points").map((point: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{point}</li>
          ))}
        </ul>
      </div>
      
      {/* 4. User Responsibilities */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.userResponsibilities.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.userResponsibilities.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.userResponsibilities.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <p className={`${styles.p} italic`}>
          {t("sections.userResponsibilities.note")}
        </p>
      </div>
      
      {/* 5. Booking Requests */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.bookingRequests.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.bookingRequests.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.bookingRequests.points").map((point: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{point}</li>
          ))}
        </ul>
      </div>
      
      {/* 6. Prices & Availability */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.pricesAvailability.title")}
        </h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.pricesAvailability.points").map((point: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{point}</li>
          ))}
        </ul>
      </div>
      
      {/* 7. Changes & Cancellations */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.changesCancellations.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.changesCancellations.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.changesCancellations.points").map((point: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{point}</li>
          ))}
        </ul>
      </div>
      
      {/* 8. Intellectual Property */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.intellectualProperty.title")}
        </h3>
        <p className={`${styles.p}`}>
          {t("sections.intellectualProperty.content")}
        </p>
      </div>
      
      {/* 9. Third-Party Services */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.thirdPartyServices.title")}
        </h3>
        <p className={`${styles.p} whitespace-pre-line`}>
          {t("sections.thirdPartyServices.content")}
        </p>
      </div>
      
      {/* 10. Limitation of Liability */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.limitationOfLiability.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.limitationOfLiability.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.limitationOfLiability.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <p className={`${styles.p} italic`}>
          {t("sections.limitationOfLiability.note")}
        </p>
      </div>
      
      {/* 11. Privacy */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.privacy.title")}
        </h3>
        <p className={`${styles.p}`}>
          {t("sections.privacy.content")}
        </p>
      </div>
      
      {/* 12. Changes to Terms */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.changesToTerms.title")}
        </h3>
        <p className={`${styles.p} whitespace-pre-line`}>
          {t("sections.changesToTerms.content")}
        </p>
      </div>
      
      {/* 13. Governing Law */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.governingLaw.title")}
        </h3>
        <p className={`${styles.p}`}>
          {t("sections.governingLaw.content")}
        </p>
      </div>
      
      {/* 14. Contact Information */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.contact.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.contact.content")}
        </p>
        <div className="bg-[#E9F6F9] p-6 rounded-lg">
          <p className={`${styles.p} font-bold mb-3`}>
            {t("sections.contact.agency")}
          </p>
          <p className={`${styles.p} mb-2`}>
            {t("sections.contact.email")}
          </p>
          <p className={`${styles.p}`}>
            {t("sections.contact.phone")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;