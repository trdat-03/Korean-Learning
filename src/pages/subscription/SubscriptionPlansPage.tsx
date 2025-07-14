import { useSubscription } from '@/hooks/subscription/useSubscription';
import { SubscriptionLoadingSpinner } from '@/components/subscription/SubscriptionLoadingSpinner';
import { SubscriptionPageContent } from '@/components/subscription/SubscriptionPageContent';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { LoginPromptDialog } from '@/components/LoginPromptDialog';
import { useState, useEffect } from 'react';

export default function SubscriptionPlansPage() {
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(!isAuthenticated);
  const {
    plans,
    activeSubscription,
    pendingTransactions,
    loading,
    error,
    processingPlan,
    paymentInfo,
    showPaymentDialog,
    handleSelectPlan,
    handlePaymentSuccess,
    handleDialogOpenChange,
    clearError,
  } = useSubscription();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <SubscriptionLoadingSpinner />;
  }

  return (
    <>
    <Header />
    <SubscriptionPageContent
      plans={plans}
      activeSubscription={activeSubscription}
      pendingTransactions={pendingTransactions}
      loading={loading}
      error={error}
      processingPlan={processingPlan}
      paymentInfo={paymentInfo}
      showPaymentDialog={showPaymentDialog}
      onSelectPlan={handleSelectPlan}
      onPaymentSuccess={handlePaymentSuccess}
      onDialogOpenChange={handleDialogOpenChange}
      onClearError={clearError}
    />
    
    <LoginPromptDialog
      open={showLoginPrompt}
      onClose={() => setShowLoginPrompt(false)}
    />
    </>
  );
}
