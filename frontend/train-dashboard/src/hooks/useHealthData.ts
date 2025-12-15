import useSWR from 'swr';
import { axiosInstance } from '@/lib/api';
import { HealthResponse } from '@/types';

const fetcher = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.warn('Health API call failed, using mock data');
    throw error;
  }
};

export const useHealthData = (refreshInterval = 60000) => { // Changed to 60 seconds to avoid conflicts with optimization engine
  const { data, error, mutate, isLoading } = useSWR<HealthResponse>(
    '/health',
    fetcher,
    {
      refreshInterval,
      fallbackData: undefined,
      onError: (err: any) => {
        console.warn('Health data fetch failed:', err.message);
      },
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Defensively construct safe defaults when fields are missing
  const safeData: HealthResponse = {
    status: data?.status ?? 'unknown',
    timestamp: data?.timestamp ?? new Date().toISOString(),
    total_trains: data?.total_trains ?? 0,
    active_trains: data?.active_trains ?? 0,
    active_disruptions: data?.active_disruptions ?? 0,
    disrupted_sections: Array.isArray(data?.disrupted_sections) ? (data!.disrupted_sections as string[]) : [],
  };

  return {
    healthData: safeData,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useHealthData;