import { useEffect, useState } from 'react';
import { useStatistics } from '@/hooks/statistics/useStatistics';
import { statisticsUtils } from '@/services/features/statisticsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, TrendingUp, DollarSign, Users, type LucideIcon } from 'lucide-react';
import type { TransactionStatistics } from '@/types/statistics';

export const StatisticsDemo = () => {
  const {
    currentMonthStats,
    currentYearStats,
    customStats,
    loading,
    error,
    fetchCurrentMonthStats,
    fetchCurrentYearStats,
    fetchCustomStats,
    clearError,
  } = useStatistics();

  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    // Auto fetch current month stats on mount
    fetchCurrentMonthStats();
  }, [fetchCurrentMonthStats]);

  const handleCustomFetch = async () => {
    if (!customStartDate || !customEndDate) {
      alert('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }

    const start = statisticsUtils.getStartOfDay(new Date(customStartDate));
    const end = statisticsUtils.getEndOfDay(new Date(customEndDate));
    
    await fetchCustomStats(start, end);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description,
    isCurrency = false 
  }: {
    title: string;
    value: number;
    icon: LucideIcon;
    description?: string;
    isCurrency?: boolean;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isCurrency ? formatCurrency(value) : value.toLocaleString()}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  const StatsGrid = ({ stats, title }: { stats: TransactionStatistics; title: string }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng giao dịch"
          value={stats.totalTransactions}
          icon={Users}
          description="Tất cả giao dịch"
        />
        <StatCard
          title="Chờ xử lý"
          value={stats.pendingTransactions}
          icon={Calendar}
          description="Đang chờ duyệt"
        />
        <StatCard
          title="Chờ thanh toán"
          value={stats.waitingPayments}
          icon={Calendar}
          description="Chờ người dùng thanh toán"
        />
        <StatCard
          title="Thành công"
          value={stats.successTransactions}
          icon={TrendingUp}
          description="Đã hoàn thành"
        />
        <StatCard
          title="Thất bại"
          value={stats.failedTransactions}
          icon={TrendingUp}
          description="Giao dịch bị từ chối"
        />
        <StatCard
          title="Tổng tiền"
          value={stats.totalAmount}
          icon={DollarSign}
          description="Doanh thu"
          isCurrency={true}
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Thống kê giao dịch</h1>
        {loading && <Loader2 className="h-6 w-6 animate-spin" />}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={clearError}>
              Đóng
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Control buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button onClick={fetchCurrentMonthStats} disabled={loading}>
          Tháng hiện tại
        </Button>
        <Button onClick={fetchCurrentYearStats} disabled={loading}>
          Năm hiện tại
        </Button>
      </div>

      {/* Custom date range */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo khoảng thời gian</CardTitle>
          <CardDescription>
            Chọn khoảng thời gian để xem thống kê chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ ngày</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Đến ngày</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <Button onClick={handleCustomFetch} disabled={loading}>
              Xem thống kê
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Display */}
      {currentMonthStats && (
        <StatsGrid stats={currentMonthStats} title="📊 Thống kê tháng hiện tại" />
      )}

      {currentYearStats && (
        <StatsGrid stats={currentYearStats} title="📈 Thống kê năm hiện tại" />
      )}

      {customStats && (
        <StatsGrid stats={customStats} title="🎯 Thống kê khoảng thời gian tùy chọn" />
      )}
    </div>
  );
};
