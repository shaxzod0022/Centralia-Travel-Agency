"use client";

import { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";
import { Blog, BlogsData } from "@/interfaces/blog.interface";
import { styles } from "@/styles/styles";
import { Eye, Clock, CalendarDays, Diamond } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { blogsClient } from "@/lib/apolloClient";
import { GET_BLOGBYCATEGORY } from "@/gql/getBlogByCategory";
import Blogs from "./Blogs";
import { Link } from "@/i18n/routing";

type Props = {
  data: Blog;
};

const BlogOne = ({ data }: Props) => {
  const [cleanHtml, setCleanHtml] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);
  const [categoryBlogs, setCategoryBlogs] = useState<Blog[]>([]);

  const t = useTranslations("blogs");
  const locale = useLocale();

  const fetchCategoryBlogs = async () => {
    try {
      const response = await blogsClient.query<BlogsData>({
        query: GET_BLOGBYCATEGORY,
        variables: {
          language: locale,
          categoryId: (data.categories && data.categories[0].id) || 0,
        },
        fetchPolicy: "no-cache",
      });

      if (response.data?.blogs && response.data.blogs.length > 0) {
        const blogs = response.data.blogs.filter((i) => i.slug !== data.slug);
        setCategoryBlogs(blogs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategoryBlogs();
  }, [data]);

  // Ketma-ket kelgan img taglarni gorizontal qilish uchun funktsiya
  const processImagesForHorizontalLayout = (html: string): string => {
    /**
     * Bu regex:
     * - Faqatgina <img> taglaridan iborat bloklarni ushlaydi
     * - Orasida text, <p>, <span>, <strong> va h.k. bo'lmasligi shart
     */
    const imageBlockRegex = /(?:\s*(?:<img[^>]*>\s*))+/g;
    return html.replace(imageBlockRegex, (block) => {
      const images = block.match(/<img[^>]*>/g);

      // 1 ta rasm bo‘lsa → centeralangan wrapper
      if (!images || images.length < 2) {
        return `<div class="single-image-container flex justify-center w-full">${block}</div>`;
      }

      // Agar img lar orasida text bo‘lsa → oddiy holat
      const textBetweenImages = block.replace(/<img[^>]*>/g, "").trim();
      if (textBetweenImages.length > 0) {
        return block;
      }

      // Ketma-ket kelgan img lar → gallery
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
      transformTags: {
        a: (tagName, attribs) => {
          if (
            attribs.href &&
            attribs.href.includes("google.com/maps/d/embed")
          ) {
            return {
              tagName: "iframe",
              attribs: {
                src: attribs.href,
                width: "100%",
                height: "450",
                style: "border: 0",
                allowfullscreen: "true",
                loading: "lazy",
                referrerpolicy: "no-referrer-when-downgrade",
                title: "Map Link",
              },
            };
          }
          return { tagName: "a", attribs };
        },
      },
    });

    // 1. <p> ichidagi <img> larni tashqariga chiqarish (Grouping to'g'ri ishlashi uchun)
    // Regex: <p ...> <img ...> </p>
    let preparedHtml = sanitized
      .replace(/<p[^>]*>\s*(<img[^>]+>)\s*<\/p>/gi, "$1")
      // Plain text URL handling (only if in its own paragraph)
      .replace(
        /<p[^>]*>\s*(https:\/\/www\.google\.com\/maps\/d\/embed\?mid=[^<]+)\s*<\/p>/gi,
        (match, url) =>
          `<div class="flex justify-center w-full my-4"><iframe src="${url}" width="100%" height="450" style="border: 0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map Link"></iframe></div>`,
      )
      // Unwrap iframes created by transformTags from p tags
      .replace(
        /<p[^>]*>\s*(<iframe[^>]*title="Map Link"[^>]*><\/iframe>)\s*<\/p>/gi,
        '<div class="flex justify-center w-full my-4">$1</div>',
      );

    // Minimal base styling qo'shish
    let styledHtml = preparedHtml
      .replace(
        /<h3/g,
        '<h3 class="text-xl md:text-2xl font-semibold mt-6 mb-2 text-gray-800"',
      )
      .replace(/<p/g, '<p class="text-gray-700 mb-4"')
      .replace(/<img/g, '<img class="blog-image"')
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
            <div className="absolute w-full md:w-[80%] md:space-y-2 bottom-0 left-1/2 -translate-x-1/2 p-2 md:pb-10">
              {data.categories && data.categories.length !== 0 && (
                <ul className={`${styles.flexCenter} lg:gap-4 gap-2 w-full`}>
                  {data.categories.map((i, idx) => (
                    <li key={idx} className="flex items-center gap-1 sm:gap-2">
                      <Link
                        className="hover:text-[#6EBB2D] transition-colors text-white"
                        href={`/blogs/category/${i.id}`}
                      >
                        <span className="text-sm sm:text-md">{i.name}</span>
                      </Link>
                      {data.categories &&
                        idx !== data.categories.length - 1 && (
                          <Diamond className="text-white" size={10} />
                        )}
                    </li>
                  ))}
                </ul>
              )}

              <h2 className={`${styles.h2} text-center text-white`}>
                {data.title}
              </h2>

              <div
                className={`${styles.flexCenter} flex-wrap w-full gap-2 sm:gap-4`}
              >
                <span className="flex items-center gap-3">
                  <span className={`${styles.p} !text-white`}>
                    {t("writer")}
                  </span>
                  <span className={`${styles.p} !text-white`}>
                    {data.author
                      ? data.author.name
                      : data.authorName
                        ? data.authorName
                        : t("author")}
                  </span>
                </span>

                <span className="flex items-center gap-2 text-white">
                  <CalendarDays size={16} />
                  <span>{formatDate(data.publishedAt)}</span>
                </span>

                <span className="flex items-center gap-2 text-white">
                  <Clock size={16} />
                  <span>
                    {data.readingTime || 5} {t("min")}
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
            <div className="absolute w-full md:w-[80%] md:space-y-2 bottom-0 left-1/2 -translate-x-1/2 p-2 md:pb-10">
              {data.categories && data.categories.length !== 0 && (
                <ul className={`${styles.flexCenter} gap-1 sm:gap-2 w-full`}>
                  {data.categories.map((i, idx) => (
                    <li key={idx} className="flex items-center gap-1 sm:gap-2">
                      <Link
                        className="hover:text-[#6EBB2D] transition-colors text-white"
                        href={`/blogs/category/${i.id}`}
                      >
                        <span className="text-sm sm:text-md">{i.name}</span>
                      </Link>
                      {data.categories &&
                        idx !== data.categories.length - 1 && (
                          <Diamond className="text-white" size={10} />
                        )}
                    </li>
                  ))}
                </ul>
              )}

              <h2 className={`${styles.h2} text-center text-white`}>
                {data.title}
              </h2>

              <div
                className={`${styles.flexCenter} flex-wrap w-full gap-2 sm:gap-4`}
              >
                <span className="flex items-center gap-3">
                  <span className={`${styles.p} !text-white`}>
                    {t("writer")}
                  </span>
                  <span className={`${styles.p} !text-white`}>
                    {data.author
                      ? data.author.name
                      : data.authorName
                        ? data.authorName
                        : t("author")}
                  </span>
                </span>
                <span className="w-[2px] bg-white h-4"></span>
                <span className="flex items-center gap-2 text-white">
                  <CalendarDays size={16} />
                  <span>{formatDate(data.publishedAt)}</span>
                </span>
                <span className="w-[2px] bg-white h-4"></span>
                <span className="flex items-center gap-2 text-white">
                  <Clock size={16} />
                  <span>
                    {data.readingTime || 5} {t("min")}
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

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Blog Content */}
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

              /* ================= HEADINGS ================= */
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

              /* ================= TEXT ================= */
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

              /* ================= SINGLE IMAGE (qutisi) ================= */
              .blog-content .single-image-container {
                display: flex;
                justify-content: center;
                width: 100%;
                margin: 1.5em 0;
              }

              /* ================= SINGLE IMAGE (matn bilan) ================= */
              .blog-content img.blog-image {
                width: auto;
                max-width: 100%;
                max-height: 550px;
                object-fit: contain;
                border-radius: 1rem;
                margin: 0; /* Margin handled by container */
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
                display: block;
              }

              .blog-content img.blog-image:hover {
                transform: scale(1.01);
              }

              /* ================= IMAGE GALLERY (ketma-ket img) ================= */
              .blog-content .image-gallery-horizontal {
                display: grid;
                gap: 1.5rem;
                margin: 2rem 0;
              }

              /* Desktop default */
              @media (min-width: 769px) {
                .blog-content .image-gallery-horizontal {
                  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                }
              }

              .blog-content .image-gallery-horizontal img {
                width: 100%;
                height: 260px;
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

              /* ================= MOBILE ================= */
              @media (max-width: 768px) {
                .blog-content .image-gallery-horizontal {
                  grid-template-columns: 1fr;
                  gap: 1rem;
                }

                .blog-content .image-gallery-horizontal img {
                  height: auto;
                }
              }

              /* ================= LISTS ================= */
              .blog-content ul,
              .blog-content ol {
                padding-left: 1.5em;
                margin: 1.5em 0;
              }

              .blog-content li {
                margin: 0.5em 0;
                color: #4b5563;
              }

              /* ================= BLOCKQUOTE ================= */
              .blog-content blockquote {
                border-left: 4px solid #059669;
                padding-left: 1.5em;
                font-style: italic;
                color: #6b7280;
                margin: 2em 0;
                background-color: #f9fafb;
                border-radius: 0 0.5rem 0.5rem 0;
              }

              /* ================= INLINE ================= */
              .blog-content strong {
                color: #111827;
                font-weight: 600;
              }

              .blog-content em {
                font-style: italic;
              }

              /* ================= IFRAME ================= */
              .blog-content iframe {
                width: 100%;
                aspect-ratio: 16 / 9;
                border-radius: 1rem;
                margin: 2em 0;
                border: none;
              }
            `}</style>
          </div>
        )}
      </div>
      {categoryBlogs.length !== 0 ? (
        <>
          <h2 className={`${styles.h2} text-[#056D50] text-center`}>
            {t("like")}
          </h2>
          <Blogs data={categoryBlogs} />
        </>
      ) : null}
    </article>
  );
};

export default BlogOne;
