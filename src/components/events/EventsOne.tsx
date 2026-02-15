"use client";

import { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";
import { styles } from "@/styles/styles";
import { Eye, Clock, CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { EventsProps } from "@/interfaces/events.interface";

type Props = {
  data: EventsProps;
};

const EventOne = ({ data }: Props) => {
  const [cleanHtml, setCleanHtml] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);

  const t = useTranslations("events");
  const locale = useLocale();

  // Ketma-ket kelgan img taglarni gorizontal qilish uchun funktsiya
  const processImagesForHorizontalLayout = (html: string): string => {
    // Regex bilan ketma-ket kelgan img taglarni topish
    // </p>\s*<img - paragrafdan keyin kelgan rasm
    // <img[^>]*>\s*<img - rasmdan keyin yana rasm
    const imgPattern = /(<img[^>]*>\s*)+/g;

    return html.replace(imgPattern, (match) => {
      // Har bir img tagni alohida olish
      const images = match.match(/<img[^>]*>/g);
      if (!images || images.length < 2) {
        return match; // Agar faqat 1 ta rasm bo'lsa, o'zgartirmaslik
      }

      // Gorizontal grid yaratish
      return `
        <div class="image-gallery-horizontal">
          ${images.join("\n")}
        </div>
      `;
    });
  };

  // Hydration error ni oldini olish uchun useEffect ichida tozalash
  useEffect(() => {
    const sanitized = sanitizeHtml(data.content, {
      allowedTags: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "br",
        "strong",
        "em",
        "b",
        "i",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "div",
        "span",
        "blockquote",
        "iframe",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
      ],
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        "*": ["class", "style", "title"],
        a: ["href", "target", "name"],
        img: ["src", "alt", "width", "height"],
        iframe: [
          "src",
          "width",
          "height",
          "frameborder",
          "allow",
          "allowfullscreen",
          "scrolling",
        ],
      },
    });

    // Minimal base styling qo'shish
    let styledHtml = sanitized
      .replace(
        /(?:<p[^>]*>\s*)?(https:\/\/www\.google\.com\/maps\/d\/embed\?mid=[^"'\s<]+)(?:\s*<\/p>)?/g,
        (match, url) =>
          `<div class="flex justify-center w-full my-4"><iframe src="${url}" width="100%" height="450" style="border: 0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map Link"></iframe></div>`,
      )
      .replace(
        /<h3/g,
        '<h3 class="text-xl md:text-2xl font-semibold mt-6 mb-2 text-gray-800"',
      )
      .replace(/<p/g, '<p class="text-gray-700 mb-4"')
      .replace(/<img/g, '<img class="rounded-xl my-3 w-full"') // my-6 -> my-3 qilindi
      .replace(/<ul/g, '<ul class="list-disc pl-5 my-4"')
      .replace(/<ol/g, '<ol class="list-decimal pl-5 my-4"')
      .replace(/<li/g, '<li class="mb-2"')
      .replace(
        /<blockquote/g,
        '<blockquote class="border-l-4 border-emerald-500 pl-4 italic my-6"',
      )
      .replace(/<a/g, '<a class="text-emerald-600 hover:underline"');

    // Ketma-ket kelgan rasmlarni gorizontal qilish
    styledHtml = processImagesForHorizontalLayout(styledHtml);

    setCleanHtml(styledHtml);
  }, [data.content]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!isClient) {
    // Server-side render uchun faqat asosiy ma'lumotlarni chiqaramiz
    return (
      <article className={`${styles.paddingCont} max-w-4xl mx-auto`}>
        {data.featuredImage && (
          <div
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, transparent 70%),url(${data.featuredImage})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            className="w-full mt-16 h-[400px] md:h-[600px] overflow-hidden relative rounded-2xl"
          >
            <div className="absolute w-full md:w-[80%] md:space-y-4 space-y-2 bottom-0 left-1/2 -translate-x-1/2 p-2 md:pb-10">
              <h2 className={`${styles.h2} text-center text-white`}>
                {data.title}
              </h2>

              <div
                className={`${styles.flexCenter} flex-wrap w-full gap-2 sm:gap-4`}
              >
                <span className="flex items-center gap-2 text-white">
                  <CalendarDays size={16} />
                  <span>{formatDate(data.publishedAt)}</span>
                </span>

                <span className="flex items-center gap-2 text-white">
                  <Clock size={16} />
                  <span>
                    {data.readTime || 5} {t("read")}
                  </span>
                </span>

                <span className="flex items-center gap-2 text-white">
                  <Eye size={16} />
                  <span>
                    {data.viewsCount || 0} {t("view")}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }

  return (
    <article>
      <div className={`${styles.paddingCont}`}>
        {/* Featured Image */}
        {data.featuredImage && (
          <div
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, transparent 70%),url(${data.featuredImage})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            className="w-full mt-16 h-[400px] md:h-[600px] overflow-hidden relative rounded-2xl"
          >
            <div className="absolute w-full md:w-[80%] md:space-y-4 space-y-2 bottom-0 left-1/2 -translate-x-1/2 p-2 md:pb-10">
              <h2 className={`${styles.h2} text-center text-white`}>
                {data.title}
              </h2>

              <div
                className={`${styles.flexCenter} flex-wrap w-full gap-2 sm:gap-4`}
              >
                <span className="flex items-center gap-2 text-white">
                  <CalendarDays size={16} />
                  <span>{formatDate(data.publishedAt)}</span>
                </span>
                <span className="w-[2px] bg-white h-4"></span>
                <span className="flex items-center gap-2 text-white">
                  <Clock size={16} />
                  <span>
                    {data.readTime || 5} {t("read")}
                  </span>
                </span>
                <span className="w-[2px] bg-white h-4"></span>
                <span className="flex items-center gap-2 text-white">
                  <Eye size={16} />
                  <span>
                    {data.viewsCount || 0} {t("view")}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Event Content */}
        {cleanHtml && (
          <div className="blog-content-container">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />

            <style jsx global>{`
              .blog-content-container {
                font-size: 1.125rem;
                line-height: 1.7;
                color: #374151;
              }

              .blog-content h1,
              .blog-content h2,
              .blog-content h3,
              .blog-content h4 {
                color: #111827;
                font-weight: 700;
                margin-top: 2em;
                margin-bottom: 0.5em;
                line-height: 1.3;
              }

              .blog-content h1 {
                font-size: 2.25rem;
                margin-top: 0;
              }

              .blog-content h2 {
                font-size: 1.875rem;
              }

              .blog-content h3 {
                font-size: 1.5rem;
              }

              .blog-content h4 {
                font-size: 1.25rem;
              }

              .blog-content p {
                color: #4b5563;
                line-height: 1.8;
                margin-bottom: 1.5em;
              }

              .blog-content a {
                color: #059669;
                text-decoration: underline;
                font-weight: 500;
              }

              .blog-content a:hover {
                color: #047857;
              }

              /* Bitta rasm uchun */
              .blog-content img {
                width: 100%;
                height: auto;
                border-radius: 1rem;
                margin: 1.5em 0;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
              }

              .blog-content img:hover {
                transform: scale(1.01);
              }

              /* Gorizontal image gallery */
              .blog-content .image-gallery-horizontal {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin: 2rem 0;
              }

              .blog-content .image-gallery-horizontal img {
                width: 100%;
                height: 250px;
                object-fit: cover;
                border-radius: 1rem;
                margin: 0;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                transition:
                  transform 0.3s ease,
                  box-shadow 0.3s ease;
              }

              .blog-content .image-gallery-horizontal img:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
              }

              /* 2 ta rasm uchun */
              .blog-content
                .image-gallery-horizontal:has(img:nth-child(2):last-child) {
                grid-template-columns: repeat(2, 1fr);
              }

              /* 3 ta rasm uchun */
              .blog-content
                .image-gallery-horizontal:has(img:nth-child(3):last-child) {
                grid-template-columns: repeat(3, 1fr);
              }

              /* 4 ta va undan ko'p rasm uchun */
              .blog-content
                .image-gallery-horizontal:has(img:nth-child(4):last-child) {
                grid-template-columns: repeat(2, 1fr);
              }

              /* Mobil ekranlar uchun */
              @media (max-width: 768px) {
                .blog-content .image-gallery-horizontal {
                  grid-template-columns: 1fr !important;
                  gap: 1rem;
                }

                .blog-content .image-gallery-horizontal img {
                  height: 200px;
                }

                /* Mobil ekranga 2 ta rasm yonma-yon */
                .blog-content
                  .image-gallery-horizontal:has(img:nth-child(2):last-child) {
                  grid-template-columns: repeat(2, 1fr) !important;
                }

                .blog-content
                  .image-gallery-horizontal:has(img:nth-child(2):last-child)
                  img {
                  height: 180px;
                }
              }

              /* Kichik ekranlar uchun */
              @media (max-width: 480px) {
                .blog-content .image-gallery-horizontal {
                  grid-template-columns: 1fr !important;
                }

                .blog-content
                  .image-gallery-horizontal:has(img:nth-child(2):last-child) {
                  grid-template-columns: 1fr !important;
                }

                .blog-content img {
                  margin: 1em 0;
                }
              }

              .blog-content ul,
              .blog-content ol {
                padding-left: 1.5em;
                margin: 1.5em 0;
              }

              .blog-content li {
                margin: 0.5em 0;
                color: #4b5563;
              }

              .blog-content blockquote {
                border-left: 4px solid #059669;
                padding-left: 1.5em;
                font-style: italic;
                color: #6b7280;
                margin: 2em 0;
                background-color: #f9fafb;
                border-radius: 0 0.5rem 0.5rem 0;
              }

              .blog-content strong {
                color: #111827;
                font-weight: 600;
              }

              .blog-content em {
                font-style: italic;
              }

              .blog-content iframe {
                width: 100%;
                aspect-ratio: 16/9;
                border-radius: 1rem;
                margin: 2em 0;
                border: none;
              }
            `}</style>
          </div>
        )}
      </div>
    </article>
  );
};

export default EventOne;
