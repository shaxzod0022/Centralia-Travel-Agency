import { TourInfo, TravelersComment } from "@/components";
import { TourService } from "@/services/tour.service";
import { styles } from "@/styles/styles";
import React from "react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tour = await TourService.getBySlugTour(slug);
  return (
    <div className={`mt-16 max-w-[1800px] mx-auto ${styles.paddingCont}`}>
      <TourInfo data={tour} />
      <TravelersComment />
    </div>
  );
}
