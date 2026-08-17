import { Conditions, type MarkerData } from '@/types';

export const getPriority = (data: Conditions) => {
  const n = Object.values(data).filter((c, i) => c).length;

  if (n === 3) return 'high';
  if (n === 2) return 'medium';
  return 'low';
};

export const getTime = (data: MarkerData) => {
  const now = Date.now();
  const diffSeconds = Math.floor((now - data.time.getTime()) / 1000);

  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  if (hours > 0) {
    return hours > 3
      ? `${hours} hour${hours > 1 ? 's' : ''}`
      : `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} min${minutes !== 1 ? 's' : ''}`;
  }

  return `${minutes} min${minutes !== 1 ? 's' : ''}`;
};
