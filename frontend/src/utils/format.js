// Format currency
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
};

// Format number with K/M suffix
export const formatNumber = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value?.toLocaleString() || '0';
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

// Format percentage
export const formatPercent = (value) => `${parseFloat(value || 0).toFixed(1)}%`;

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Date range presets
export const getDateRange = (preset) => {
  const now = new Date();
  const startDate = new Date();

  switch (preset) {
    case '7d': startDate.setDate(now.getDate() - 7); break;
    case '30d': startDate.setDate(now.getDate() - 30); break;
    case '90d': startDate.setDate(now.getDate() - 90); break;
    case '1y': startDate.setFullYear(now.getFullYear() - 1); break;
    default: startDate.setDate(now.getDate() - 30);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: now.toISOString().split('T')[0]
  };
};

// Chart color palette
export const CHART_COLORS = [
  '#63b3ed', '#b794f4', '#48bb78', '#f6ad55',
  '#fc8181', '#76e4f7', '#ffd700', '#ff8c69'
];
