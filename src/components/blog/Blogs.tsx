"use client";
import { Blog } from "@/interfaces/blog.interface";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import FormatDate from "../helper/DataFormat";
import { Diamond } from "lucide-react";

interface BlogsProps {
  data: Blog[];
}

const Blogs = ({ data = [] }: BlogsProps) => {
  const t = useTranslations("blogs");

  return (
    <section
      className={`${styles.paddingCont} flex items-stretch flex-wrap w-full`}
    >
      {data.map((item, i) => (
        <div key={i} className="p-3 md:w-1/2 2xl:w-1/3 w-full">
          <div
            className={`${styles.flexCol} shadow-sm pb-2 rounded-2xl flex flex-col h-full`}
          >
            <div className="relative rounded-xl overflow-hidden 2xl:h-56 aspect-video w-full">
              <Link
                href={`/blogs/${item.slug}`}
                className="block w-full h-full relative"
              >
                <Image
                  src={item.featuredImage}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>
              {item.categories && item.categories.length !== 0 && (
                <div
                  className="absolute inset-0 z-10 flex items-end bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.5)_30%,transparent_70%)]"
                >
                  <div className="p-3 flex w-full flex-wrap overflow-hidden gap-2">
                    {item.categories.map((c, i) => (
                      <span key={i} className="flex items-center gap-2">
                        <Link
                          className="text-white text-sm font-medium hover:text-[#6EBB2D] transition-colors whitespace-nowrap"
                          href={`/blogs/category/${c.id}`}
                        >
                          {c.name}
                        </Link>
                        {item.categories && i !== item.categories.length - 1 && <Diamond className="text-white" size={10} />}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                <Link href={`/blogs/${item.slug}`}>
                  <h3
                    className={`${styles.h4} !text-black hover:text-[#6EBB2D] transition-colors`}
                  >
                    {item.title}
                  </h3>
                </Link>
                <p className={`${styles.span} mb-5`}>
                  {item.content.slice(0, 200)}
                </p>
              </div>
              <Link
                href={`/blogs/${item.slug}`}
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

export default Blogs;
