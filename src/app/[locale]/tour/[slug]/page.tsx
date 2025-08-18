import { TourInfo, TravelersComment } from "@/components";
import { TourService } from "@/services/tour.service";
import { styles } from "@/styles/styles";
import React from "react";
import { notFound } from "next/navigation";
import { TourProps } from "@/interfaces/signature.interface";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  try {
    const tour: TourProps | null = await TourService.getBySlugTour(slug);
    
    if (!tour) {
      notFound();
    }

    return (
      <div className={`mt-16 max-w-[1800px] mx-auto ${styles.paddingCont}`}>
        <TourInfo data={tour} />
        <TravelersComment />
      </div>
    );
  } catch (error) {
    console.error('Error fetching tour:', error);
    notFound();
  }
}
