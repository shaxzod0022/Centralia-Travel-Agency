"use client";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import FormatDate from "../helper/DataFormat";
import { NewsProps } from "@/interfaces/news.interface";

interface NewsComponentProps {
  data: NewsProps[];
}

const NewsComponent = ({ data = [] }: NewsComponentProps) => {
  const t = useTranslations("news");
  const router = useRouter();

  return (
    <section
      className={`${styles.paddingCont} flex items-stretch flex-wrap w-full`}
    >
      {data.map((item, i) => (
        <div
          onClick={() => router.push(`/news/${item.slug}`)}
          key={i}
          className="p-3 md:w-1/2 2xl:w-1/3 w-full cursor-pointer"
        >
          <div
            className={`${styles.flexCol} shadow-sm pb-2 rounded-2xl flex flex-col h-full`}
          >
            <div className="relative rounded-xl overflow-hidden aspect-video 2xl:h-56 w-full">
              <img
                src={item.featuredImage}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="space-y-2">
                <div className={`${styles.flex} items-center gap-2`}>
                  <span className="bg-gray-800 rounded text-white px-2 text-sm font-semibold">
                    {FormatDate({ date: item.publishedAt })}
                  </span>
                  <span className={`${styles.span}`}>
                    {item.readTime} {t("read")}
                  </span>
                  <span className="w-0.5 h-4 bg-gray-500 rounded"></span>

                  <span className={`${styles.span}`}>
                    {item.viewsCount} {t("view")}
                  </span>
                </div>
                <h3 className={`${styles.h4} !text-black`}>{item.title}</h3>
                <p className={`${styles.span} mb-5`}>
                  {item.content.slice(0, 200)}
                </p>
              </div>
              <Link
                href={`/news/${item.slug}`}
                className={`bg-[#6EBB2D] mt-auto w-fit active:bg-[#6EBB2D] hover:bg-[#88d747] transition py-2 px-5 font-semibold text-white rounded`}
              >
                {t("btn")}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default NewsComponent;
