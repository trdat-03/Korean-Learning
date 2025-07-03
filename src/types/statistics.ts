// Types for transaction statistics

export interface TransactionStatistics {
  /** Tổng số giao dịch */
  totalTransactions: number;
  pendingTransactions: number;
  waitingPayments: number;
  successTransactions: number;
  failedTransactions: number;
  totalAmount: number;
}

export interface CustomStatisticsRequest {
  start: string;

  end: string;
}

export interface StatisticsPeriod {
  type: 'current-month' | 'current-year' | 'custom';
  label: string;
  start?: string;
  end?: string;
}
