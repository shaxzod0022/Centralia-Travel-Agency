"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

type DateProps = {
  date: string; // ISO string: 2025-12-17T20:40:07.631Z
};

export default function FormatDate({ date }: DateProps) {
  const locale = useLocale();
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    setFormatted(
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date))
    );
  }, [date]);

  return <span>{formatted}</span>;
}
