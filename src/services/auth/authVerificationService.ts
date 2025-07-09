import api from '@/services/api';
import { AxiosError } from 'axios';

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface VerifyAccountRequest {
  code: string;
}

interface ResendVerificationRequest {
  email: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

class AuthVerificationService {
  async register(data: RegisterRequest): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Đăng ký thất bại");
    }
  }

  async verifyAccount(code: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/verify-account', { code });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Xác thực thất bại");
    }
  }

  async resendVerification(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Gửi lại mã thất bại");
    }
  }

  async checkVerificationCode(code: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/check-verification-code', { code });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Kiểm tra mã thất bại");
    }
  }
}

export const authVerificationService = new AuthVerificationService();
export type { RegisterRequest, VerifyAccountRequest, ResendVerificationRequest, ApiResponse };
