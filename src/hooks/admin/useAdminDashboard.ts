import { useState, useEffect, useCallback } from 'react';
import { 
  adminDashboardService, 
  type AdminDashboardStats,
  type AdminRecentActivity,
  type AdminTopCourse,
  type AdminTopStudent,
  type AdminSystemHealth,
  type AdminAnalytics
} from '@/services/admin/dashboardService';

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [activities, setActivities] = useState<AdminRecentActivity[]>([]);
  const [topCourses, setTopCourses] = useState<AdminTopCourse[]>([]);
  const [topStudents, setTopStudents] = useState<AdminTopStudent[]>([]);
  const [systemHealth, setSystemHealth] = useState<AdminSystemHealth | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentActivities = useCallback(async (limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getRecentActivities(limit);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent activities');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopCourses = useCallback(async (limit: number = 5) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getTopCourses(limit);
      setTopCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch top courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopStudents = useCallback(async (limit: number = 5) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getTopStudents(limit);
      setTopStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch top students');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSystemHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getSystemHealth();
      setSystemHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system health');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getAnalytics(period);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserGrowthData = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getUserGrowthData(days);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user growth data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRevenueData = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getRevenueData(days);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourseCompletionData = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getCourseCompletionData(days);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course completion data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuickActions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getQuickActions();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quick actions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchDashboardStats(),
        fetchRecentActivities(),
        fetchTopCourses(),
        fetchTopStudents(),
        fetchSystemHealth(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh dashboard');
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardStats, fetchRecentActivities, fetchTopCourses, fetchTopStudents, fetchSystemHealth]);

  // Auto-load dashboard data on mount
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  return {
    stats,
    activities,
    topCourses,
    topStudents,
    systemHealth,
    analytics,
    loading,
    error,
    
    // Actions
    fetchDashboardStats,
    fetchRecentActivities,
    fetchTopCourses,
    fetchTopStudents,
    fetchSystemHealth,
    fetchAnalytics,
    fetchUserGrowthData,
    fetchRevenueData,
    fetchCourseCompletionData,
    fetchQuickActions,
    refreshDashboard,
    
    // Utilities
    clearError: () => setError(null),
  };
};

// Hook for real-time dashboard updates
export const useAdminDashboardRealTime = (intervalMs: number = 30000) => {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const dashboard = useAdminDashboard();

  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      dashboard.fetchDashboardStats();
      dashboard.fetchRecentActivities();
      dashboard.fetchSystemHealth();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, intervalMs, dashboard]);

  return {
    ...dashboard,
    isRealTimeEnabled,
    enableRealTime: () => setIsRealTimeEnabled(true),
    disableRealTime: () => setIsRealTimeEnabled(false),
    toggleRealTime: () => setIsRealTimeEnabled(prev => !prev),
  };
};

// Hook for dashboard notifications
export const useAdminDashboardNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminDashboardService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      setError(null);
      
      await adminDashboardService.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    
    // Actions
    fetchNotifications,
    markAsRead,
    
    // Utilities
    clearError: () => setError(null),
  };
};
