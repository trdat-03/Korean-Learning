import api from '../api';
import type { LessonDetailType } from '@/models/LessonDetail';
import type { CourseDetail } from '@/models/CourseDetail';

export const lessonService = {
  getLessonsByCourseId: async (courseId: number): Promise<LessonDetailType[]> => {
    const response = await api.get<CourseDetail>(`/courses/${courseId}`);
    return response.data.lessons || [];
  },

  getLessonById: async (lessonId: number): Promise<LessonDetailType> => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },

  updateLesson: async (lessonId: number, lessonData: Partial<LessonDetailType>): Promise<LessonDetailType> => {
    const response = await api.put(`/lessons/${lessonId}`, lessonData);
    return response.data;
  }
}; 