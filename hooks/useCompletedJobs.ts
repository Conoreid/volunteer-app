import { useEffect, useState } from 'react';
import { type CompletedJobItem } from '@/types';
import { subscribeCompletedJobs } from '@/services/markerService';

export function useCompletedJobs() {
  const [data, setData] = useState<CompletedJobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeCompletedJobs(
      (jobs) => {
        setData(jobs);
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
