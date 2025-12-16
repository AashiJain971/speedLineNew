import useSWR from 'swr';
import { axiosInstance } from '../lib/api';
import { TrainBundle } from '../types';
import { TrainSnapshot } from '../types/train-snapshot';

const fetcher = async (url: string) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.data;
  } catch (error) {
    console.warn('Train data API call failed');
    throw error;
  }
};

export const useTrainData = (refreshInterval = 1000) => { // 1s polling for smooth movement
  const { data, error, mutate, isLoading } = useSWR<TrainSnapshot>(
    '/api/train-data',
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshWhenHidden: true,
      revalidateIfStale: true,
      dedupingInterval: 0,
      keepPreviousData: true,
      onSuccess: () => {},
      onError: (err) => {
        console.warn('Train data fetch failed:', err.message);
      },
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    trainData: data?.payload || [],
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useTrainData;