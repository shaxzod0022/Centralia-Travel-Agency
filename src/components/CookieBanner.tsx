'use client';

import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '@/utils/storageHelper';

import { useParams } from 'next/navigation';

const translations = {
    en: {
        text: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.',
        accept: 'Accept All',
        decline: 'Decline',
        consentText: 'By clicking "Accept All", you consent to our use of cookies.'
    },
    ru: {
        text: 'Мы используем файлы cookie для улучшения вашего опыта просмотра, предоставления персонализированного контента и анализа нашего трафика.',
        accept: 'Принять все',
        decline: 'Отклонить',
        consentText: 'Нажимая "Принять все", вы соглашаетесь на использование нами файлов cookie.'
    },
    ja: {
        text: '当社は、ブラウジング体験の向上、パーソナライズされたコンテンツの提供、およびトラフィック分析のためにCookieを使用します。',
        accept: 'すべて受け入れる',
        decline: '拒否する',
        consentText: '「すべて受け入れる」をクリックすると、Cookieの使用に同意したことになります。'
    },
    es: {
        text: 'Utilizamos cookies para mejorar su experiencia de navegación, ofrecer contenido personalizado y analizar nuestro tráfico.',
        accept: 'Aceptar todo',
        decline: 'Rechazar',
        consentText: 'Al hacer clic en "Aceptar todo", usted acepta nuestro uso de cookies.'
    },
    de: {
        text: 'Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, personalisierte Inhalte bereitzustellen und unseren Datenverkehr zu analysieren.',
        accept: 'Alle akzeptieren',
        decline: 'Ablehnen',
        consentText: 'Indem Sie auf "Alle akzeptieren" klicken, stimmen Sie der Verwendung von Cookies zu.'
    }
};

export default function CookieBanner() {
    const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const t = translations[locale as keyof typeof translations] || translations.en;

    useEffect(() => {
        const storedConsent = getLocalStorage('cookie_consent', null);
        setCookieConsent(storedConsent);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Sync consent with Google Analytics
        if (cookieConsent !== null) {
            const newValue = cookieConsent ? 'granted' : 'denied';

            if (typeof window.gtag !== 'undefined') {
                window.gtag('consent', 'update', {
                    'analytics_storage': newValue,
                    'ad_storage': newValue,
                    'personalization_storage': newValue,
                    'functionality_storage': newValue,
                });
            }
        }
    }, [cookieConsent]);

    const handleAccept = () => {
        setCookieConsent(true);
        setLocalStorage('cookie_consent', true);
    };

    const handleDecline = () => {
        setCookieConsent(false);
        setLocalStorage('cookie_consent', false);
    };

    // Don't render anything while loading or if consent is already set
    if (isLoading || cookieConsent !== null) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 md:p-6 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 transform translate-y-0 text-sm md:text-base">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
                <div className="text-gray-700 leading-relaxed max-w-3xl text-center md:text-left">
                    <p>
                        {t.text}
                        {' '}
                        {t.consentText.split('"').map((part, index) =>
                            index % 2 === 1 ? <span key={index} className="font-semibold text-[#056D50]">"{part}"</span> : part
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                    <button
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-4 py-2 md:px-6 md:py-2.5 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-3xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        {t.decline}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-4 py-2 md:px-6 md:py-2.5 font-bold text-white bg-[#056D50] hover:bg-[#159571] rounded-3xl shadow-lg shadow-[#056D50]/30 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#056D50]"
                    >
                        {t.accept}
                    </button>
                </div>
            </div>
        </div>
    );
}
