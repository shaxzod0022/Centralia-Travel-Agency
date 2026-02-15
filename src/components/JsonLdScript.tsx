// components/JsonLdScript.tsx
"use client";

import { useEffect, useRef } from 'react';

interface JsonLdScriptProps {
  structuredData: any;
}

const JSON_LD_SCRIPT_ID = 'json-ld-structured-data';

export default function JsonLdScript({ structuredData }: JsonLdScriptProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!structuredData) return;

    try {
      // Avvalgi scriptni xavfsiz o'chirish
      const existingScript = document.getElementById(JSON_LD_SCRIPT_ID);
      if (existingScript && existingScript.parentNode) {
        existingScript.remove();
      }

      // Yangi script yaratish
      const script = document.createElement('script');
      script.id = JSON_LD_SCRIPT_ID;
      script.type = 'application/ld+json';
      
      // XSS himoyasi: < belgilarini almashtirish
      const sanitizedData = JSON.stringify(structuredData).replace(/</g, '\\u003c');
      script.text = sanitizedData;
      
      document.head.appendChild(script);
      scriptRef.current = script;
    } catch (error) {
      console.warn('JsonLdScript error:', error);
    }

    // Cleanup
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        try {
          scriptRef.current.remove();
        } catch (error) {
          console.warn('Cleanup error:', error);
        }
      }
    };
  }, [structuredData]);

  return null;
}