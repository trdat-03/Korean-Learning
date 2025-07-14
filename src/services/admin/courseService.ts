import api from '@/services/api';
import type { Course } from '@/models/Course';
import type { CourseDetail } from '@/models/CourseDetail';

export interface AdminCourseData {
  id?: number;
  title: string;
  description: string;
  categoryId: number;
  teacherId?: number;
  image?: string;
}

export interface AdminCourseDetail extends Course {
  lessons: AdminCourseLesson[];
  students: AdminCourseStudent[];
}

export interface AdminCourseLesson {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: number;
  views: number;
  completions: number;
  published: boolean;
  createdAt: string;
}

export interface AdminCourseStudent {
  id: number;
  fullName: string;
  email: string;
  enrolledAt: string;
  progress: number;
  lastActive: string;
}

export const adminCourseService = {
  // Get all courses for admin
  async getCourses(): Promise<Course[]> {
    const response = await api.get('/admin/courses');
    return response.data;
  },

  // Get course detail with lessons and students (admin endpoint)
  async getCourseDetail(courseId: number): Promise<AdminCourseDetail> {
    const response = await api.get(`/admin/courses/${courseId}`);
    return response.data;
  },

  // Get course detail from public endpoint
  async getCourseDetailPublic(courseId: number): Promise<CourseDetail> {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  // Create new course
  async createCourse(courseData: AdminCourseData): Promise<Course> {
    const response = await api.post('/admin/courses', courseData);
    return response.data;
  },

  // Update course
  async updateCourse(courseId: number, courseData: Partial<AdminCourseData>): Promise<Course> {
    const response = await api.put(`/admin/courses/${courseId}`, courseData);
    return response.data;
  },

  // Delete course
  async deleteCourse(courseId: number): Promise<void> {
    await api.delete(`/admin/courses/${courseId}`);
  },

  // Search courses
  async searchCourses(query: string): Promise<Course[]> {
    const response = await api.get('/admin/courses/search', { params: { q: query } });
    return response.data;
  },

  // Get courses by category
  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    const response = await api.get(`/admin/courses/category/${categoryId}`);
    return response.data;
  },
};
