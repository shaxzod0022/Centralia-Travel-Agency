import { TourInfo } from "@/components";
import { TourService } from "@/services/tour.service";
import React from "react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tour = await TourService.getBySlugTour(slug);
  return (
    <div className={`mt-16 max-w-[1800px] mx-auto`}>
      <TourInfo data={tour} />
    </div>
  );
}
