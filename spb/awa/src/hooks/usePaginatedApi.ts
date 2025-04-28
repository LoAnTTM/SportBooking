import { useState, useEffect } from 'react';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../services/api/types';

interface UsePaginatedApiOptions<T> {
  onSuccess?: (data: PaginatedResponse<T>) => void;
  onError?: (error: string) => void;
  dependencies?: any[];
  skip?: boolean;
}

export function usePaginatedApi<T>(
  apiFunction: (params: PaginationParams) => Promise<ApiResponse<PaginatedResponse<T>>>,
  initialParams: PaginationParams = { i: 10, p: 1 },
  options: UsePaginatedApiOptions<T> = {}
) {
  const [params, setParams] = useState<PaginationParams>(initialParams);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);
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
        const response = await apiFunction(params);
        
        if (response.success && response.data) {
          setData(response.data.items);
          setTotal(response.data.total);
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
  }, [params, ...dependencies, skip]);

  const updateParams = (newParams: Partial<PaginationParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  return { data, total, loading, error, params, updateParams };
}
