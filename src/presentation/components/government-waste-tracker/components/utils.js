// Format number to Colombian Peso
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get a human-readable description of the amount
export const getAmountDescription = (amount) => {
  // For amounts in trillions (billones in Spanish)
  if (amount >= 1_000_000_000_000) {
    const trillions = amount / 1_000_000_000_000;
    const roundedTrillions = Math.floor(trillions);
    
    // Handle "casi" case (when close to the next integer)
    if (trillions - roundedTrillions > 0.7) {
      return `casi ${roundedTrillions + 1} ${roundedTrillions + 1 === 1 ? 'billón' : 'billones'} de pesos`;
    }
    
    // Handle regular case
    return `más de ${roundedTrillions} ${roundedTrillions === 1 ? 'billón' : 'billones'} de pesos`;
  }
  
  // For amounts in billions (mil millones in Spanish)
  if (amount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000;
    const roundedBillions = Math.floor(billions);
    
    // Handle "casi" case (when close to the next integer)
    if (billions - roundedBillions > 0.7) {
      return `casi ${roundedBillions + 1} mil ${roundedBillions + 1 === 1 ? 'millón' : 'millones'} de pesos`;
    }
    
    // Handle regular case
    return `más de ${roundedBillions} mil ${roundedBillions === 1 ? 'millón' : 'millones'} de pesos`;
  }
  
  // For amounts in millions
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const roundedMillions = Math.floor(millions);
    
    // Handle "casi" case (when close to the next integer)
    if (millions - roundedMillions > 0.7) {
      return `casi ${roundedMillions + 1} ${roundedMillions + 1 === 1 ? 'millón' : 'millones'} de pesos`;
    }
    
    // Handle regular case
    return `más de ${roundedMillions} ${roundedMillions === 1 ? 'millón' : 'millones'} de pesos`;
  }
  
  return "";
};

// Format date
export const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00-05:00');
  const month = date.toLocaleDateString('es-CO', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

// Calculate days since government started
export const calculateDaysSince = (startDate = '2022-08-07') => {
  const governmentStartDate = new Date(startDate);
  const today = new Date();
  return Math.floor((today - governmentStartDate) / (1000 * 60 * 60 * 24));
};
