export const getStatusColor = (daysLeft: number) => {
  if (daysLeft <= 7) return '#FF3B30'; // red
  if (daysLeft <= 30) return '#FF9500'; // orange
  return '#39FF14'; // neon green
};

export const getProgressPercentage = (visa: any) => {
  const totalDays = visa.duration;
  const daysUsed = totalDays - visa.daysLeft;
  return Math.max(0, Math.min(100, (daysUsed / totalDays) * 100));
};

export const getExtensionDeadline = (visa: any) => {
  if (visa.extensions_available === 0) return null;
  const exitDate = new Date(visa.exit_date);
  exitDate.setDate(exitDate.getDate() - 7); // 7 days before expiry for Indonesia B211A
  return exitDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};