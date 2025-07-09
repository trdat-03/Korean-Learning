import { useSubscription } from '@/hooks/subscription/useSubscription';
import { SubscriptionLoadingSpinner } from '@/components/subscription/SubscriptionLoadingSpinner';
import { SubscriptionPageContent } from '@/components/subscription/SubscriptionPageContent';
import { Header } from '@/components/Header';

export default function SubscriptionPlansPage() {
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
    </>
  );
}
