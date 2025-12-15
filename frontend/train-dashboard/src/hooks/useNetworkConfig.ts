'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/api';

export interface NetworkSection {
  id: string;
  start: string;
  end: string;
  length_km: number;
  capacity: number;
  max_speed_kmh: number;
  track_type: string;
}

export interface NetworkConfig {
  stations: string[];
  sections: NetworkSection[];
  timestamp?: string;
}

export const useNetworkConfig = () => {
  const [data, setData] = useState<NetworkConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    axiosInstance
      .get('/api/network-config')
      .then((res) => {
        if (!active) return;
        setData(res.data as NetworkConfig);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.detail || err.message || 'Failed to load network config');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
};
