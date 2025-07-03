import React from 'react';
import { SubscriptionPlanCard } from './SubscriptionPlanCard';
import type { SubscriptionPlan, ActiveSubscription } from '@/types/subscription';

interface SubscriptionPlansGridProps {
  plans: SubscriptionPlan[];
  activeSubscription: ActiveSubscription | null;
  loading: boolean;
  processingPlan: string | null;
  onSelectPlan: (planName: string) => void;
}

export const SubscriptionPlansGrid: React.FC<SubscriptionPlansGridProps> = ({
  plans,
  activeSubscription,
  loading,
  processingPlan,
  onSelectPlan
}) => {
  if (plans.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        Đang tải danh sách gói subscription...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {plans
        .filter((plan, index, self) =>
          self.findIndex((p) => p.name === plan.name) === index
        )
        .map((plan, index) => {
          const isActive =
            activeSubscription?.hasActiveSubscription &&
            activeSubscription.subscriptionType === plan.name &&
            activeSubscription.isValid;

          const isPopular = plan.name === 'MONTHLY';

          return (
            <SubscriptionPlanCard
              key={`${plan.name}-${index}`}
              plan={plan}
              isActive={isActive}
              isPopular={isPopular}
              onSelect={onSelectPlan}
              loading={loading && processingPlan === plan.name}
            />
          );
        })}
    </div>
  );
};
