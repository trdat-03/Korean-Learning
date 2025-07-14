import api from '@/services/api';


export interface AdminTransactionDTO {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  courseId?: number;
  courseName?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  paymentMethod: string;
  transactionRef?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export interface AdminTransactionStats {
  totalTransactions: number;
  pendingTransactions: number;
  successTransactions: number;
  failedTransactions: number;
  cancelledTransactions: number;
  totalAmount: number;
  pendingAmount: number;
  successAmount: number;
  monthlyRevenue: number;
  revenueGrowth: number;
}

export interface AdminTransactionFilter {
  status?: 'pending' | 'success' | 'failed' | 'cancelled';
  userId?: number;
  courseId?: number;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string;
}

export interface AdminPaymentConfirmation {
  approved: boolean;
  notes?: string;
}

export interface AdminPaymentConfirmationResponse {
  success: boolean;
  message: string;
  transaction?: AdminTransactionDTO;
}

export const adminTransactionService = {
  async getPendingTransactions(): Promise<AdminTransactionDTO[]> {
    const response = await api.get('/api/admin/pending-transactions');
    return response.data;
  },

  async getAllTransactions(): Promise<AdminTransactionDTO[]> {
    const response = await api.get('/api/admin/all-transactions');
    return response.data;
  },

  async getSuccessTransactions(): Promise<AdminTransactionDTO[]> {
    const response = await api.get('/api/admin/success-transactions');
    return response.data;
  },

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<AdminTransactionDTO[]> {
    const response = await api.get('/api/admin/transactions/by-range', {
      params: {
        start: startDate,
        end: endDate
      }
    });
    return response.data;
  },

  async confirmPayment(transactionId: number, confirmation: AdminPaymentConfirmation): Promise<AdminPaymentConfirmationResponse> {
    const response = await api.post(`/api/admin/confirm-payment/${transactionId}`, null, {
      params: {
        approved: confirmation.approved
      }
    });
    return response.data;
  },

  async getTransactionStats(): Promise<AdminTransactionStats> {
    try {
      const response = await api.get('/api/admin/transactions/statistics');
      return response.data;
    } catch {
      const allTransactions = await this.getAllTransactions();
      const pendingTransactions = allTransactions.filter(t => t.status === 'pending');
      const successTransactions = allTransactions.filter(t => t.status === 'success');
      const failedTransactions = allTransactions.filter(t => t.status === 'failed');
      const cancelledTransactions = allTransactions.filter(t => t.status === 'cancelled');
      
      const totalAmount = allTransactions.reduce((sum, t) => sum + t.amount, 0);
      const pendingAmount = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);
      const successAmount = successTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        totalTransactions: allTransactions.length,
        pendingTransactions: pendingTransactions.length,
        successTransactions: successTransactions.length,
        failedTransactions: failedTransactions.length,
        cancelledTransactions: cancelledTransactions.length,
        totalAmount,
        pendingAmount,
        successAmount,
        monthlyRevenue: 0, 
        revenueGrowth: 0 
      };
    }
  },

  async getTransactionDetail(transactionId: number): Promise<AdminTransactionDTO> {
    const response = await api.get(`/api/admin/transactions/${transactionId}`);
    return response.data;
  },

  async searchTransactions(query: string): Promise<AdminTransactionDTO[]> {
    const response = await api.get('/api/admin/transactions/search', { params: { q: query } });
    return response.data;
  },

  // Get transactions with filters - will need to be implemented in backend
  async getTransactions(filter?: AdminTransactionFilter): Promise<AdminTransactionDTO[]> {
    const response = await api.get('/api/admin/transactions', { params: filter });
    return response.data;
  },

  // Get user transactions - will need to be implemented in backend
  async getUserTransactions(userId: number): Promise<AdminTransactionDTO[]> {
    const response = await api.get(`/api/admin/users/${userId}/transactions`);
    return response.data;
  },

  // Get course transactions - will need to be implemented in backend
  async getCourseTransactions(courseId: number): Promise<AdminTransactionDTO[]> {
    const response = await api.get(`/api/admin/courses/${courseId}/transactions`);
    return response.data;
  },

  // Refund transaction - will need to be implemented in backend
  async refundTransaction(transactionId: number, reason?: string): Promise<AdminPaymentConfirmationResponse> {
    const response = await api.post(`/api/admin/transactions/${transactionId}/refund`, { reason });
    return response.data;
  },

  // Export transactions data - will need to be implemented in backend
  async exportTransactions(format: 'csv' | 'excel', filter?: AdminTransactionFilter): Promise<Blob> {
    const response = await api.get('/api/admin/transactions/export', { 
      params: { format, ...filter },
      responseType: 'blob'
    });
    return response.data;
  },

  // Get revenue analytics - will need to be implemented in backend
  async getRevenueAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<{
    totalRevenue: number;
    periodRevenue: number;
    growth: number;
    revenueOverTime: Array<{ date: string; amount: number }>;
    revenueByPaymentMethod: Array<{ method: string; amount: number }>;
    revenueByDay: Array<{ day: string; amount: number }>;
  }> {
    const response = await api.get('/api/admin/transactions/revenue-analytics', { params: { period } });
    return response.data;
  },
};
