"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";

const EventsHead = () => {
  const t = useTranslations("events");

  return (
    <section className="lg:pt-24 pt-28 relative w-full overflow-hidden h-[50vh] md:h-[60vh] flex items-center justify-center">
      {/* Slider */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        <div
          className={`absolute inset-0 bg-cover bg-center`}
          style={{
            backgroundImage: `linear-gradient(to right,#0D0D0C80,#0D0D0C80), url("/og/events.jpg")`,
          }}
        ></div>
      </div>

      <h2 className={`${styles.h2} !text-white z-10`}>{t("title")}</h2>
    </section>
  );
};

export default EventsHead;
