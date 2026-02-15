// lib/seo/buildAlternates.ts
export function buildAlternates(locale: string, path: string) {
  const baseUrl = 'https://www.centraliatours.com';

  // URL ni tozalash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Canonical URL
  const canonical = `${baseUrl}/${locale}${cleanPath}`;

  // Ko'p tillik URL'lar
  const languages = {
    en: `${baseUrl}/en${cleanPath}`,
    ru: `${baseUrl}/ru${cleanPath}`,
    es: `${baseUrl}/es${cleanPath}`,
    ja: `${baseUrl}/ja${cleanPath}`,
    de: `${baseUrl}/de${cleanPath}`,
    "x-default": `${baseUrl}/en${cleanPath}`,
  };

  return { canonical, languages };
}

export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';

  try {
    // Localhost manzillarini production manziliga almashtirish (www. bilan)
    let cleanedUrl = url.replace(/http:\/\/localhost:\d+/g, 'https://www.centraliatours.com');

    // www. ni qo'shish yoki normalize qilish (www. bo'lmasa qo'shish)
    cleanedUrl = cleanedUrl.replace(/https?:\/\/(www\.)?centraliatours\.com/g, 'https://www.centraliatours.com');

    // URL formatini tekshirish
    const urlObj = new URL(cleanedUrl);
    return urlObj.toString();
  } catch (error) {
    console.error('Error sanitizing URL:', error);
    return '';
  }
}