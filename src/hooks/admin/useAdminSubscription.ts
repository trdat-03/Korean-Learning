import { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '@/services/system/subscriptionService';
import { useStatistics } from '@/hooks/statistics/useStatistics';
import type { PendingTransaction } from '@/types/subscription';

interface UseAdminSubscriptionOptions {
  autoLoad?: boolean;
}

export const useAdminSubscription = (options: UseAdminSubscriptionOptions = {}) => {
  const { autoLoad = true } = options;
  
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<PendingTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Use the existing statistics hook
  const {
    currentMonthStats,
    currentYearStats,
    customStats,
    loading: statsLoading,
    error: statsError,
    fetchCurrentMonthStats,
    fetchCurrentYearStats,
    fetchCustomStats,
    clearError: clearStatsError,
  } = useStatistics();

  const fetchPendingTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await subscriptionService.getPendingTransactions();
      setPendingTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách giao dịch đang chờ');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await subscriptionService.getAllTransactions();
      setAllTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách tất cả giao dịch');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactionsByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await subscriptionService.getTransactionsByDateRange(startDate.toISOString(), endDate.toISOString());
      setAllTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải giao dịch theo khoảng thời gian');
    } finally {
      setLoading(false);
    }
  }, []);

  const approveTransaction = useCallback(async (transactionId: number) => {
    try {
      setProcessingId(transactionId);
      setError(null);
      setSuccess(null);
      
      const response = await subscriptionService.adminConfirmPayment(transactionId, {
        approved: true
      });

      if (response.success) {
        setSuccess('Giao dịch đã được duyệt thành công');
        // Refresh transactions
        await Promise.all([
          fetchPendingTransactions(),
          fetchAllTransactions()
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể duyệt giao dịch');
    } finally {
      setProcessingId(undefined);
    }
  }, [fetchPendingTransactions, fetchAllTransactions]);

  const rejectTransaction = useCallback(async (transactionId: number) => {
    try {
      setProcessingId(transactionId);
      setError(null);
      setSuccess(null);
      
      const response = await subscriptionService.adminConfirmPayment(transactionId, {
        approved: false
      });

      if (response.success) {
        setSuccess('Giao dịch đã bị từ chối');
        // Refresh transactions
        await Promise.all([
          fetchPendingTransactions(),
          fetchAllTransactions()
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể từ chối giao dịch');
    } finally {
      setProcessingId(undefined);
    }
  }, [fetchPendingTransactions, fetchAllTransactions]);

  const refreshTransactions = useCallback(async (activeTab: string) => {
    setError(null);
    setSuccess(null);
    
    if (activeTab === 'pending') {
      await fetchPendingTransactions();
    } else if (activeTab === 'all') {
      await fetchAllTransactions();
    }
  }, [fetchPendingTransactions, fetchAllTransactions]);

  // Auto-load pending transactions on mount
  useEffect(() => {
    if (autoLoad) {
      fetchPendingTransactions();
    }
  }, [autoLoad, fetchPendingTransactions]);

  return {
    // Transaction data
    pendingTransactions,
    allTransactions,
    loading,
    processingId,
    error,
    success,
    
    // Statistics data (from useStatistics hook)
    currentMonthStats,
    currentYearStats,
    customStats,
    statsLoading,
    statsError,
    
    // Transaction actions
    fetchPendingTransactions,
    fetchAllTransactions,
    fetchTransactionsByDateRange,
    approveTransaction,
    rejectTransaction,
    refreshTransactions,
    
    // Statistics actions
    fetchCurrentMonthStats,
    fetchCurrentYearStats,
    fetchCustomStats,
    
    // Utilities
    clearError: () => {
      setError(null);
      setSuccess(null);
    },
    clearStatsError,
    clearSuccess: () => setSuccess(null),
  };
};
