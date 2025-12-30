import api from '@/services/api';
import type { CourseDTO } from './courseCategoryService';

export interface CreateCourseRequest {
  title: string;
  description: string;
  image: string;
  teacherId?: number | null;
  categoryId?: number | null;
}

export interface UpdateCourseRequest {
  title: string;
  description: string;
  image: string;
  teacherId?: number | null;
  categoryId?: number | null;
}

export const courseManagementService = {
  async createCourse(data: CreateCourseRequest): Promise<CourseDTO> {
    const requestData = {
      ...data,
      teacherId: data.teacherId || null,
      categoryId: data.categoryId || null
    };
    
    const response = await api.post('/courses', requestData);
    return response.data;
  },

  async updateCourse(id: number, data: UpdateCourseRequest): Promise<CourseDTO> {
    const requestData = {
      ...data,
      teacherId: data.teacherId || null,
      categoryId: data.categoryId || null
    };
    
    const response = await api.put(`/admin/courses/${id}`, requestData);
    return response.data;
  },

  async getCourseById(id: number): Promise<CourseDTO> {
    const response = await api.get(`/admin/courses/${id}`);
    return response.data;
  },


  async deleteCourse(id: number): Promise<void> {
    await api.delete(`/courses/${id}`);
  }
};
