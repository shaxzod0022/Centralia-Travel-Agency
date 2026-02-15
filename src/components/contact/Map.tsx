"use client";

import { useLocale } from "next-intl";

const Map = () => {
  const locale = useLocale();
  return (
    <div>
      <iframe
        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11714569.588920342!2d63.51206790889091!3d41.364484931938236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1s${locale}!2s!4v1769086927704!5m2!1s${locale}!2s`}
        width="100%"
        height="450"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
