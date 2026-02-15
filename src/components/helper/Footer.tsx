"use client";
import { NavigationLinks } from "@/interfaces/navbar.interface";
import { styles } from "@/styles/styles";
import {
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations("footer");
  const header = useTranslations("header");
  const navigationLinks = header.raw("navigationLinks") as NavigationLinks[];
  const [hover, setHover] = useState<string | null>(null);
  return (
    <footer className="w-full border-t-2 border-gray-300">
      <div
        className={`${styles.flexBetween} flex-wrap items-stretch 2xl:p-16 xl:p-14 lg:p-12 md:p-8 p-4 max-w-[1980px] mx-auto`}
      >
        <div
          className={`space-y-5 w-full lg:w-1/3 xl:w-1/5 p-5 flex flex-col items-center lg:items-start`}
        >
          <Link href={"/"} className="w-fit">
            <Image
              src={"/logoPage.svg"}
              alt="Centralia travel agency"
              width={208}
              height={80}
              unoptimized
              className="object-contain w-full"
            />
          </Link>
          <p className={`${styles.p} lg:text-left text-center text-gray-500`}>
            {t("title")}
          </p>
          <ul
            className={`w-full ${styles.flex} justify-center lg:justify-start flex-wrap gap-3`}
          >
            <li>
              <Link
                target="_blank"
                href={
                  "https://www.facebook.com/share/187357wTNg/?mibextid=wwXIfr"
                }
                className={`${styles.flexCenter} bg-[#E9F6F9] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
              >
                <Facebook />
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href={"https://www.youtube.com/@centraliatravel"}
                className={`${styles.flexCenter} bg-[#E9F6F9] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
              >
                <Youtube />
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href={
                  "https://www.instagram.com/centraliatravel?igsh=czVuNmNwNHkyZzNy&utm_source=qr"
                }
                className={`${styles.flexCenter} bg-[#E9F6F9] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
              >
                <Instagram />
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3 sm:w-1/2 md:w-1/3 xl:w-1/5 p-5">
          <h2 className={`${styles.h3} !text-[#056D50]`}>{t("category")}</h2>
          <ul className={`w-full ${styles.flexCol} gap-1`}>
            {navigationLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  onMouseOver={() => setHover(link.label)}
                  onMouseOut={() => setHover(null)}
                  className={`hover:text-[#056D50] w-fit ${styles.flex} gap-1 text-gray-500 transition text-md`}
                  href={link.path}
                >
                  <ChevronRight className="w-5 h-5" />
                  <span
                    className={`${hover === link.label && "translate-x-2"
                      } transition-all ease-in-out duration-200`}
                  >
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                onMouseOver={() => setHover("/news")}
                onMouseOut={() => setHover(null)}
                className={`hover:text-[#056D50] w-fit ${styles.flex} gap-1 text-gray-500 transition text-md`}
                href={`/news`}
              >
                <ChevronRight className="w-5 h-5" />
                <span
                  className={`${hover === "/news" && "translate-x-2"
                    } transition-all ease-in-out duration-200`}
                >
                  {t("news")}
                </span>
              </Link>
            </li>
            <li>
              <Link
                onMouseOver={() => setHover("/events")}
                onMouseOut={() => setHover(null)}
                className={`hover:text-[#056D50] w-fit ${styles.flex} gap-1 text-gray-500 transition text-md`}
                href={`/events`}
              >
                <ChevronRight className="w-5 h-5" />
                <span
                  className={`${hover === "/events" && "translate-x-2"
                    } transition-all ease-in-out duration-200`}
                >
                  {t("events")}
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3 sm:w-1/2 md:w-1/3 xl:w-1/5 p-5">
          <h2 className={`${styles.h4} !text-[#056D50]`}>{t("touch")}</h2>
          <ul className={`w-full ${styles.flexCol} gap-3`}>
            <li>
              <Link
                className={`${styles.flex} text-gray-500 transition gap-1 hover:text-[#056D50]`}
                href={"tel:+998 94 501 92 72"}
              >
                <span
                  className={`${styles.flexCenter} shrink-0 bg-[#E9F6F9] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
                >
                  <Phone />
                </span>
                <span className={`text-md`}>+998 94 501 92 72</span>
              </Link>
            </li>
            <li>
              <Link
                className={`${styles.flex} text-gray-500 transition gap-1 hover:text-[#056D50]`}
                href={"mailto:travel@centraliatours.com"}
              >
                <span
                  className={`${styles.flexCenter} shrink-0 bg-[#E9F6F9] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
                >
                  <Mail />
                </span>
                <span className={`text-md`}>travel@centraliatours.com</span>
              </Link>
            </li>
            <li>
              <div
                className={`${styles.flex} text-gray-500 transition gap-1 hover:text-[#056D50]`}
              >
                <span
                  className={`${styles.flexCenter} shrink-0 bg-[#E9F6F9] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
                >
                  <MapPin />
                </span>
                <span className={`text-md`}>{t("location")}</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="space-y-3 sm:w-1/2 md:w-1/3 xl:w-1/5 p-5">
          <h2 className={`${styles.h4} !text-[#056D50]`}>
            {t("privacyTitle")}
          </h2>
          <ul className={`w-full ${styles.flexCol} gap-1`}>
            <Link
              className={`hover:text-[#056D50] w-fit ${styles.flex} gap-1 text-gray-500 transition text-md`}
              href={`/privacy-policy`}
            >
              {t("privacy")}
            </Link>
            <Link
              className={`hover:text-[#056D50] w-fit ${styles.flex} gap-1 text-gray-500 transition text-md`}
              href={`/terms-of-service`}
            >
              {t("terms")}
            </Link>
          </ul>
        </div>
        <div className="space-y-3 sm:w-1/2 md:w-1/3 xl:w-1/5 p-5">
          <h2 className={`${styles.h4} !text-[#056D50]`}>{t("post")}</h2>
          <div className={`${styles.flex} gap-1 flex-wrap`}>
            {["i1.jpg", "i2.jpg", "i3.jpg", "i4.jpg", "i5.jpg"].map(
              (i, idx) => (
                <Image
                  key={idx}
                  src={`/${i}`}
                  alt="Instagram posts"
                  width={80}
                  height={80}
                  className="object-cover rounded-lg w-16 h-16"
                />
              ),
            )}
          </div>
        </div>
      </div>
      <div
        className={`bg-cover bg-center sm:py-5 sm:px-10 p-4`}
        style={{
          backgroundImage: `linear-gradient(to right,#0D0D0C80,#0D0D0C80), url("/i4.jpg")`,
        }}
      >
        <p className="text-center text-white">{t("bottom")}</p>
      </div>
    </footer>
  );
};

export default Footer;
