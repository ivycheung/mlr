import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface UseAxiosResponse<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

const useAxios = <T>(axiosParams: AxiosRequestConfig): UseAxiosResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(axiosParams);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosParams]);

  return { data, loading, error };
};

export default useAxios;