// Utility function to construct full image URLs
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder-tour.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, construct the full URL
  if (imagePath.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${imagePath}`;
  }
  
  // If it's just a filename, construct the full path
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/uploads/tours/${imagePath}`;
};

// Utility function to get image URL with fallback (for single image fields)
export const getSingleImageUrl = (image: string | undefined): string => {
  if (!image) return '/placeholder-tour.svg';
  return getImageUrl(image);
};

// Utility function to get the first image URL from an array
export const getFirstImageUrl = (images: string[] | undefined): string => {
  if (!images || images.length === 0) {
    return '/placeholder-tour.svg';
  }
  return getImageUrl(images[0]);
};
