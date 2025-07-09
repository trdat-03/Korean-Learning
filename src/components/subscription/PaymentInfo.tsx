import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import QRCode from 'qrcode';
import type { PaymentInfo } from '@/types/subscription';

interface PaymentInfoProps {
  paymentInfo: PaymentInfo;
  onConfirmPayment: () => void;
  loading?: boolean;
}

export const PaymentInfoComponent: React.FC<PaymentInfoProps> = ({
  paymentInfo,
  onConfirmPayment,
  loading = false
}) => {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (qrRef.current && paymentInfo.qrCodeData) {
      QRCode.toCanvas(qrRef.current, paymentInfo.qrCodeData, {
        width: 200,
        margin: 2,
      }).catch(console.error);
    }
  }, [paymentInfo.qrCodeData]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Đã sao chép!",
        description: "Thông tin đã được sao chép vào clipboard.",
      });
    } catch {
      toast({
        title: "Lỗi sao chép",
        description: "Không thể sao chép thông tin. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Thông tin chuyển khoản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ngân hàng:</label>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="font-medium">{paymentInfo.bankInfo.bankName}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Số tài khoản:</label>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="font-mono">{paymentInfo.bankInfo.accountNumber}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(paymentInfo.bankInfo.accountNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tên tài khoản:</label>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="font-medium">{paymentInfo.bankInfo.accountName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(paymentInfo.bankInfo.accountName)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Số tiền:</label>
                <div className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-200">
                  <span className="font-bold text-blue-600 text-lg">
                    {formatAmount(paymentInfo.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(paymentInfo.amount.toString())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mã chuyển khoản:</label>
                <div className="flex items-center justify-between bg-yellow-50 p-2 rounded border border-yellow-200">
                  <span className="font-mono font-bold text-yellow-700">
                    {paymentInfo.transferCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(paymentInfo.transferCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">QR Code chuyển khoản</h3>
                <div className="bg-white p-4 rounded-lg border">
                  <canvas ref={qrRef} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> {paymentInfo.bankInfo.note}
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Vui lòng ghi đúng mã chuyển khoản <strong>{paymentInfo.transferCode}</strong> 
              vào nội dung chuyển khoản để hệ thống có thể xác nhận thanh toán.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button
          onClick={onConfirmPayment}
          disabled={loading}
          size="lg"
          className="px-8"
        >
          {loading ? 'Đang xử lý...' : 'Tôi đã chuyển khoản'}
        </Button>
      </div>
    </div>
  );
};
