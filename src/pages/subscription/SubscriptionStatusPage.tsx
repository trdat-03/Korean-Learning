import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Crown, Calendar, Users } from 'lucide-react';
import { subscriptionService } from '@/services/features/subscriptionService';
import type { ActiveSubscription } from '@/types/subscription';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionStatusPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from localStorage (adjust according to your auth implementation)
  const userId = parseInt(localStorage.getItem('userId') || '0');

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const data = await subscriptionService.getUserActiveSubscription(userId);
        setSubscription(data);
      } catch (err) {
        setError('Không thể tải thông tin subscription');
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [userId, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSubscriptionDisplayName = (type: string) => {
    switch (type) {
      case 'FREE': return 'Miễn phí';
      case 'MONTHLY': return 'Hàng tháng';
      case 'YEARLY': return 'Hàng năm';
      case 'LIFETIME': return 'Trọn đời';
      default: return type;
    }
  };

  const getStatusBadge = (subscription: ActiveSubscription) => {
    if (!subscription.hasActiveSubscription) {
      return <Badge variant="outline">Chưa đăng ký</Badge>;
    }

    if (!subscription.isValid) {
      return <Badge variant="destructive">Đã hết hạn</Badge>;
    }

    return <Badge variant="default" className="bg-green-500">Đang hoạt động</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Trạng thái Subscription
          </h1>
          <p className="text-gray-600">
            Thông tin về gói subscription hiện tại của bạn
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Gói hiện tại
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                  {getStatusBadge(subscription)}
                </div>

                {subscription.hasActiveSubscription && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Loại gói:</span>
                      <span className="font-medium">
                        {getSubscriptionDisplayName(subscription.subscriptionType)}
                      </span>
                    </div>

                    {subscription.startDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Ngày bắt đầu:</span>
                        <span className="text-sm text-gray-600">
                          {formatDate(subscription.startDate)}
                        </span>
                      </div>
                    )}

                    {subscription.endDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Ngày kết thúc:</span>
                        <span className="text-sm text-gray-600">
                          {formatDate(subscription.endDate)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {!subscription.hasActiveSubscription && (
                  <div className="text-center py-4">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-4">
                      Bạn chưa có gói subscription nào. Hãy chọn một gói phù hợp để trải nghiệm đầy đủ tính năng.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Không có thông tin subscription
              </div>
            )}
          </CardContent>
        </Card>

        {subscription && !subscription.isValid && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              Gói subscription của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng các tính năng premium.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4 justify-center">
          {(!subscription?.hasActiveSubscription || !subscription?.isValid) && (
            <Button
              onClick={() => navigate('/subscription')}
              size="lg"
            >
              Chọn gói subscription
            </Button>
          )}
          
          {subscription?.hasActiveSubscription && subscription?.isValid && (
            <Button
              variant="outline"
              onClick={() => navigate('/subscription')}
              size="lg"
            >
              Nâng cấp gói
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
