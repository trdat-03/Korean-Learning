import { useState, useCallback } from 'react';
import { statisticsService } from '@/services/features/statisticsService';
import type { TransactionStatistics } from '@/types/statistics';

export const useStatistics = () => {
  const [currentMonthStats, setCurrentMonthStats] = useState<TransactionStatistics | null>(null);
  const [currentYearStats, setCurrentYearStats] = useState<TransactionStatistics | null>(null);
  const [customStats, setCustomStats] = useState<TransactionStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current month statistics
  const fetchCurrentMonthStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsService.getCurrentMonthStatistics();
      setCurrentMonthStats(data);
      return data;
    } catch (err) {
      const errorMessage = 'Không thể tải thống kê tháng hiện tại';
      setError(errorMessage);
      console.error('Error fetching current month statistics:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current year statistics
  const fetchCurrentYearStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsService.getCurrentYearStatistics();
      setCurrentYearStats(data);
      return data;
    } catch (err) {
      const errorMessage = 'Không thể tải thống kê năm hiện tại';
      setError(errorMessage);
      console.error('Error fetching current year statistics:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch custom period statistics
  const fetchCustomStats = useCallback(async (start: string, end: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsService.getCustomStatistics(start, end);
      setCustomStats(data);
      return data;
    } catch (err) {
      const errorMessage = 'Không thể tải thống kê theo khoảng thời gian tùy chọn';
      setError(errorMessage);
      console.error('Error fetching custom statistics:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear all statistics
  const clearStats = useCallback(() => {
    setCurrentMonthStats(null);
    setCurrentYearStats(null);
    setCustomStats(null);
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    currentMonthStats,
    currentYearStats,
    customStats,
    loading,
    error,

    // Actions
    fetchCurrentMonthStats,
    fetchCurrentYearStats,
    fetchCustomStats,
    clearStats,
    clearError,
  };
};
