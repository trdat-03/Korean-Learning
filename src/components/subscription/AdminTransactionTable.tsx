import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Clock } from 'lucide-react';
import type { PendingTransaction } from '@/types/subscription';

interface AdminTransactionTableProps {
  transactions: PendingTransaction[];
  onApprove: (transactionId: number) => void;
  onReject: (transactionId: number) => void;
  loading?: number; // transactionId being processed
}

export const AdminTransactionTable: React.FC<AdminTransactionTableProps> = ({
  transactions,
  onApprove,
  onReject,
  loading
}) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Chờ duyệt
        </Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="text-green-600 border-green-300">
          <Check className="h-3 w-3 mr-1" />
          Đã duyệt
        </Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="text-red-600 border-red-300">
          <X className="h-3 w-3 mr-1" />
          Từ chối
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giao dịch chờ duyệt</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không có giao dịch nào chờ duyệt
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Mã người dùng</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono">#{transaction.id}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.userId}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.transferCode}</TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(transaction.createdAt)}
                    </TableCell>
                    <TableCell>
                      {transaction.paymentStatus === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-300 hover:bg-green-50"
                            onClick={() => onApprove(transaction.id)}
                            disabled={loading === transaction.id}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => onReject(transaction.id)}
                            disabled={loading === transaction.id}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Từ chối
                          </Button>
                        </div>
                      )}
                      {loading === transaction.id && (
                        <span className="text-sm text-gray-500">Đang xử lý...</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
