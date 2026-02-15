"use client";

import { memo, useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Play,
  Pause,
  X,
} from "lucide-react";
import Image from "next/image";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { TourComplete } from "@/interfaces/tourComplete.interface";

interface TourDetails {
  generalInfo: TourComplete;
}

const TourImages = ({ generalInfo }: TourDetails) => {
  const [itemsPerView, setItemsPerView] = useState(1);
  const [playingVideos, setPlayingVideos] = useState<number[]>([]);
  const t = useTranslations("tourDetails");
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [indexModal, setIndexModal] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Loading state for individual images
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => ({ ...prev, [index]: true }));
  };

  // Video ref'larini to'g'ri set qilish
  const setVideoRef = useCallback(
    (i: number) => (el: HTMLVideoElement | null) => {
      videoRefs.current[i] = el;
    },
    [],
  );

  // RESPONSIVE & MOUNT
  useEffect(() => {
    setMounted(true);
    const updateView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };

    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  // Slayd o'zgarganda videolarni to'xtatish
  useEffect(() => {
    playingVideos.forEach((videoIndex) => {
      const video = videoRefs.current[videoIndex];
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    setPlayingVideos([]);
  }, [index]);

  const maxIndex = Math.max(generalInfo.gallery.length - itemsPerView, 0);

  const next = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // TOUCH
  const startX = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const diff = startX.current - currentX;

    if (Math.abs(diff) > 30) {
      e.preventDefault(); // Scrollni oldini olish
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
  };

  // Fayl turini aniqlash
  const getFileType = (url: string): "image" | "video" => {
    if (!url) return "image";
    const extension = url.split(".").pop()?.split("?")[0].toLowerCase();
    return extension === "mp4" || extension === "webm" || extension === "ogg"
      ? "video"
      : "image";
  };

  // Video click handler
  const handleVideoClick = (i: number) => {
    const video = videoRefs.current[i];
    if (!video) return;

    if (video.paused) {
      // Barcha videolarni to'xtatish
      videoRefs.current.forEach((v, idx) => {
        if (v && idx !== i) {
          v.pause();
          v.currentTime = 0;
        }
      });

      // Yangi videoni o'ynatish
      video
        .play()
        .then(() => {
          setPlayingVideos([i]);
        })
        .catch((err) => {
          console.error("Video play error:", err);
        });
    } else {
      video.pause();
      setPlayingVideos((prev) => prev.filter((idx) => idx !== i));
    }
  };

  // Videoni to'xtatish (slider harakatlanganda)
  const stopAllVideos = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    setPlayingVideos([]);
  }, []);

  // Auto-slide uchun effect (ixtiyoriy)
  useEffect(() => {
    const interval = setInterval(() => {
      if (playingVideos.length === 0) {
        // Video o'ynayotganda auto-slide to'xtaydi
        next();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [playingVideos]);

  // Slider tugmalarini bosganda videolarni to'xtatish
  const handleControlClick = (direction: "prev" | "next") => {
    stopAllVideos();
    if (direction === "prev") {
      prev();
    } else {
      next();
    }
  };

  const openModal = (i: number) => {
    stopAllVideos(); // slider videolarini to‘xtatamiz
    setIndexModal(i);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const modalNext = () => {
    setIndexModal((prev) =>
      prev >= generalInfo.gallery.length - 1 ? 0 : prev + 1,
    );
  };

  const modalPrev = () => {
    setIndexModal((prev) =>
      prev <= 0 ? generalInfo.gallery.length - 1 : prev - 1,
    );
  };

  return (
    <>
      <div className="relative w-full overflow-hidden px-2 max-w-[1980px] mx-auto">
        {!mounted ? (
          // INITIAL SKELETON STATE (Responsive 1-2-3)
          <div className="flex gap-0 w-full overflow-hidden">
            {/* 1st Skeleton - Always visible */}
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 shrink-0">
              <div className="h-[260px] md:h-[350px] lg:h-[400px] w-full rounded-xl bg-gray-200 animate-pulse" />
            </div>
            {/* 2nd Skeleton - Tablet & Desktop */}
            <div className="hidden sm:block w-1/2 lg:w-1/3 px-2 shrink-0">
              <div className="h-[260px] md:h-[350px] lg:h-[400px] w-full rounded-xl bg-gray-200 animate-pulse" />
            </div>
            {/* 3rd Skeleton - Desktop only */}
            <div className="hidden lg:block w-1/3 px-2 shrink-0">
              <div className="h-[260px] md:h-[350px] lg:h-[400px] w-full rounded-xl bg-gray-200 animate-pulse" />
            </div>
          </div>
        ) : (
          // REAL SLIDER
          <>
            <div
              ref={sliderRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${index * (100 / itemsPerView)}%)`,
              }}
            >
              {generalInfo.gallery.map((src, i) => {
                const fileType = getFileType(src);
                const isVideo = fileType === "video";
                const isPlaying = playingVideos.includes(i);
                const isLoaded = imagesLoaded[i];

                return (
                  <div
                    key={i}
                    className="relative shrink-0 px-2 group"
                    style={{
                      width: `${100 / itemsPerView}%`,
                    }}
                  >
                    <div className="relative h-[260px] md:h-[350px] lg:h-[400px] w-full rounded-xl overflow-hidden bg-gray-100">
                      {/* Skeleton Overlay for individual images during network fetch */}
                      {!isLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
                      )}

                      {isVideo ? (
                        <div
                          className="relative w-full h-full cursor-pointer"
                          onClick={() => handleVideoClick(i)}
                        >
                          <video
                            ref={setVideoRef(i)}
                            src={src}
                            className="w-full h-full object-cover"
                            playsInline
                            muted={!isPlaying}
                            preload="metadata"
                            poster={src.replace(".mp4", ".jpg")}
                            onClick={(e) => e.stopPropagation()}
                            onLoadedData={() => handleImageLoad(i)}
                          >
                            Your browser does not support the video tag.
                          </video>

                          {/* Video overlay controls */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300 hover:bg-black/30">
                            <div
                              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isPlaying
                                  ? "bg-white/20 backdrop-blur-sm"
                                  : "bg-white/90 hover:bg-white"
                              }`}
                            >
                              {isPlaying ? (
                                <Pause className="w-6 h-6 text-white" />
                              ) : (
                                <Play className="w-6 h-6 text-black ml-1" />
                              )}
                            </div>
                          </div>
                          {isPlaying && (
                            <div className="absolute bottom-3 left-3 right-3 h-1 bg-white/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-white"
                                style={{
                                  width: `${((videoRefs.current[i]?.currentTime || 0) / (videoRefs.current[i]?.duration || 1)) * 100}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <Image
                          onClick={() => openModal(i)}
                          src={src}
                          alt={`${generalInfo.name} - image ${i + 1}`}
                          fill
                          priority={i < 3}
                          className={`object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onLoad={() => handleImageLoad(i)}
                          onError={(e) => {
                            // Error handling
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CONTROLS */}
            <button
              onClick={() => handleControlClick("prev")}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 cursor-pointer p-3 rounded-full text-white transition-all duration-300 z-10 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={() => handleControlClick("next")}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 cursor-pointer p-3 rounded-full text-white transition-all duration-300 z-10 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dots indicator */}
            {generalInfo.gallery.length > itemsPerView && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({
                  length: Math.ceil(generalInfo.gallery.length / itemsPerView),
                }).map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => {
                      stopAllVideos();
                      setIndex(dotIndex);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      dotIndex === Math.floor(index / itemsPerView)
                        ? "bg-[#056D50] w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white z-10"
          >
            <X size={32} />
          </button>

          {/* Prev */}
          <button
            onClick={modalPrev}
            className="absolute left-6 text-white z-10"
          >
            <ChevronLeft size={40} />
          </button>

          {/* CONTENT */}
          <div className="max-h-[85vh] max-w-[90vw] flex items-center justify-center">
            {getFileType(generalInfo.gallery[indexModal]) === "video" ? (
              <video
                src={generalInfo.gallery[indexModal]}
                autoPlay
                controls
                controlsList="nodownload"
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
              />
            ) : (
              <div className="relative max-h-[85vh] max-w-[90vw] w-full h-full">
                <Image
                  src={generalInfo.gallery[indexModal]}
                  className="object-contain rounded-xl"
                  alt="Centralia gallery"
                  width={1200}
                  height={800}
                  unoptimized
                  style={{
                    width: "auto",
                    height: "auto",
                    maxHeight: "85vh",
                    maxWidth: "90vw",
                  }}
                />
              </div>
            )}
          </div>

          {/* Next */}
          <button
            onClick={modalNext}
            className="absolute right-6 text-white z-10"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      {/* TOUR INFO SECTION */}
      <div className={`${styles.paddingCont} !py-10`}>
        <div className="space-y-1 sm:mb-8 mb-4">
          <h1 className={`${styles.h3} leading-8 font-bold`}>
            {generalInfo.name}
          </h1>
          <p
            className={`${styles.p} ${styles.flex} gap-1 flex-wrap items-center`}
          >
            <MapPin className="w-5 h-5 shrink-0 text-gray-600" />
            {generalInfo.countries.map((item, idx) => (
              <span key={item.id || idx} className="inline-flex items-center">
                {item.name}
                {idx < generalInfo.countries.length - 1 && (
                  <span className="text-gray-400 ml-1">•</span>
                )}
              </span>
            ))}
          </p>
        </div>
        <div className={`grid grid-cols-4 gap-4 lg:gap-6 justify-between`}>
          <div
            className={`${styles.flex} lg:w-auto gap-1 xl:col-span-1 md:col-span-2 col-span-4`}
          >
            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-gray-100 rounded-lg relative">
              <Image
                className="object-contain p-2"
                src={"/icons/clock-tour.svg"}
                alt="duration"
                fill
                unoptimized
              />
            </div>
            <div>
              <p className={`${styles.p} text-gray-600`}>{t("duration")}</p>
              <p className={`${styles.h4} leading-5 font-semibold`}>
                {generalInfo.durationDays}{" "}
                {generalInfo.durationDays === 1 ? t("day") : t("days")} /{" "}
                {generalInfo.durationNights}{" "}
                {generalInfo.durationNights === 1 ? t("night") : t("nights")}
              </p>
            </div>
          </div>
          <div
            className={`${styles.flex} lg:w-auto gap-1 xl:col-span-1 md:col-span-2 col-span-4`}
          >
            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-gray-100 rounded-lg relative">
              <Image
                className="object-contain p-2"
                src={"/icons/difficult-image.svg"}
                alt="Technical level"
                fill
                unoptimized
              />
            </div>
            <div>
              <p className={`${styles.p} text-gray-600`}>
                {t("technicalLevel")}
              </p>
              <p className={`${styles.h4} leading-5 font-semibold`}>
                {generalInfo.technicalLevel}/5
              </p>
            </div>
          </div>
          <div
            className={`${styles.flex} lg:w-auto gap-1 xl:col-span-1 md:col-span-2 col-span-4`}
          >
            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-gray-100 rounded-lg relative">
              <Image
                className="object-contain p-2"
                src={"/icons/people-image.svg"}
                alt="minimum age"
                fill
                unoptimized
              />
            </div>
            <div>
              <p className={`${styles.p} text-gray-600`}>{t("minAge")}</p>
              <p className={`${styles.h4} leading-5 font-semibold`}>
                {generalInfo.ageRange.min}+
              </p>
            </div>
          </div>
          <div
            className={`${styles.flex} lg:w-auto gap-1 xl:col-span-1 md:col-span-2 col-span-4`}
          >
            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-gray-100 rounded-lg relative">
              <Image
                className="object-contain p-2"
                src={"/icons/fitnes.svg"}
                alt="fitness level"
                fill
                unoptimized
              />
            </div>
            <div>
              <p className={`${styles.p} text-gray-600`}>{t("fitnesLevel")}</p>
              <p className={`${styles.h4} leading-5 font-semibold`}>
                {generalInfo.fitnessLevel}/5
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(TourImages);
