import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '@/services/system/subscriptionService';
import type { SubscriptionPlan, ActiveSubscription, PendingTransaction } from '@/types/subscription';
import type { CreateTransactionResponse } from '@/services/system/subscriptionService';
import { AuthService } from '@/utils/AuthService';

export const useSubscription = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<CreateTransactionResponse | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const userId = AuthService.getUser()?.id;

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);

      let plansData;
      let activeSubData = null;
      let pendingTx: PendingTransaction[] = [];

      try {
        plansData = await subscriptionService.getSubscriptionPlans();
      } catch (planError) {
        console.warn('Using mock data for plans:', planError);
      }

      if (userId) {
        try {
          activeSubData = await subscriptionService.getUserActiveSubscription(userId);
        } catch (subError) {
          console.warn('Using mock subscription data:', subError);
        }

        try {
          pendingTx = await subscriptionService.getUserPendingTransactions(userId);
        } catch (pendingError) {
          console.warn('Using mock pending transactions:', pendingError);
        }
      }

      setPlans(plansData || []);
      setActiveSubscription(activeSubData);
      setPendingTransactions(pendingTx || []);
    } catch (err) {
      setError('Không thể tải thông tin gói subscription.');
      console.error('Error fetching subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectPlan = async (planName: string) => {
    if (!userId) {
      navigate('/login');
      return;
    }

    if (pendingTransactions.length > 0) {
      setError(
        'Bạn đang có giao dịch đang chờ duyệt. Vui lòng đợi admin xác nhận trước khi tạo giao dịch mới.'
      );
      return;
    }

    if (planName === 'FREE') {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await subscriptionService.createSubscription({
        userId,
        subscriptionType: planName
      });

      setPaymentInfo(response);
      setProcessingPlan(planName);
      setShowPaymentDialog(true);
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo thông tin thanh toán. Vui lòng thử lại.');
      console.error('Error creating payment info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setProcessingPlan(null);
    setPaymentInfo(null);
    setShowPaymentDialog(false);
    // Refresh data after successful payment
    fetchSubscriptionData();
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setProcessingPlan(null);
      setPaymentInfo(null);
    }
    setShowPaymentDialog(open);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // Data
    plans,
    activeSubscription,
    pendingTransactions,
    userId,
    
    // States
    loading,
    error,
    processingPlan,
    paymentInfo,
    showPaymentDialog,
    
    // Actions
    handleSelectPlan,
    handlePaymentSuccess,
    handleDialogOpenChange,
    clearError,
    refetch: fetchSubscriptionData,
  };
};
