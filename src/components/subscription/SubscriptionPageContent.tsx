import React from 'react';
import { SubscriptionPageHeader } from './SubscriptionPageHeader';
import { SubscriptionError } from './SubscriptionError';
import { PendingTransactionsAlert } from './PendingTransactionsAlert';
import { ActiveSubscriptionAlert } from './ActiveSubscriptionAlert';
import { SubscriptionPlansGrid } from './SubscriptionPlansGrid';
import { SubscriptionPageFooter } from './SubscriptionPageFooter';
import { ConfirmPayment } from './ConfirmPayment';
import type { SubscriptionPlan, ActiveSubscription, PendingTransaction } from '@/types/subscription';
import type { CreateTransactionResponse } from '@/services/features/subscriptionService';

interface SubscriptionPageContentProps {
  plans: SubscriptionPlan[];
  activeSubscription: ActiveSubscription | null;
  pendingTransactions: PendingTransaction[];
  loading: boolean;
  error: string | null;
  processingPlan: string | null;
  paymentInfo: CreateTransactionResponse | null;
  showPaymentDialog: boolean;
  onSelectPlan: (planName: string) => void;
  onPaymentSuccess: () => void;
  onDialogOpenChange: (open: boolean) => void;
  onClearError: () => void;
}

export const SubscriptionPageContent: React.FC<SubscriptionPageContentProps> = ({
  plans,
  activeSubscription,
  pendingTransactions,
  loading,
  error,
  processingPlan,
  paymentInfo,
  showPaymentDialog,
  onSelectPlan,
  onPaymentSuccess,
  onDialogOpenChange,
  onClearError
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <SubscriptionPageHeader />
      
      <SubscriptionError 
        error={error} 
        onDismiss={onClearError} 
      />
      
      <PendingTransactionsAlert 
        pendingTransactions={pendingTransactions} 
      />
      
      <ActiveSubscriptionAlert 
        activeSubscription={activeSubscription} 
      />

      <SubscriptionPlansGrid
        plans={plans}
        activeSubscription={activeSubscription}
        loading={loading}
        processingPlan={processingPlan}
        onSelectPlan={onSelectPlan}
      />

      {processingPlan && paymentInfo && (
        <ConfirmPayment
          planName={processingPlan}
          paymentInfo={paymentInfo}
          onSuccess={onPaymentSuccess}
          open={showPaymentDialog}
          onOpenChange={onDialogOpenChange}
        />
      )}

      <SubscriptionPageFooter />
    </div>
  );
};
