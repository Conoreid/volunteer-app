import { useEffect, useState } from 'react';
import { type MarkerData } from '@/types';
import { subscribeMarkers } from '@/services/markerService';

export function useMarkers() {
  const [data, setData] = useState<MarkerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeMarkers(
      (markers) => {
        setData(markers);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { data, isLoading, error };
}
