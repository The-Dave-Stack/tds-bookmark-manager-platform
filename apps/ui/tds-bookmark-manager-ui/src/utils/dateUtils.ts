export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDateRange = (preset: string) => {
  const end = new Date();
  const start = new Date();
  
  switch (preset) {
    case 'lastHour':
      start.setHours(end.getHours() - 1);
      break;
    case 'last3Hours':
      start.setHours(end.getHours() - 3);
      break;
    case 'last6Hours':
      start.setHours(end.getHours() - 6);
      break;
    case 'last24Hours':
      start.setDate(end.getDate() - 1);
      break;
    default:
      start.setDate(end.getDate() - 1);
  }
  
  return { start, end };
};

export const isWithinRange = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end;
};