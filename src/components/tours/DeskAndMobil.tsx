"use client";
import { TourComplete } from "@/interfaces/tourComplete.interface";
import DesktopView from "./DesktopView";
import MobilView from "./MobilView";
import { TourOption } from "@/interfaces/calendar.interface";
import { AddOns } from "@/interfaces/addOns.interface";
import Comments from "../home/Comments";
import Tours from "./Tours";
import { FilterService } from "@/rest/filter.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tour } from "@/interfaces/tour.interface";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Playfair } from "next/font/google";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

interface Props {
  completeTour: TourComplete;
  tourOption?: TourOption;
  addOns?: AddOns[];
}

const DeskAndMobil = ({ tourOption, addOns = [], completeTour }: Props) => {
  const { locale } = useParams();
  const t = useTranslations("tourDetails");
  const [toursData, setToursData] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await FilterService.getFilteredTours({
          language: locale as string,
          category:
            `${completeTour.categories && completeTour.categories[0].id}` ||
            undefined,
        });

        if (response?.success && response?.data?.tours) {
          const data = response.data.tours.filter(
            (i) => i.slug !== completeTour.slug,
          );
          setToursData(data);
        }
      } catch (error) {
        console.error("Tours fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [locale, completeTour]);

  return (
    <>
      <DesktopView
        generalInfo={completeTour}
        tourOption={tourOption}
        addOns={addOns}
      />

      <MobilView
        generalInfo={completeTour}
        tourOption={tourOption}
        addOns={addOns}
      />

      <Comments />

      {!loading && toursData.length > 0 && (
        <div className="w-full">
          <div className="w-full z-10">
            <h2 className={`${styles.h2} text-center text-[#056D50] mb-1`}>
              {t("similarToursTitle")}
            </h2>
            <p
              className={`text-center !text-[#056D50]/80 ${styles.h3} ${playfair.className}`}
            >
              {t("similarToursSubtitle")}
            </p>
          </div>
          <Tours data={toursData} />
        </div>
      )}
    </>
  );
};

export default DeskAndMobil;
