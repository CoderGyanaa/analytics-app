import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Generic fetch hook
export const useFetch = (endpoint, params = {}, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.get(endpoint, { params });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(params), ...deps]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// KPI hook with date filters
export const useKPIs = (dateRange) => {
  return useFetch('/analytics/kpis', dateRange, [JSON.stringify(dateRange)]);
};

// Revenue trend hook
export const useRevenueTrend = (dateRange, groupBy) => {
  return useFetch('/analytics/revenue-trend', { ...dateRange, groupBy }, [JSON.stringify(dateRange), groupBy]);
};

// Category hook
export const useCategoryBreakdown = (dateRange) => {
  return useFetch('/analytics/category-breakdown', dateRange, [JSON.stringify(dateRange)]);
};
