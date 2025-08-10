import { TranslationsProps } from "@/interfaces/helper.interface";
import { BlogProps } from "@/interfaces/insights.interface";
import { styles } from "@/styles/styles";
import { CalendarDays, Eye, Star, User, Users } from "lucide-react";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import React, { FC } from "react";

interface Props {
  data: BlogProps;
}

const Blog: FC<Props> = ({ data }) => {
  const lang = useLocale();
  if (!data) {
    return notFound();
  }
  return (
    <div className={`${styles.paddingCont} ${styles.flexBetween} !items-start`}>
      <div
        className={`lg:w-[65%] border border-gray-400 rounded-xl w-full md:gap-5`}
      >
        <div className={`${styles.flexCol} gap-3 p-5`}>
          <h4 className={`${styles.h4} mb-2`}>
            {data.title[lang as keyof TranslationsProps]}
          </h4>
          <p className={`${styles.p}`}>
            {data.summary[lang as keyof TranslationsProps]}
          </p>
          <p className={`${styles.p}`}>
            {data.content[lang as keyof TranslationsProps]}
          </p>
          <div>
            <img
              className="rounded-xl mb-3 w-full object-cover"
              src={data.coverImage}
              alt={data.title[lang as keyof TranslationsProps]}
            />
            <div>
              {data.tags.map((item, idx) => (
                <span
                  key={idx}
                  className="mr-3 border-2 capitalize border-gray-400 rounded-2xl px-2 py-1"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`${styles.flex} flex-wrap gap-4 p-5 bg-slate-200 rounded-b-xl`}
        >
          <div className={`${styles.flex} flex-wrap gap-2`}>
            <span className="bg-gray-400 inline-block p-2 rounded-full">
              <User className="text-white" size={25} />
            </span>
            <p className={`${styles.p}`}>{data.author.name}</p>
          </div>
          <div
            className={`${styles.flex} flex-wrap gap-2 bg-white rounded px-2 py-1`}
          >
            <Star className="text-yellow-400" />
            <span className={`${styles.span}`}>{data.ratingAvg}</span>
          </div>
          <div
            className={`${styles.flex} flex-wrap gap-2 bg-white rounded px-2 py-1`}
          >
            <Users className="text-green-500" />
            <span className={`${styles.span}`}>{data.ratingCount}</span>
          </div>
          <div
            className={`${styles.flex} flex-wrap gap-2 bg-white rounded px-2 py-1`}
          >
            <Eye className="text-blue-600" />
            <span className={`${styles.span}`}>{data.views}</span>
          </div>
          <div
            className={`${styles.flex} flex-wrap gap-2 bg-white rounded px-2 py-1`}
          >
            <CalendarDays className="text-green-900" />
            <span className={`${styles.span}`}>{data.publishedAt}</span>
          </div>
        </div>
      </div>
      <div className={`lg:w-[33%] w-full`}>Comments</div>
    </div>
  );
};

export default Blog;
