import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTransactionTable } from '@/components/features/subscription/AdminTransactionTable';
import { subscriptionService } from '@/services/features/subscriptionService';
import { useStatistics } from '@/hooks/features/statistics/useStatistics';
import { statisticsUtils } from '@/services/features/statisticsService';
import type { PendingTransaction } from '@/types/subscription';
import type { TransactionStatistics } from '@/types/statistics';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, Calendar, TrendingUp, DollarSign, Users, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSubscriptionDashboard() {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<PendingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [allTransactionsStartDate, setAllTransactionsStartDate] = useState('');
  const [allTransactionsEndDate, setAllTransactionsEndDate] = useState('');
  const [isFilteringAllTransactions, setIsFilteringAllTransactions] = useState(false);

  const {
    currentMonthStats,
    currentYearStats,
    customStats,
    loading: statsLoading,
    error: statsError,
    fetchCurrentMonthStats,
    fetchCurrentYearStats,
    fetchCustomStats,
    clearError: clearStatsError,
  } = useStatistics();

  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getPendingTransactions();
      setPendingTransactions(data);
    } catch (err) {
      setError('Không thể tải danh sách giao dịch đang chờ');
      console.error('Error fetching pending transactions:', err);
    } finally {
      setLoading(false);
    }
  };  

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getAllTransactions();
      setAllTransactions(data);
      setIsFilteringAllTransactions(false);
    } catch (err) {
      setError('Không thể tải danh sách tất cả giao dịch');
      console.error('Error fetching all transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTransactionsByDateRange = async () => {
    if (!allTransactionsStartDate || !allTransactionsEndDate) {
      setError('Vui lòng chọn ngày bắt đầu và kết thúc để lọc giao dịch');
      return;
    }

    try {
      setLoading(true);
      const start = statisticsUtils.getStartOfDay(new Date(allTransactionsStartDate));
      const end = statisticsUtils.getEndOfDay(new Date(allTransactionsEndDate));
      
      const data = await subscriptionService.getTransactionsByDateRange(start, end);
      setAllTransactions(data);
      setIsFilteringAllTransactions(true);
      setError(null);
    } catch (err) {
      setError('Không thể tải giao dịch theo khoảng thời gian');
      console.error('Error fetching transactions by date range:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAllTransactionsFilter = () => {
    setAllTransactionsStartDate('');
    setAllTransactionsEndDate('');
    setIsFilteringAllTransactions(false);
    fetchAllTransactions();
  };

  const setQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setAllTransactionsStartDate(start.toISOString().split('T')[0]);
    setAllTransactionsEndDate(end.toISOString().split('T')[0]);
  };

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingTransactions();
    } else if (activeTab === 'all') {
      fetchAllTransactions();
    } else if (activeTab === 'statistics') {
      // Auto fetch current month stats when switching to statistics tab
      fetchCurrentMonthStats();
    }
  }, [activeTab, fetchCurrentMonthStats]);

  const handleApprove = async (transactionId: number) => {
    try {
      setProcessingId(transactionId);
      setError(null);
      
      const response = await subscriptionService.adminConfirmPayment(transactionId, {
        approved: true
      });

      if (response.success) {
        setSuccess('Giao dịch đã được duyệt thành công');
        // Refresh the current tab
        if (activeTab === 'pending') {
          await fetchPendingTransactions();
        } else {
          await fetchAllTransactions();
        }
      }
    } catch (err) {
      setError('Không thể duyệt giao dịch');
      console.error('Error approving transaction:', err);
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleReject = async (transactionId: number) => {
    try {
      setProcessingId(transactionId);
      setError(null);
      
      const response = await subscriptionService.adminConfirmPayment(transactionId, {
        approved: false
      });

      if (response.success) {
        setSuccess('Giao dịch đã bị từ chối');
        // Refresh the current tab
        if (activeTab === 'pending') {
          await fetchPendingTransactions();
        } else {
          await fetchAllTransactions();
        }
      }
    } catch (err) {
      setError('Không thể từ chối giao dịch');
      console.error('Error rejecting transaction:', err);
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleRefresh = () => {
    setError(null);
    setSuccess(null);
    if (activeTab === 'pending') {
      fetchPendingTransactions();
    } else if (activeTab === 'all') {
      if (isFilteringAllTransactions) {
        fetchAllTransactionsByDateRange();
      } else {
        fetchAllTransactions();
      }
    } else if (activeTab === 'statistics') {
      // Refresh current statistics
      fetchCurrentMonthStats();
    }
  };

  const handleCustomFetch = async () => {
    if (!customStartDate || !customEndDate) {
      setError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }

    const start = statisticsUtils.getStartOfDay(new Date(customStartDate));
    const end = statisticsUtils.getEndOfDay(new Date(customEndDate));
    
    try {
      await fetchCustomStats(start, end);
      setError(null);
    } catch {
      setError('Không thể tải thống kê tùy chọn');
    }
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
    isCurrency = false,
    variant = 'default'
  }: {
    title: string;
    value: number;
    icon: LucideIcon;
    description?: string;
    isCurrency?: boolean;
    variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'purple';
  }) => {
    const getCardStyles = () => {
      switch (variant) {
        case 'success':
          return 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 hover:shadow-emerald-200/50';
        case 'warning':
          return 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200 hover:shadow-amber-200/50';
        case 'info':
          return 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 hover:shadow-blue-200/50';
        case 'danger':
          return 'bg-gradient-to-br from-red-50 to-rose-100 border-red-200 hover:shadow-red-200/50';
        case 'purple':
          return 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover:shadow-purple-200/50';
        default:
          return 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200 hover:shadow-gray-200/50';
      }
    };

    const getIconStyles = () => {
      switch (variant) {
        case 'success':
          return 'text-emerald-600 bg-emerald-100 p-2 rounded-lg';
        case 'warning':
          return 'text-amber-600 bg-amber-100 p-2 rounded-lg';
        case 'info':
          return 'text-blue-600 bg-blue-100 p-2 rounded-lg';
        case 'danger':
          return 'text-red-600 bg-red-100 p-2 rounded-lg';
        case 'purple':
          return 'text-purple-600 bg-purple-100 p-2 rounded-lg';
        default:
          return 'text-gray-600 bg-gray-100 p-2 rounded-lg';
      }
    };

    const getValueStyles = () => {
      switch (variant) {
        case 'success':
          return 'text-emerald-800';
        case 'warning':
          return 'text-amber-800';
        case 'info':
          return 'text-blue-800';
        case 'danger':
          return 'text-red-800';
        case 'purple':
          return 'text-purple-800';
        default:
          return 'text-gray-800';
      }
    };

    return (
      <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-105 ${getCardStyles()}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${getIconStyles()}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${getValueStyles()}`}>
            {isCurrency ? formatCurrency(value) : value.toLocaleString()}
          </div>
          {description && (
            <p className="text-xs text-gray-600 mt-2 font-medium">{description}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  const StatsGrid = ({ stats, title }: { stats: TransactionStatistics; title: string }) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h3>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng giao dịch"
          value={stats.totalTransactions}
          icon={Users}
          description="Tất cả giao dịch"
          variant="info"
        />
        <StatCard
          title="Chờ xử lý"
          value={stats.pendingTransactions}
          icon={Calendar}
          description="Đang chờ duyệt"
          variant="warning"
        />
        <StatCard
          title="Chờ thanh toán"
          value={stats.waitingPayments}
          icon={Calendar}
          description="Chờ người dùng thanh toán"
          variant="default"
        />
        <StatCard
          title="Thành công"
          value={stats.successTransactions}
          icon={TrendingUp}
          description="Đã hoàn thành"
          variant="success"
        />
        <StatCard
          title="Thất bại"
          value={stats.failedTransactions}
          icon={TrendingUp}
          description="Giao dịch bị từ chối"
          variant="danger"
        />
        <StatCard
          title="Tổng tiền"
          value={stats.totalAmount}
          icon={DollarSign}
          description="Doanh thu"
          isCurrency={true}
          variant="purple"
        />
      </div>
    </div>
  );

  return (
    <AdminLayout title="Quản lý Subscription">
      <div className="space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen -m-6 p-6">
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Dashboard Subscription
            </h1>
            <p className="text-gray-600 mt-1">
              Duyệt và quản lý các giao dịch thanh toán
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-lg">
            <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
            <AlertDescription className="text-green-800 font-medium">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-2 rounded-none">
              <TabsTrigger 
                value="pending"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                🕐 Giao dịch đang chờ
              </TabsTrigger>
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                📊 Tất cả giao dịch
              </TabsTrigger>
              <TabsTrigger 
                value="statistics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                📈 Thống kê
              </TabsTrigger>
            </TabsList>
          
          <TabsContent value="pending" className="mt-6 p-6">
            {loading && !pendingTransactions.length ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <AdminTransactionTable
                  transactions={pendingTransactions}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  loading={processingId}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6 p-6">
            <div className="space-y-6">
              {/* Date Range Filter for All Transactions */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Lọc giao dịch theo ngày
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    {isFilteringAllTransactions 
                      ? `Đang hiển thị giao dịch từ ${allTransactionsStartDate} đến ${allTransactionsEndDate}`
                      : "Chọn khoảng thời gian để lọc giao dịch"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {/* Quick Date Range Buttons */}
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setQuickDateRange(7)}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      7 ngày qua
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setQuickDateRange(30)}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      30 ngày qua
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setQuickDateRange(90)}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      3 tháng qua
                    </Button>
                  </div>
                  
                  <div className="flex gap-4 items-end justify-center flex-wrap">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Từ ngày</label>
                      <input
                        type="date"
                        value={allTransactionsStartDate}
                        onChange={(e) => setAllTransactionsStartDate(e.target.value)}
                        className="border-2 border-green-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Đến ngày</label>
                      <input
                        type="date"
                        value={allTransactionsEndDate}
                        onChange={(e) => setAllTransactionsEndDate(e.target.value)}
                        className="border-2 border-green-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      />
                    </div>
                    <Button 
                      onClick={fetchAllTransactionsByDateRange} 
                      disabled={loading}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3"
                    >
                      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Calendar className="h-4 w-4 mr-2" />}
                      🔍 Lọc giao dịch
                    </Button>
                    {isFilteringAllTransactions && (
                      <Button 
                        onClick={clearAllTransactionsFilter} 
                        disabled={loading}
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 px-6 py-3"
                      >
                        🗑️ Xóa bộ lọc
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Table */}
              {loading && !allTransactions.length ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      {isFilteringAllTransactions ? 'Đang lọc dữ liệu...' : 'Đang tải dữ liệu...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                  <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {isFilteringAllTransactions 
                          ? `📊 Giao dịch từ ${allTransactionsStartDate} đến ${allTransactionsEndDate}`
                          : '📋 Tất cả giao dịch'
                        }
                      </h3>
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {allTransactions.length} giao dịch
                      </span>
                    </div>
                  </div>
                  <AdminTransactionTable
                    transactions={allTransactions}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    loading={processingId}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="mt-6 p-6">
            <div className="space-y-8">
              {/* Statistics Error */}
              {statsError && (
                <Alert variant="destructive" className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-lg">
                  <AlertDescription className="flex items-center justify-between text-red-800 font-medium">
                    {statsError}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearStatsError}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Đóng
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Control buttons */}
              <div className="flex gap-4 flex-wrap justify-center">
                <Button 
                  onClick={fetchCurrentMonthStats} 
                  disabled={statsLoading}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {statsLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Calendar className="h-4 w-4 mr-2" />}
                  📅 Tháng hiện tại
                </Button>
                <Button 
                  onClick={fetchCurrentYearStats} 
                  disabled={statsLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {statsLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                  📆 Năm hiện tại
                </Button>
              </div>

              {/* Custom date range */}
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Thống kê theo khoảng thời gian
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    Chọn khoảng thời gian để xem thống kê chi tiết
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex gap-6 items-end justify-center flex-wrap">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Từ ngày</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="border-2 border-indigo-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Đến ngày</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="border-2 border-indigo-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                      />
                    </div>
                    <Button 
                      onClick={handleCustomFetch} 
                      disabled={statsLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3"
                    >
                      {statsLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
                      🔍 Xem thống kê
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Display */}
              <div className="space-y-12">
                {currentMonthStats && (
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                    <StatsGrid stats={currentMonthStats} title="📊 Thống kê tháng hiện tại" />
                  </div>
                )}

                {currentYearStats && (
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                    <StatsGrid stats={currentYearStats} title="📈 Thống kê năm hiện tại" />
                  </div>
                )}

                {customStats && (
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                    <StatsGrid stats={customStats} title="🎯 Thống kê khoảng thời gian tùy chọn" />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
