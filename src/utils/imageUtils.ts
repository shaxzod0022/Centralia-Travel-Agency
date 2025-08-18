// Utility function to construct full image URLs
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder-tour.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, construct the full URL
  if (imagePath.startsWith('/')) {
    return `https://centralia-travel-agency-back.onrender.com${imagePath}`;
  }
  
  // If it's just a filename, construct the full path
  return `https://centralia-travel-agency-back.onrender.com/uploads/tours/${imagePath}`;
};

// Utility function to get the first image URL from an array
export const getFirstImageUrl = (images: string[] | undefined): string => {
  if (!images || images.length === 0) {
    return '/placeholder-tour.svg';
  }
  return getImageUrl(images[0]);
};
