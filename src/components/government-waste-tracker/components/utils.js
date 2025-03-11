// Format number to Colombian Peso
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00-05:00');
  const month = date.toLocaleDateString('es-CO', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Calculate days since government started
export const calculateDaysSince = (startDate = '2022-08-07') => {
  const governmentStartDate = new Date(startDate);
  const today = new Date();
  return Math.floor((today - governmentStartDate) / (1000 * 60 * 60 * 24));
};
