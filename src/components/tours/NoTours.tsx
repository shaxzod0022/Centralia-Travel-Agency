"use client";

import { styles } from "@/styles/styles";
import { MoveLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Bevan } from "next/font/google";
import { useRouter } from "next/navigation";

const jaro = Bevan({
    subsets: ["latin"],
    weight: ["400"],
});

const NoTours = () => {
    const t = useTranslations("toursNotFound");
    const router = useRouter();

    return (
        <div
            className={`
        relative w-full min-h-screen bg-no-repeat bg-center bg-cover 
        // md:bg-[url('/pagenotfound.png')]
        // bg-[url('/mobil_not_found.jpg')]
      `}
        >
            {/* Content */}
            <div
                className="
          absolute inset-0 z-10 
          flex flex-col items-center justify-center text-center px-5
        "
            >
                <h2
                    className={`text-[#056D50] 2xl:text-[80px] md:text-[60px] text-[30px] ${jaro.className}`}
                >
                    {t("title")}
                </h2>

                <p className={`${styles.p} text-[#056D50]! max-w-[600px] mt-2 mb-6`}>
                    {t("description")}
                </p>

                <div className={`${styles.flexCenter} gap-3`}>
                    <button
                        onClick={() => router.replace("/")}
                        className="
            bg-[#056D50] hover:bg-[#159571]
            transition py-3 px-7 
            font-bold text-white rounded-3xl 
            flex items-center gap-2 active:scale-95 text-[15px] md:text-[17px]
          "
                    >
                        <MoveLeft />
                        <span>{t("buttonLabel")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoTours;
