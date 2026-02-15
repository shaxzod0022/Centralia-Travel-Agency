// NavbarClient.tsx - Interactive navbar elements (search, cart, sidebar, scroll effects)
"use client";
import { NavigationLinks } from "@/interfaces/navbar.interface";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  Search,
  ShoppingCart,
  TextAlignJustify,
  TextAlignStart,
} from "lucide-react";
import SideBar from "./SideBar";
import { useRef, useState, useEffect, Suspense } from "react";
import DesktopSearchModal from "./DesktopSearchModal";
import MobileSearchModal from "./MobilSearchModal";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

interface NavbarClientProps {
  links: NavigationLinks[];
  newsLabel: string;
  eventsLabel: string;
}

const NavbarClient = ({ links, newsLabel, eventsLabel }: NavbarClientProps) => {
  const pathname = usePathname();
  const [show, setShow] = useState<boolean>(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState<string>("");

  const t = useTranslations("search");
  const placeholderTexts = [
    t("placeholderExplore"),
    t("placeholderFind"),
    t("placeholderQuestion"),
    t("placeholderAdventure"),
    t("placeholderImpressions"),
  ];

  const placeholder = useTypingEffect(placeholderTexts, 50, 30, 4000);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pagesOpen, setPagesOpen] = useState<boolean>(false);
  const pagesTimer = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const cart = useSelector((state: RootState) => state.cart.data);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePagesEnter = () => {
    if (pagesTimer.current) clearTimeout(pagesTimer.current);
    setPagesOpen(true);
  };

  const handlePagesLeave = () => {
    pagesTimer.current = setTimeout(() => {
      setPagesOpen(false);
    }, 200);
  };

  const [isStickyMenuOpen, setIsStickyMenuOpen] = useState<boolean>(false);
  const stickyMenuTimer = useRef<NodeJS.Timeout | null>(null);

  const handleStickyMenuEnter = () => {
    if (stickyMenuTimer.current) clearTimeout(stickyMenuTimer.current);
    setIsStickyMenuOpen(true);
  };

  const handleStickyMenuLeave = () => {
    stickyMenuTimer.current = setTimeout(() => {
      setIsStickyMenuOpen(false);
    }, 200);
  };

  const [showStickySearch, setShowStickySearch] = useState<boolean>(false);
  const [hasHeroSearch, setHasHeroSearch] = useState<boolean>(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let attempts = 0;
    const maxAttempts = 6;

    const tryAttach = () => {
      const target = document.getElementById("hero-search");
      const found = !!target;
      setHasHeroSearch(found);

      if (!found) {
        setShowStickySearch(true);
        if (attempts < maxAttempts) {
          attempts += 1;
          setTimeout(tryAttach, 200);
        }
        return;
      }

      setShowStickySearch(false);

      observer = new IntersectionObserver(
        ([entry]) => {
          setShowStickySearch(!entry.isIntersecting);
        },
        { root: null, threshold: 0 },
      );

      observer.observe(target);
    };

    tryAttach();

    return () => {
      observer?.disconnect();
    };
  }, [pathname]);

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`w-full fixed z-50 transition-all duration-500 ease-in-out ${isScrolled ? "bg-white shadow-md" : "bg-white/20 backdrop-blur-sm"
        }`}
    >
      <div
        className={`max-w-[1980px] mx-auto ${styles.flexBetween} xl:p-0 p-5 relative`}
      >
        <div className={`${styles.flexStart} gap-10`}>
          {/* Logotip */}
          {isScrolled ? (
            <>
              <Link href={"/"} className="xl:hidden inline">
                <div className="relative 2xl:w-60 xl:w-40 lg:w-36 sm:w-36 w-32 h-12">
                  <Image
                    src={"/logoPage.svg"}
                    alt="Centralia travel agency"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </Link>
              <Link
                href={"/"}
                className="xl:inline hidden h-[72px] w-[350.5px] relative"
              >
                <Image
                  src={"/logotip.svg"}
                  alt="Centralia travel agency"
                  fill
                  unoptimized
                  className="object-contain"
                  priority
                />
              </Link>
            </>
          ) : (
            <>
              <Link href={"/"} className="xl:hidden inline">
                <div className="relative 2xl:w-52 xl:w-40 lg:w-36 sm:w-36 w-32 h-12">
                  <Image
                    src={"/logoPage.svg"}
                    alt="Centralia travel agency"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </Link>
              <Link
                href={"/"}
                className="xl:flex hidden h-[72px] w-[350.5px] items-center justify-start pl-[29.5px] relative"
              >
                <div className="relative xl:w-40 lg:w-32 sm:w-28 w-24 h-full">
                  <Image
                    src={"/logoPage.svg"}
                    alt="Centralia travel agency"
                    fill
                    unoptimized
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </>
          )}

          {/* Navigation */}
          <ul
            className={`${styles.flexStart} z-20 lg:flex hidden 2xl:gap-7 gap-3`}
          >
            {hasHeroSearch && !showStickySearch ? (
              links.map((link, idx) => (
                <li
                  key={idx}
                  onMouseEnter={() => {
                    if (link.path === "/blogs") {
                      handlePagesEnter();
                    }
                  }}
                  onMouseLeave={() => {
                    if (link.path === "/blogs") {
                      handlePagesLeave();
                    }
                  }}
                  className="relative"
                >
                  <Link
                    href={link.path}
                    className={`font-semibold transition-colors duration-500 ease-in-out hover:text-[#056D50] ${isScrolled ? "text-black" : "text-white"
                      }`}
                  >
                    {link.label}
                  </Link>
                  {link.path === "/blogs" && pagesOpen && (
                    <div
                      className={`border border-gray-200 absolute top-8 min-w-32 -translate-x-1/2 left-1/2 bg-white rounded-xl shadow-md ${styles.flexCol} p-2`}
                    >
                      <Link
                        href={`/news`}
                        className={`text-gray-800 w-full py-1 px-3 hover:text-[#056D50] font-semibold`}
                      >
                        {newsLabel}
                      </Link>
                      <Link
                        href={`/events`}
                        className={`text-gray-800 w-full py-1 px-3 hover:text-[#056D50] font-semibold`}
                      >
                        {eventsLabel}
                      </Link>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li
                className="relative"
                onMouseEnter={handleStickyMenuEnter}
                onMouseLeave={handleStickyMenuLeave}
              >
                <button
                  type="button"
                  className="w-fit text-[#6EBB2D] hover:text-[#056D50] transition-colors duration-500"
                >
                  <TextAlignJustify className="w-8 h-8" />
                </button>

                {isStickyMenuOpen && (
                  <div
                    className="absolute w-72 left-1/2 -translate-x-1/2 top-[50px] bg-white shadow-xl z-30 animate-slide-down rounded-xl"
                    onMouseEnter={handleStickyMenuEnter}
                    onMouseLeave={handleStickyMenuLeave}
                  >
                    <ul className="mx-auto p-5">
                      {links.map((link, idx) => (
                        <li key={idx}>
                          <Link
                            onClick={handleStickyMenuLeave}
                            href={link.path}
                            className={`block w-fit ${styles.p
                              } font-semibold transition-colors duration-500 hover:text-[#056D50] ${pathname === link.path
                                ? "text-[#056D50]"
                                : "text-black"
                              }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          onClick={handleStickyMenuLeave}
                          href={`/news`}
                          className={`block w-fit ${styles.p
                            } font-semibold transition-colors duration-500 hover:text-[#056D50] ${pathname === "/news"
                              ? "text-[#056D50]"
                              : "text-black"
                            }`}
                        >
                          {newsLabel}
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleStickyMenuLeave}
                          href={`/events`}
                          className={`block w-fit ${styles.p
                            } font-semibold transition-colors duration-500 hover:text-[#056D50] ${pathname === "/events"
                              ? "text-[#056D50]"
                              : "text-black"
                            }`}
                        >
                          {eventsLabel}
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        <div
          className={`${styles.flexBetween} ${showStickySearch ? "hidden md:flex" : "hidden"
            } shadow border border-gray-200 relative bg-white rounded-full md:w-2/5 p-2`}
        >
          <input
            type="text"
            onChange={(e) => setDesktopSearchOpen(e.target.value)}
            className="outline-none lg:text-lg text-md px-2 py-1 lg:px-3 w-[95%]"
            placeholder={placeholder}
          />

          <button
            className={`${styles.flexCenter} absolute md:right-1 lg:right-2
        sm:w-10 sm:h-10 text-white bg-[#6EBB2D] rounded-full`}
          >
            <Search />
          </button>

          <DesktopSearchModal
            show={showStickySearch}
            value={desktopSearchOpen}
            onClose={() => setDesktopSearchOpen("")}
          />
        </div>

        <MobileSearchModal
          show={mobileSearchOpen}
          onClose={() => setMobileSearchOpen(false)}
        />

        <div
          className={`${styles.flex} relative flex-wrap sm:gap-4 gap-2 lg:pr-5 xl:pr-10`}
        >
          <Suspense fallback={null}>
            <LanguageSwitcher isScrolled={isScrolled} />
          </Suspense>

          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            className={`${styles.flex
              } hover:scale-105 active:scale-100 transition-all duration-300
        gap-2 md:p-3 p-2 rounded-full ${isScrolled ? "text-[#056D50]" : "text-white"
              }
        bg-[#6EBB2D66] md:hidden block`}
          >
            <Search className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          <Link
            href={`/cart`}
            className={`${styles.flex
              } relative hover:scale-105 active:scale-100 transition gap-2 md:p-3 p-2 rounded-full ${isScrolled ? "text-[#056D50]" : "text-white"
              } bg-[#6EBB2D66]`}
          >
            <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
            {isClient && cart.length !== 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full sm:w-5 sm:h-5 w-3 h-3 flex items-center justify-center text-[9px] sm:text-xs">
                {cart.length}
              </span>
            )}
          </Link>

          <div className="relative inline-block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShow(true)}
              className={`${styles.flex
                } lg:hidden inline-block overflow-hidden hover:scale-105 active:scale-100 transition-all duration-300 gap-2 md:p-3 p-2 rounded-full ${isScrolled ? "text-[#056D50]" : "text-white"
                } bg-[#6EBB2D66]`}
            >
              <TextAlignStart className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>

            <SideBar show={show} onClose={() => setShow(false)} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarClient;
