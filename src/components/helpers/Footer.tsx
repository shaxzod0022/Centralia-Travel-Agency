import { FooterLogo } from "@/assets";
import { FooterProps } from "@/interfaces/footer.interface";
import { styles } from "@/styles/styles";
import { Mail, MapPin, Phone, Send, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const iconMap: Record<string, React.ElementType> = {
  Phone,
  Mail,
  MapPin,
  Twitter,
  Send,
};

const Footer = () => {
  const t = useTranslations("footer");
  const socialLinks = t.raw("sotcialNetworks") as FooterProps[];
  const quiskLinks = t.raw("quiskLinks.links") as FooterProps[];
  const destinations = t.raw("destinations.links") as FooterProps[];
  const footBottom = t.raw("footBottom") as FooterProps[];
  return (
    <div id="contact" className={`${styles.paddingCont} bg-[#07452a] scroll-mt-16`}>
      <div
        className={`${styles.flexBetween} max-w-[1800px] mx-auto !items-start gap-5 sm:text-start text-center mb-5`}
      >
        <div
          className={`flex flex-col sm:items-start items-center w-full lg:w-1/2 xl:w-2/5`}
        >
          <Link href={"/"}>
            <Image className="w-48" src={FooterLogo} alt="Travel" />
          </Link>
          <p className={`${styles.p} text-white my-5`}>{t("description")}</p>
          <ul className={`${styles.flex} gap-5`}>
            {socialLinks.slice(3).map((item, x) => {
              const Icon = iconMap[item.lucideName];
              if (!Icon) return null;

              return (
                <li key={x} className="bg-white/30 p-3 rounded-full">
                  <Link
                    href={item.url}
                    className="transition hover:text-[#6EBB2F] text-white"
                  >
                    <Icon className="w-7 h-7" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={`w-full sm:w-2/5 md:w-1/5 xl:w-1/4`}>
          <p
            className={`${styles.p} font-semibold text-[#6EBB2F] mb-4`}
            style={{ fontFamily: "Plaffair Display" }}
          >
            {t("quiskLinks.title")}
          </p>
          <ul className={`${styles.flexCol} gap-2`}>
            {quiskLinks.map((i, x) => (
              <li key={x}>
                <Link
                  className={`${styles.p} text-white hover:text-[#6EBB2F] transition-all duration-150`}
                  href={i.url}
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={`w-full sm:w-2/5 md:w-1/5 xl:w-1/4`}>
          <p
            className={`${styles.p} font-semibold text-[#6EBB2F] mb-4`}
            style={{ fontFamily: "Plaffair Display" }}
          >
            {t("destinations.title")}
          </p>
          <ul className={`${styles.flexCol} gap-2`}>
            {destinations.map((i, x) => (
              <li key={x}>
                <Link
                  className={`${styles.p} text-white hover:text-[#6EBB2F] transition-all duration-150`}
                  href={i.url}
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul
        className={`${styles.flex} max-w-[1800px] mx-auto flex-wrap sm:justify-between justify-center mb-5 gap-5 sm:py-6 py-3 border-y-1 border-gray-600`}
      >
        {socialLinks.slice(0, 3).map((item, x) => {
          const Icon = iconMap[item.lucideName];
          if (!Icon) return null;

          return (
            <li key={x}>
              <Link
                href={item.url}
                className={`${styles.flex} gap-3 transition`}
              >
                <span
                  className={`bg-green-400/30 ${styles.flexCenter}  w-14 h-14 p-3 rounded-full`}
                >
                  <Icon className="w-wull h-full text-green-400" />
                </span>
                <p className={`${styles.p} hover:text-[#6EBB2F] text-white`}>
                  {item.label}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      <div
        className={`${styles.flexBetween} gap-3 max-w-[1800px] mx-auto text-gray-400`}
      >
        <span
          className={`${styles.span} sm:text-start text-center w-full sm:w-fit`}
        >
          {t("copyright")}
        </span>
        <ul
          className={`w-full sm:w-fit flex sm:flex-row flex-col items-center sm:gap-5 gap-2`}
        >
          {footBottom.map((i, x) => (
            <li key={x}>{i.label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Footer;
