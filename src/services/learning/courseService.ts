import api from '../api';
import type { CourseDetail } from '@/models/CourseDetail';

export const courseService = {
  getCourseById: async (courseId: number): Promise<CourseDetail> => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  checkEnrollment: async (userId: string, courseId: number): Promise<boolean> => {
    const response = await api.get(`/enrollments/check?userId=${userId}&courseId=${courseId}`);
    return response.data;
  },

  enrollCourse: async (userId: string, courseId: number): Promise<void> => {
    await api.post('/enrollments', {
      userId,
      courseId,
    });
  }
}; 