import api from '../api';
import type { TransactionStatistics, CustomStatisticsRequest } from '@/types/statistics';

export const statisticsService = {
  /**
   * Lấy thống kê giao dịch tháng hiện tại
   * @returns Promise<TransactionStatistics>
   */
  getCurrentMonthStatistics: async (): Promise<TransactionStatistics> => {
    try {
      const response = await api.get('/statistics/current-month');
      return response.data;
    } catch (error) {
      console.error('Error fetching current month statistics:', error);
      throw error;
    }
  },

  /**
   * Lấy thống kê giao dịch năm hiện tại
   * @returns Promise<TransactionStatistics>
   */
  getCurrentYearStatistics: async (): Promise<TransactionStatistics> => {
    try {
      const response = await api.get('/statistics/current-year');
      return response.data;
    } catch (error) {
      console.error('Error fetching current year statistics:', error);
      throw error;
    }
  },

  /**
   * Lấy thống kê giao dịch theo khoảng thời gian tùy chọn
   * @param start - Thời gian bắt đầu (ISO DateTime format)
   * @param end - Thời gian kết thúc (ISO DateTime format)
   * @returns Promise<TransactionStatistics>
   */
  getCustomStatistics: async (start: string, end: string): Promise<TransactionStatistics> => {
    try {
      // Validate ISO DateTime format
      if (!isValidISODateTime(start) || !isValidISODateTime(end)) {
        throw new Error('Invalid date format. Please use ISO DateTime format (e.g., 2025-07-01T00:00:00)');
      }

      const response = await api.get('/statistics/custom', {
        params: {
          start,
          end
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching custom statistics:', error);
      throw error;
    }
  },

  /**
   * Lấy thống kê giao dịch theo khoảng thời gian tùy chọn (với object request)
   * @param request - Object chứa start và end time
   * @returns Promise<TransactionStatistics>
   */
  getCustomStatisticsWithRequest: async (request: CustomStatisticsRequest): Promise<TransactionStatistics> => {
    return statisticsService.getCustomStatistics(request.start, request.end);
  }
};

/**
 * Utility function để validate ISO DateTime format
 * @param dateString - Chuỗi thời gian cần validate
 * @returns boolean
 */
function isValidISODateTime(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  
  if (!isoDateRegex.test(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Utility functions để tạo ISO DateTime strings
 */
export const statisticsUtils = {
  /**
   * Tạo ISO DateTime string cho đầu tháng hiện tại
   */
  getCurrentMonthStart: (): string => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return startOfMonth.toISOString();
  },

  /**
   * Tạo ISO DateTime string cho cuối tháng hiện tại
   */
  getCurrentMonthEnd: (): string => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return endOfMonth.toISOString();
  },

  /**
   * Tạo ISO DateTime string cho đầu năm hiện tại
   */
  getCurrentYearStart: (): string => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    return startOfYear.toISOString();
  },

  /**
   * Tạo ISO DateTime string cho cuối năm hiện tại
   */
  getCurrentYearEnd: (): string => {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return endOfYear.toISOString();
  },

  /**
   * Tạo ISO DateTime string từ Date object
   */
  dateToISOString: (date: Date): string => {
    return date.toISOString();
  },

  /**
   * Tạo ISO DateTime string cho đầu ngày
   */
  getStartOfDay: (date: Date): string => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay.toISOString();
  },

  /**
   * Tạo ISO DateTime string cho cuối ngày
   */
  getEndOfDay: (date: Date): string => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.toISOString();
  }
};

export default statisticsService;
