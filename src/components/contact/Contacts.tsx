"use client";
import { styles } from "@/styles/styles";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const Contacts = () => {
  const t = useTranslations("contacts");
  return (
    <div
      className={`${styles.paddingCont} ${styles.flex} !items-start flex-wrap w-full`}
    >
      <div className="p-3 md:border-transparent border-b border-gray-400 w-full md:w-1/2 xl:w-1/3">
        <div className={`${styles.flex} gap-3 mb-4`}>
          <div
            className={`${styles.flexCenter} bg-[#E9F6F9] rounded-full w-12 h-12 text-[#6EBB2D] p-1`}
          >
            <MapPin />
          </div>
          <h3 className={`${styles.h3}`}>{t("location")}</h3>
        </div>
        <h4 className={`${styles.h4}`}>{t("travelAgency")}</h4>
        <p className={`${styles.p} mb-4`}>{t("city")}</p>
        <h4 className={`${styles.h4}`}>{t("travelOperator")}</h4>
        <p className={`${styles.p} mb-4`}>{t("travelOperatorName")}</p>
      </div>

      <div className="p-3 md:border-transparent border-b border-gray-400 w-full md:w-1/2 xl:w-1/3">
        <div className={`${styles.flex} gap-3 mb-4`}>
          <div
            className={`${styles.flexCenter} bg-[#E9F6F9] rounded-full w-12 h-12 text-[#6EBB2D] p-1`}
          >
            <Phone />
          </div>
          <h3 className={`${styles.h3}`}>{t("give")}</h3>
        </div>
        <h4 className={`${styles.h4}`}>{t("mobileNumber")}</h4>
        <p className={`${styles.p} mb-4`}>
          <Link
            className={`text-gray-500 transition gap-2 hover:text-[#056D50]`}
            href={"tel:+998 94 501 92 72"}
          >
            <span className={`${styles.p}`}>+998 94 501 92 72</span>
          </Link>
        </p>
        <h4 className={`${styles.h4}`}>{t("officeNumber")}</h4>
        <p className={`${styles.p} mb-4`}>
          <Link
            className={`text-gray-500 transition gap-2 hover:text-[#056D50]`}
            href={"tel:+998 94 501 92 72"}
          >
            <span className={`${styles.p}`}>+998 94 501 92 72</span>
          </Link>
        </p>
      </div>

      <div className="p-3 md:border-transparent border-b border-gray-400 w-full md:w-1/2 xl:w-1/3">
        <div className={`${styles.flex} gap-3 mb-4`}>
          <div
            className={`${styles.flexCenter} bg-[#E9F6F9] rounded-full w-12 h-12 text-[#6EBB2D] p-1`}
          >
            <Mail />
          </div>
          <h3 className={`${styles.h3}`}>{t("write")}</h3>
        </div>
        <h4 className={`${styles.h4}`}>{t("quotes")}</h4>
        <p className={`${styles.p} mb-4`}>{t("sitata")}</p>
        <h4 className={`${styles.h4}`}>{t("consulting")}</h4>
        <p className={`${styles.p} mb-4`}>{t("consultat")}</p>
      </div>
    </div>
  );
};

export default Contacts;
