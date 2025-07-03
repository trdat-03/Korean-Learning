import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import type { SubscriptionPlan } from '@/types/subscription';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isActive?: boolean;
  isPopular?: boolean;
  onSelect: (planName: string) => void;
  loading?: boolean;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  isActive = false,
  isPopular = false,
  onSelect,
  loading = false
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDurationText = (months: number) => {
    if (months === 0) return 'Miễn phí mãi mãi';
    if (months === 1) return '1 tháng';
    if (months === 12) return '1 năm';
    if (months === -1) return 'Trọn đời';
    return `${months} tháng`;
  };

  return (
    <Card className={`relative h-full transition-all duration-300 hover:shadow-lg ${
      isPopular ? 'border-blue-500 shadow-md scale-105' : ''
    } ${isActive ? 'border-green-500 bg-green-50' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
          Phổ biến
        </Badge>
      )}
      
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold">{plan.displayName}</CardTitle>
        <div className="text-3xl font-bold text-blue-600">
          {plan.priceVND === 0 ? 'Miễn phí' : formatPrice(plan.priceVND)}
        </div>
        <p className="text-sm text-gray-600">{getDurationText(plan.durationMonths)}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600 text-center">
          {plan.aiUsageLimit === -1 
            ? 'AI không giới hạn' 
            : `${plan.aiUsageLimit} lượt AI/tháng`
          }
        </div>
        
        <ul className="space-y-2">
          {(plan.features || []).map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          variant={isActive ? "secondary" : "default"}
          disabled={isActive || loading}
          onClick={() => onSelect(plan.name)}
        >
          {loading ? 'Đang xử lý...' : isActive ? 'Đang sử dụng' : 'Chọn gói'}
        </Button>
      </CardFooter>
    </Card>
  );
};
