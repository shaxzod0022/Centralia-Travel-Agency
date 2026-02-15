"use client";

import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { MoveRight } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useEffect, useRef, useState } from "react";
import { Blog } from "@/interfaces/blog.interface";
import FormatDate from "../helper/DataFormat";
import { Playfair } from "next/font/google";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

interface Blogs4Props {
  data: Blog[];
}

const Blogs4 = ({ data }: Blogs4Props) => {
  const t = useTranslations("blogsHome");
  const router = useRouter();

  if (data.length === 0) {
    return null;
  }

  // Drag-to-scroll refs/states for mouse dragging (desktop)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // pagination / dots (mobile & tablet only)
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const stop = () => setIsDragging(false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);

  // update slidesPerView and showDots based on window width
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const spv = w < 640 ? 1 : 2;
      setSlidesPerView(spv);
      // update active page according to current scroll position
      const c = containerRef.current;
      if (c) {
        const cardW = Math.max(1, c.clientWidth / spv);
        const page = Math.round(c.scrollLeft / cardW);
        const maxPage = Math.max(0, data.length - spv);
        setActivePage(Math.min(page, maxPage));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // update active page on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardW = Math.max(1, el.clientWidth / slidesPerView);
      const page = Math.round(el.scrollLeft / cardW);
      const maxPage = Math.max(0, data.length - slidesPerView);
      setActivePage(Math.min(Math.max(0, page), maxPage));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [slidesPerView]);

  const goToPage = (p: number) => {
    const c = containerRef.current;
    if (!c) return;
    const cardW = Math.max(1, c.clientWidth / slidesPerView);
    const left = p * cardW;
    c.scrollTo({ left, behavior: "smooth" });
    setActivePage(p);
  };

  const onPointerDown = (e: any) => {
    // only enable custom dragging for mouse (preserve native touch scrolling)
    if (e.pointerType !== "mouse") return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    if (containerRef.current)
      scrollLeftRef.current = containerRef.current.scrollLeft;
    try {
      e.target?.setPointerCapture?.(e.pointerId);
    } catch { }
  };

  const onPointerMove = (e: any) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - startXRef.current;
    containerRef.current.scrollLeft = scrollLeftRef.current - dx;
  };

  const onPointerUp = (e: any) => {
    setIsDragging(false);
    try {
      e.target?.releasePointerCapture?.(e.pointerId);
    } catch { }
  };

  return (
    <div className="bg-[#E9F6F9] w-full">
      <div
        className={`${styles.paddingCont} ${styles.flexCol} items-center w-full`}
      >
        <div
          className={`sm:text-left text-center flex items-center sm:justify-between sm:flex-row flex-col gap-3 w-full mb-5 2xl:px-3 px-2`}
        >
          <div>
            <h2 className={`${styles.h2} text-[#056D50]`}>{t("title")}</h2>
            <p className={`${styles.h3} !text-[#056D50] ${playfair.className}`}>
              {t("desc")}
            </p>
          </div>
          <Link
            href={"/blogs"}
            className={`${styles.flexCenter} font-semibold gap-3 rounded-3xl px-5 py-2 text-[#056D50] border border-[#056D50] hover:bg-[#056D50] hover:text-white transition active:scale-95 text-sm md:text-md`}
          >
            <span>{t("btnHead")}</span>
            <MoveRight />
          </Link>
        </div>

        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`scrollbar-hide relative w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
        >
          <div className="flex transition-transform duration-500 ease-in-out items-stretch">
            {data.map((item, i) => (
              <div
                key={i}
                className="group snap-start shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2 flex"
              >
                {/* CARD */}
                <div
                  onClick={() => router.push(`/blogs/${item.slug}`)}
                  className="w-full rounded-xl shadow-md flex flex-col h-full bg-white cursor-pointer transition-transform active:scale-[0.98] duration-200"
                >
                  {/* IMAGE */}
                  <div className="w-full h-44 rounded-xl overflow-hidden">
                    <img
                      src={item.featuredImage}
                      loading="lazy"
                      decoding="async"
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* TOP CONTENT */}
                    <div>
                      <div className={`${styles.flexStart} gap-3 mb-3`}>
                        <span className={styles.span}>
                          {FormatDate({ date: item.publishedAt })}
                        </span>
                        <span className="w-[1.4px] h-4 bg-gray-500 rounded" />
                        <span className={styles.span}>
                          {item.readTime} {t("read")}
                        </span>
                        {/* <span className="w-[1.4px] h-4 bg-gray-500 rounded" />
                        <span className={styles.span}>
                          {item.viewsCount} {t("view")}
                        </span> */}
                      </div>

                      {/* TITLE */}
                      <h4
                        className={`${styles.h4} !text-[#056D50] mb-5 line-clamp-3`}
                      >
                        {item.title}
                      </h4>
                    </div>

                    {/* BUTTON — ALWAYS BOTTOM */}
                    <div
                      className={`${styles.flexCenter} mt-auto w-fit text-sm md:text-md font-semibold gap-3 rounded-3xl px-5 py-2 text-[#056D50] border border-[#056D50] hover:bg-[#056D50] hover:text-white transition active:scale-95`}
                    >
                      <span>{t("btn")}</span>
                      <MoveRight />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {
          <div className="flex items-center justify-center gap-2 mt-3 xl:hidden">
            {Array.from({
              length: Math.max(1, data.length - slidesPerView + 1),
            }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx)}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${activePage === idx
                  ? "bg-[#6EBB2D] border-[#6EBB2D]"
                  : "bg-transparent border-[#056D50]"
                  }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        }
      </div>
    </div >
  );
};

export default Blogs4;
