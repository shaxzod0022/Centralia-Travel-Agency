"use client";
import { useState } from "react";
import ImageViewer from "./ImageViewer";

interface GalleryGridProps {
    images: string[];
    title?: string;
}

const GalleryGrid = ({ images, title = "Gallery" }: GalleryGridProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    if (!images || images.length === 0) return null;

    // Logic:
    // Mobile: 1 col
    // Tablet: 2 cols
    // Desktop: 3 cols
    // Max visible: 3

    const visibleImages = images.slice(0, 3);
    const total = images.length;

    const handleImageClick = (index: number) => {
        setInitialIndex(index);
        setIsOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleImages.map((src, i) => {
                    // Responsive Visibility Classes based on index
                    // Index 0: Always visible
                    // Index 1: Hidden on mobile (block md:block)
                    // Index 2: Hidden on mobile & tablet (hidden lg:block)
                    let visibilityClass = "block";
                    if (i === 1) visibilityClass = "hidden md:block";
                    if (i === 2) visibilityClass = "hidden lg:block";

                    return (
                        <div
                            key={i}
                            className={`relative aspect-video overflow-hidden rounded-lg group cursor-pointer ${visibilityClass}`}
                            onClick={() => handleImageClick(i)}
                        >
                            <img
                                src={src}
                                alt={`${title} image ${i + 1}`}
                                loading="lazy"
                                decoding="async"
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />

                            {/* Hover overlay for all images */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                            {/* 
                  RESPONSIVE OVERLAYS 
                  Show overlay if there are more images hidden at this specific breakpoint.
              */}

                            {/* Mobile Overlay (Only on 1st image, if total > 1) */}
                            {i === 0 && total > 1 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center md:hidden">
                                    <span className="text-white text-3xl font-bold">
                                        +{total - 1}
                                    </span>
                                </div>
                            )}

                            {/* Tablet Overlay (Only on 2nd image, if total > 2) */}
                            {i === 1 && total > 2 && (
                                <div className="absolute inset-0 bg-black/50 hidden md:flex lg:hidden items-center justify-center">
                                    <span className="text-white text-3xl font-bold">
                                        +{total - 2}
                                    </span>
                                </div>
                            )}

                            {/* Desktop Overlay (Only on 3rd image, if total > 3) */}
                            {i === 2 && total > 3 && (
                                <div className="absolute inset-0 bg-black/50 hidden lg:flex items-center justify-center">
                                    <span className="text-white text-3xl font-bold">
                                        +{total - 3}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <ImageViewer
                images={images}
                initialIndex={initialIndex}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

export default GalleryGrid;
