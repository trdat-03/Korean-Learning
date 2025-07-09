import api from '../api';
import type { QuizResponse, QuizError } from '@/types/quiz';

export const quizService = {
  /**
   * Tạo quiz mặc định với 40 câu hỏi cho khóa học
   * @param courseId - ID của khóa học
   * @returns Promise<QuizResponse>
   */
  generateDefaultQuiz: async (courseId: number): Promise<QuizResponse> => {
    try {
      const response = await api.post(`/quiz/generate/${courseId}/default`, {}, {
        timeout: 60000, // Tăng timeout lên 60 giây
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
      // Xử lý lỗi chi tiết
      if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as { code: string; response?: { status: number; data?: { message?: string } }; request?: unknown };
        
        // Xử lý timeout
        if (axiosError.code === 'ECONNABORTED') {
          throw {
            status: 408,
            message: 'Tạo bài kiểm tra mất quá nhiều thời gian. Vui lòng thử lại.'
          };
        }
        
        // Xử lý lỗi response
        if (axiosError.response) {
          const quizError: QuizError = {
            status: axiosError.response.status,
            message: axiosError.response.data?.message || 'Đã xảy ra lỗi không xác định'
          };
          throw quizError;
        }
        
        // Xử lý lỗi request
        if (axiosError.request) {
          throw {
            status: 0,
            message: 'Không thể kết nối tới máy chủ'
          };
        }
      }
      
      // Lỗi không xác định
      throw {
        status: 0,
        message: 'Đã xảy ra lỗi không xác định'
      };
    }
  }
};
