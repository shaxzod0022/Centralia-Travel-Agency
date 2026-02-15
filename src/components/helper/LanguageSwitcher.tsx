"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, memo, useEffect, useRef } from "react";
import { styles } from "@/styles/styles";
import { useLocale } from "next-intl";

const languageOptions = [
  { value: "en", label: "English", icon: "gb" },
  { value: "ru", label: "Русский", icon: "ru" },
  { value: "es", label: "Espanyol", icon: "es" },
  { value: "ja", label: "日本語", icon: "jp" },
  { value: "de", label: "Deutsch", icon: "de" },
];

const LanguageSwitcher = memo(function LanguageSwitcher({
  isScrolled,
}: {
  isScrolled: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ⬅️ Dropdown tashqariga bosilganda yopish
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // We need to import useLocale
  const currentLocale = useLocale();

  const handleLanguageChange = useCallback(
    (newLocale: string) => {
      setIsOpen(false);
      // next-intl expects pathname without locale (which usePathname provides)
      // and handles locale prefixing automatically.
      // We manually append search params if they exist.
      const queryString = searchParams.toString();
      const pathWithQuery = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(pathWithQuery, { locale: newLocale });
    },
    [pathname, searchParams, router]
  );

  const currentIcon = languageOptions.find((i) => i.value === currentLocale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.flex} hover:scale-105 active:scale-100 transition gap-2 lg:p-3 md:p-[10px] p-[8px] rounded-full bg-[#6EBB2D66]`}
      >
        {/* BAYROQ + Correct size */}
        <div className="xl:w-6 xl:h-6 w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
          <span className={`fi fi-${currentIcon?.icon} scale-150`}></span>
        </div>

        <span
          className={`capitalize ${isScrolled ? "text-[#056D50]" : "text-white"
            } font-semibold md:block hidden`}
        >
          {currentIcon?.label.slice(0, 2)}
        </span>
      </button>

      {isOpen && (
        <ul className="absolute top-12 left-1/2 -translate-x-1/2 mt-2 w-36 p-3 bg-white rounded-md shadow-md">
          {languageOptions.map((lang) => (
            <li key={lang.value}>
              <button
                onClick={() => handleLanguageChange(lang.value)}
                className={`w-full ${styles.flexStart
                  } gap-3 text-left px-3 py-2 rounded-md text-sm font-semibold hover:bg-green-100 ${currentLocale === lang.value
                    ? "bg-[#6EBB2D66] text-[#056D50]"
                    : ""
                  }`}
              >
                <span className={`fi fi-${lang.icon} shadow`}></span>
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default LanguageSwitcher;
