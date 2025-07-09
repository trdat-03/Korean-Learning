import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SubscriptionErrorProps {
  error: string | null;
  onDismiss?: () => void;
}

export const SubscriptionError: React.FC<SubscriptionErrorProps> = ({
  error,
  onDismiss
}) => {
  if (!error) return null;

  return (
    <Alert className="mb-6 max-w-2xl mx-auto">
      <AlertDescription>
        {error}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-blue-600 hover:underline"
          >
            Đóng
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};
