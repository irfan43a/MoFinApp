// Utility formatters for Movie Finder

export const formatRating = (rating) => {
  if (rating === undefined || rating === null) return 'N/A';
  return Number(rating).toFixed(1);
};

export const formatDate = (dateString, locale = 'id-ID') => {
  if (!dateString) return 'TBA';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatYear = (dateString) => {
  if (!dateString) return '';
  return dateString.split('-')[0] || '';
};

export const formatRuntime = (minutes) => {
  if (!minutes || minutes <= 0) return 'TBA';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}j ${mins > 0 ? `${mins}m` : ''}`.trim();
};

export const formatCurrency = (amount) => {
  if (!amount || amount <= 0) return 'Tidak Diketahui';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};
