import api from '@/services/api';

export interface AdminDashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalRevenue: number;
  activeUsers: number;
  newUsersThisMonth: number;
  coursesCompletedThisMonth: number;
  revenueThisMonth: number;
  userGrowthRate: number;
  courseCompletionRate: number;
}

export interface AdminRecentActivity {
  id: number;
  type: 'user_registration' | 'course_enrollment' | 'lesson_completion' | 'course_completion' | 'payment';
  userId: number;
  userName: string;
  userEmail: string;
  description: string;
  timestamp: string;
  metadata?: {
    courseId?: number;
    courseName?: string;
    lessonId?: number;
    lessonName?: string;
    amount?: number;
  };
}

export interface AdminTopCourse {
  id: number;
  title: string;
  enrollments: number;
  completions: number;
  revenue: number;
  rating: number;
  completionRate: number;
}

export interface AdminTopStudent {
  id: number;
  fullName: string;
  email: string;
  coursesCompleted: number;
  totalTimeSpent: number;
  joinDate: string;
  lastActive: string;
}

export interface AdminSystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  activeConnections: number;
  lastUpdated: string;
}

export interface AdminAnalytics {
  userAnalytics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    usersByRole: { role: string; count: number }[];
    userGrowthOverTime: { date: string; count: number }[];
  };
  courseAnalytics: {
    totalCourses: number;
    activeCourses: number;
    totalEnrollments: number;
    completionRate: number;
    popularCourses: AdminTopCourse[];
    enrollmentsByCategory: { category: string; count: number }[];
  };
  revenueAnalytics: {
    totalRevenue: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    revenueOverTime: { date: string; amount: number }[];
    revenueByCategory: { category: string; amount: number }[];
  };
}

export const adminDashboardService = {
  // Get dashboard statistics
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
  },

  // Get recent activities
  async getRecentActivities(limit: number = 10): Promise<AdminRecentActivity[]> {
    const response = await api.get('/api/admin/dashboard/activities', { params: { limit } });
    return response.data;
  },

  // Get top courses
  async getTopCourses(limit: number = 5): Promise<AdminTopCourse[]> {
    const response = await api.get('/api/admin/dashboard/top-courses', { params: { limit } });
    return response.data;
  },

  // Get top students
  async getTopStudents(limit: number = 5): Promise<AdminTopStudent[]> {
    const response = await api.get('/api/admin/dashboard/top-students', { params: { limit } });
    return response.data;
  },

  // Get system health
  async getSystemHealth(): Promise<AdminSystemHealth> {
    const response = await api.get('/api/admin/dashboard/system-health');
    return response.data;
  },

  // Get analytics data
  async getAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<AdminAnalytics> {
    const response = await api.get('/api/admin/dashboard/analytics', { params: { period } });
    return response.data;
  },

  // Get user growth data
  async getUserGrowthData(days: number = 30): Promise<Array<{ date: string; count: number }>> {
    const response = await api.get('/api/admin/dashboard/user-growth', { params: { days } });
    return response.data;
  },

  // Get revenue data
  async getRevenueData(days: number = 30): Promise<Array<{ date: string; amount: number }>> {
    const response = await api.get('/api/admin/dashboard/revenue', { params: { days } });
    return response.data;
  },

  // Get course completion data
  async getCourseCompletionData(days: number = 30): Promise<Array<{ date: string; count: number }>> {
    const response = await api.get('/api/admin/dashboard/course-completions', { params: { days } });
    return response.data;
  },

  // Get notifications for admin
  async getNotifications(): Promise<Array<{
    id: number;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>> {
    const response = await api.get('/api/admin/dashboard/notifications');
    return response.data;
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId: number): Promise<void> {
    await api.patch(`/api/admin/dashboard/notifications/${notificationId}/read`);
  },

  // Get quick actions data
  async getQuickActions(): Promise<{
    pendingCourseReviews: number;
    pendingUserRegistrations: number;
    pendingPayments: number;
    reportedIssues: number;
    systemAlerts: number;
  }> {
    const response = await api.get('/api/admin/dashboard/quick-actions');
    return response.data;
  },
};
