"use client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ImageViewerProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

const ImageViewer = ({
    images,
    initialIndex,
    isOpen,
    onClose,
}: ImageViewerProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-fadeIn backdrop-blur-sm">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[60] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Swiper Container */}
            <div className="w-full h-full flex items-center justify-center p-4 md:p-10">
                <Swiper
                    modules={[Navigation, Pagination, Keyboard]}
                    initialSlide={initialIndex}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                        prevEl: ".swiper-button-prev-custom",
                        nextEl: ".swiper-button-next-custom",
                    }}
                    pagination={{ clickable: true }}
                    keyboard={{ enabled: true }}
                    className="w-full h-full max-w-5xl max-h-[85vh] rounded-lg"
                    onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                >
                    {images.map((src, idx) => (
                        <SwiperSlide
                            key={idx}
                            className="flex items-center justify-center w-full h-full"
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img
                                    src={src}
                                    alt={`Gallery image ${idx + 1}`}
                                    className="max-w-full max-h-full object-contain select-none"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <button className="swiper-button-prev-custom absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[60] p-3 text-white hover:text-green-400 transition-colors disabled:opacity-30">
                    <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                </button>
                <button className="swiper-button-next-custom absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[60] p-3 text-white hover:text-green-400 transition-colors disabled:opacity-30">
                    <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                </button>
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

export default ImageViewer;
