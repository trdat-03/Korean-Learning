import api from '../api';
import type { PendingTransaction } from '@/types/subscription';

// Types for subscription
export interface SubscriptionPlan {
  name: string;
  displayName: string;
  durationMonths: number;
  priceVND: number;
  aiUsageLimit: number;
  features: string[];
}

export interface ActiveSubscription {
  hasActiveSubscription: boolean;
  subscriptionType: string;
  startDate: string;
  endDate: string;
  isValid: boolean;
}

export interface CreateTransactionRequest {
  userId: number;
  subscriptionType: string;
}

export interface CreateTransactionResponse {
  success: boolean;
  transactionId: number;
  amount: number;
  transferCode: string;
  qrCodeData: string;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    note: string;
  };
}

export interface ConfirmPaymentRequest {
  transactionId: number;
  transferCode: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
}

export interface AdminConfirmPaymentRequest {
  approved: boolean;
}

export interface AdminConfirmPaymentResponse {
  success: boolean;
  message: string;
}

export const subscriptionService = {
  // User APIs
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const response = await api.get('/subscriptions/plans');
      // Ensure each plan has required properties
      return (response.data || []).map((plan: Partial<SubscriptionPlan>) => ({
        name: plan.name || '',
        displayName: plan.displayName || plan.name || '',
        durationMonths: plan.durationMonths || 0,
        priceVND: plan.priceVND || 0,
        aiUsageLimit: plan.aiUsageLimit || 0,
        features: plan.features || []
      }));
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      // Return default plans as fallback
      return [
      
      ];
    }
  },

  createSubscription: async (data: CreateTransactionRequest): Promise<CreateTransactionResponse> => {
    try {
      const response = await api.post('/subscriptions/subscribe', null, {
        params: {
          userId: data.userId,
          subscriptionType: data.subscriptionType
        }
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Subscription creation error:', error);
      
      // Development fallback - return mock data
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock subscription data for development');
        
        // Get plan data for price
        let planPrice = 99000; // default price
        try {
          const plans = await subscriptionService.getSubscriptionPlans();
          const selectedPlan = plans.find(p => p.name === data.subscriptionType);
          if (selectedPlan) {
            planPrice = selectedPlan.priceVND;
          }
        } catch (planError) {
          console.warn('Error getting plan price:', planError);
        }

        const mockTransactionId = Math.floor(Math.random() * 1000000);
        const transferCode = `SUB${Date.now()}`;
        
        return {
          success: true,
          transactionId: mockTransactionId,
          amount: planPrice,
          transferCode,
          qrCodeData: `BANK|0359941290|${planPrice}|${transferCode}|Subscription: ${data.subscriptionType}`,
          bankInfo: {
            bankName: "MB BANK",
            accountNumber: "0359941290",
            accountName: "VO TRONG DAT",
            note: "Please include transfer code in the transfer description"
          }
        };
      }
      
      throw error;
    }
  },

  confirmPayment: async (data: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> => {
    try {
      const response = await api.post('/subscriptions/confirm-payment', null, {
        params: {
          transactionId: data.transactionId,
          transferCode: data.transferCode
        }
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Payment confirmation error:', error);
      
      // Development fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock payment confirmation for development');
        return {
          success: true,
          message: "Payment confirmation sent to admin. Please wait for approval."
        };
      }
      
      throw error;
    }
  },

  getUserActiveSubscription: async (userId: number): Promise<ActiveSubscription> => {
    const response = await api.get(`/subscriptions/user/${userId}/active`);
    return response.data;
  },

  getUserPendingTransactions: async (userId: number): Promise<PendingTransaction[]> => {
    try {
      const response = await api.get(`/subscriptions/user/${userId}/pending-transactions`);
      return response.data.transactions || [];
    } catch (error: unknown) {
      console.error(`Error fetching pending transactions for user ${userId}:`, error);
  
      // Development fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock pending transactions for development');
        return [
          {
            id: 1,
            userId: 1,
            transferCode: 'SUB12345678',
            amount: 99000,
            description: 'Subscription: 1 Month Plan',
            paymentStatus: 'PENDING',
            createdAt: new Date().toISOString()
          }
        ];
      }
  
      throw error;
    }
  },

  // Admin APIs
  getPendingTransactions: async (): Promise<PendingTransaction[]> => {
    const response = await api.get('/admin/pending-transactions');
    return response.data;
  },

  getAllTransactions: async (): Promise<PendingTransaction[]> => {
    const response = await api.get('/admin/all-transactions');
    return response.data;
  },

  getTransactionsByDateRange: async (start: string, end: string): Promise<PendingTransaction[]> => {
    const response = await api.get('/admin/transactions/by-range', {
      params: {
        start,
        end
      }
    });
    return response.data;
  },

  adminConfirmPayment: async (transactionId: number, data: AdminConfirmPaymentRequest): Promise<AdminConfirmPaymentResponse> => {
    const response = await api.post(`/admin/confirm-payment/${transactionId}`, null, {
      params: {
        approved: data.approved
      }
    });
    return response.data;
  }
};
