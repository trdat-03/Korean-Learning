import api from '../api';
import type { LessonDetailType } from '@/models/LessonDetail';

export const flashcardService = {
  /**
   * Lấy tất cả flashcards của user
   */
  getAll: async (userId: number): Promise<LessonDetailType[]> => {
    const response = await api.get(`/flashcards/users/${userId}`);
    return response.data;
  },

  /**
   * Lấy flashcard theo ID
   */
  getById: async (id: number): Promise<LessonDetailType> => {
    const response = await api.get(`/flashcards/${id}`);
    return response.data;
  },

  /**
   * Tạo flashcard mới (truyền userId trong path)
   */
  create: async (userId: number, data: Partial<LessonDetailType>): Promise<LessonDetailType> => {
    const response = await api.post(`/flashcards/users/${userId}`, data);
    return response.data;
  },

  /**
   * Cập nhật flashcard
   */
  update: async (id: number, data: Partial<LessonDetailType>): Promise<LessonDetailType> => {
    const response = await api.put(`/flashcards/${id}`, data);
    return response.data;
  },

  /**
   * Xóa flashcard
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/flashcards/${id}`);
  },
};
