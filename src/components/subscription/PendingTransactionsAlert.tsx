import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { PendingTransaction } from '@/types/subscription';

interface PendingTransactionsAlertProps {
  pendingTransactions: PendingTransaction[];
}

export const PendingTransactionsAlert: React.FC<PendingTransactionsAlertProps> = ({
  pendingTransactions
}) => {
  if (pendingTransactions.length === 0) return null;

  return (
    <Alert className="mb-6 max-w-2xl mx-auto bg-yellow-50 border-yellow-200">
      <AlertDescription className="text-yellow-800">
        <strong>Bạn đang có giao dịch đang chờ duyệt:</strong>
        <ul className="mt-2 space-y-2">
          {pendingTransactions.map((tx) => (
            <li key={tx.id} className="text-sm">
              <span className="font-medium">Mã giao dịch:</span> {tx.transferCode}<br />
              <span className="font-medium">Số tiền:</span> {tx.amount.toLocaleString()} VND<br />
              <span className="font-medium">Ngày tạo:</span>{' '}
              {new Date(tx.createdAt).toLocaleDateString('vi-VN')}<br />
              <span className="font-medium">Trạng thái:</span> {tx.paymentStatus}
            </li>
          ))}
        </ul>
        <p className="mt-2">
          Vui lòng đợi admin xác nhận trước khi thực hiện giao dịch mới.
        </p>
      </AlertDescription>
    </Alert>
  );
};
