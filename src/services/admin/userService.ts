import api from '@/services/api';
import type { UserDTO } from '@/models/User';


export interface AdminDeleteUserResponse {
  success: boolean;
  message: string;
}

export const adminUserService = {
  async getUsers(): Promise<UserDTO[]> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Create user - POST /api/admin/users
  async createUser(userData: Omit<UserDTO, 'id' | 'createdAt'> & { password: string }): Promise<UserDTO> {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  // Update user - matches backend PUT /api/admin/users/{id}
  async updateUser(userId: number, userData: Partial<UserDTO>): Promise<UserDTO> {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user - matches backend DELETE /api/admin/users/{id}
  async deleteUser(userId: number): Promise<AdminDeleteUserResponse> {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};
