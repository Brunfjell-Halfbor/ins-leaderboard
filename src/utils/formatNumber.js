export function formatNumber(value) {
  return new Intl.NumberFormat().format(value);
}

export function formatK(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value;
}