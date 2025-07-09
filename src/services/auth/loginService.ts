import api from '@/services/api';
import { AxiosError } from 'axios';
import type { UserDTO } from "@/models/User";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: UserDTO;
}

class LoginService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      
      return {
        token: response.data.token,
        user: response.data as UserDTO,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || "Đăng nhập thất bại!");
    }
  }
}

export const loginService = new LoginService();
export type { LoginRequest, LoginResponse };
