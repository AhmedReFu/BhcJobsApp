import {useState, useEffect} from 'react';
import {getIndustries, getJobs, getCompanies} from '../services/api';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useFetch = <T>(fetchFn: () => Promise<T>): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {data, loading, error, refetch: load};
};

export const useIndustries = () => useFetch(getIndustries);
export const useJobs = () => useFetch(getJobs);
export const useCompanies = () => useFetch(getCompanies);
