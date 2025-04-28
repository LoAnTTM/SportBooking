import { useState, useEffect } from 'react';
import { ApiResponse } from '../services/api/types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  dependencies?: any[];
  skip?: boolean;
}

export function useApi<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!options.skip);
  const [error, setError] = useState<string | null>(null);
  const { onSuccess, onError, dependencies = [], skip = false } = options;

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiFunction();
        
        if (response.success && response.data) {
          setData(response.data);
          setError(null);
          if (onSuccess) {
            onSuccess(response.data);
          }
        } else {
          const errorMessage = response.error || 'Failed to fetch data';
          setError(errorMessage);
          if (onError) {
            onError(errorMessage);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, skip]);

  return { data, loading, error };
}
