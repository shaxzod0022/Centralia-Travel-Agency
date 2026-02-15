"use client";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";

const PrivacyPolicy = () => {
  const t = useTranslations("privacyPolicy");

  return (
    <div className={`${styles.paddingCont} !pt-28`}>
      <h2 className={`${styles.h2} mb-4`}>{t("title")}</h2>
      <h2 className={`${styles.h2} text-[#056D50] mb-2`}>{t("agencyName")}</h2>
      <p className={`${styles.h3} mb-8`}>{t("lastUpdated")}</p>
      
      {/* Introduction */}
      <div className="mb-10">
        <p className={`${styles.p} whitespace-pre-line mb-6`}>{t("intro")}</p>
      </div>
      
      {/* Information We Collect */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.informationWeCollect.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.informationWeCollect.content")}
        </p>
        <p className={`${styles.p} font-medium mb-3`}>
          {t("sections.informationWeCollect.listTitle")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.informationWeCollect.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <p className={`${styles.p} italic`}>
          {t("sections.informationWeCollect.note")}
        </p>
      </div>
      
      {/* How We Use Your Information */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.howWeUseInformation.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.howWeUseInformation.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.howWeUseInformation.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <p className={`${styles.p} italic`}>
          {t("sections.howWeUseInformation.note")}
        </p>
      </div>
      
      {/* Legal Basis for Processing */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.legalBasis.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.legalBasis.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.legalBasis.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <p className={`${styles.p} italic`}>
          {t("sections.legalBasis.note")}
        </p>
      </div>
      
      {/* Data Sharing and Disclosure */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.dataSharing.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.dataSharing.content")}
        </p>
        <p className={`${styles.p} font-medium mb-3`}>
          {t("sections.dataSharing.subtitle")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.dataSharing.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <p className={`${styles.p} italic`}>
          {t("sections.dataSharing.note")}
        </p>
      </div>
      
      {/* Data Storage and Security */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.dataStorage.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.dataStorage.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.dataStorage.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <p className={`${styles.p} italic`}>
          {t("sections.dataStorage.note")}
        </p>
      </div>
      
      {/* Cookies and Website Functionality */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.cookies.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.cookies.content")}
        </p>
        <p className={`${styles.p} font-medium mb-3`}>
          {t("sections.cookies.subtitle")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.cookies.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <p className={`${styles.p} italic`}>
          {t("sections.cookies.note")}
        </p>
      </div>
      
      {/* Your Rights */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.yourRights.title")}
        </h3>
        <p className={`${styles.p} mb-4`}>
          {t("sections.yourRights.content")}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {t.raw("sections.yourRights.items").map((item: string, index: number) => (
            <li key={index} className={`${styles.p}`}>{item}</li>
          ))}
        </ul>
        <p className={`${styles.p} italic`}>
          {t("sections.yourRights.note")}
        </p>
      </div>
      
      {/* Third-Party Links */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.thirdPartyLinks.title")}
        </h3>
        <p className={`${styles.p} whitespace-pre-line`}>
          {t("sections.thirdPartyLinks.content")}
        </p>
      </div>
      
      {/* Children's Privacy */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.childrenPrivacy.title")}
        </h3>
        <p className={`${styles.p} whitespace-pre-line`}>
          {t("sections.childrenPrivacy.content")}
        </p>
      </div>
      
      {/* Changes to This Privacy Policy */}
      <div className="mb-10">
        <h3 className={`${styles.h3} mb-4`}>
          {t("sections.changes.title")}
        </h3>
        <p className={`${styles.p} whitespace-pre-line`}>
          {t("sections.changes.content")}
        </p>
      </div>
      
      {/* Contact Information */}
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

export default PrivacyPolicy;