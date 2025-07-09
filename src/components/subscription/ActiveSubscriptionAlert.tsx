import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ActiveSubscription } from '@/types/subscription';

interface ActiveSubscriptionAlertProps {
  activeSubscription: ActiveSubscription | null;
}

export const ActiveSubscriptionAlert: React.FC<ActiveSubscriptionAlertProps> = ({
  activeSubscription
}) => {
  if (!activeSubscription?.hasActiveSubscription) return null;

  return (
    <Alert className="mb-6 max-w-2xl mx-auto bg-green-50 border-green-200">
      <AlertDescription className="text-green-800">
        Bạn đang sử dụng gói <strong>{activeSubscription.subscriptionType}</strong>
        {activeSubscription.endDate && (
          <>
            {' '}đến ngày{' '}
            {new Date(activeSubscription.endDate).toLocaleDateString('vi-VN')}
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};
