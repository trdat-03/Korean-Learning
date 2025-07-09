import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock } from 'lucide-react';
import { subscriptionService } from '@/services/system/subscriptionService';
import type { CreateTransactionResponse } from '@/services/system/subscriptionService';
import { PaymentInfoComponent } from './PaymentInfo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmPaymentProps {
  planName: string;
  paymentInfo: CreateTransactionResponse;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfirmPayment: React.FC<ConfirmPaymentProps> = ({
  planName,
  paymentInfo,
  onSuccess,
  open,
  onOpenChange
}) => {
  const [step, setStep] = useState<'payment-info' | 'confirming' | 'success'>('payment-info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmPayment = async () => {
    try {
      setStep('confirming');
      setLoading(true);
      setError(null);

      // Call API to confirm payment
      const response = await subscriptionService.confirmPayment({
        transactionId: paymentInfo.transactionId,
        transferCode: paymentInfo.transferCode
      });

      if (response.success) {
        setStep('success');
      } else {
        throw new Error('Failed to confirm payment');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.');
      console.error('Error confirming payment:', err);
      setStep('payment-info');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    onSuccess();
    // Delay reload để user có thể thấy thông báo thành công
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
      // Reset state khi đóng dialog
      setTimeout(() => {
        setStep('payment-info');
        setError(null);
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Xác nhận thanh toán gói {planName}
          </DialogTitle>
        </DialogHeader>

        {step === 'payment-info' && (
          <div className="space-y-4">
            <PaymentInfoComponent
              paymentInfo={paymentInfo}
              onConfirmPayment={handleConfirmPayment}
              loading={loading}
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Vui lòng thực hiện chuyển khoản theo thông tin trên, sau đó nhấn "Tôi đã chuyển khoản" để hoàn tất đăng ký.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 'confirming' && (
          <div className="py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang xác nhận thanh toán...</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cảm ơn bạn đã đăng ký gói {planName}!
              </h3>
              <p className="text-gray-600">
                Chúng tôi đã nhận được yêu cầu đăng ký của bạn.
              </p>
            </div>
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Admin sẽ kiểm tra và duyệt thanh toán trong vòng 1-24 giờ. 
                Bạn sẽ nhận được thông báo qua email khi subscription được kích hoạt.
              </AlertDescription>
            </Alert>

            <div className="text-center mt-6">
              <Button onClick={handleFinish}>
                Hoàn tất
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
