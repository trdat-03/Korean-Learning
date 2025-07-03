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

export interface PaymentInfo {
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

export interface PendingTransaction {
  id: number;
  userId: number;
  transferCode: string;
  amount: number;
  description: string;
  paymentStatus: string;
  createdAt: string;
}

export type SubscriptionType = 'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME';
