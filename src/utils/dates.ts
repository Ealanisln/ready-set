/**
 * Generates promotion dates based on the current date
 * @returns An object with formatted start and end dates for promotions
 */
export function getPromotionDates(): {
  startDate: string;
  endDate: string;
  formattedDisplay: string;
} {
  const today = new Date();
  
  // Set start date to the 1st of current month
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Set end date to the last day of current month
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  // Format dates for display
  const formatOptions: Intl.DateTimeFormatOptions = { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  };
  
  const startFormatted = startDate.toLocaleDateString('en-US', formatOptions);
  const endFormatted = endDate.toLocaleDateString('en-US', formatOptions);
  
  // Create a formatted display string (e.g., "March 1 to 31, 2025")
  const formattedDisplay = `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()} to ${endDate.getDate()}, ${endDate.getFullYear()}`;
  
  return {
    startDate: startFormatted,
    endDate: endFormatted,
    formattedDisplay
  };
} 