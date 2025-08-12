// Utility functions for the personal finance tracker

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getCurrentMonthName = () => {
  return new Date().toLocaleString('default', { month: 'long' });
};
