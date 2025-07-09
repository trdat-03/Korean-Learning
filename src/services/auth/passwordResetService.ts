import api from '@/services/api';
import { AxiosError } from 'axios';

interface ApiResponse {
  success: boolean;
  message: string;
}

class PasswordResetService {
  async sendResetCode(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Gửi mã xác nhận thất bại");
    }
  }

  async verifyResetCode(code: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/verify-reset-code', { code });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Mã xác nhận không hợp lệ");
    }
  }

  async resetPassword(code: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/reset-password', { code, newPassword });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Đặt lại mật khẩu thất bại");
    }
  }
}

export const passwordResetService = new PasswordResetService();
export type { ApiResponse };
