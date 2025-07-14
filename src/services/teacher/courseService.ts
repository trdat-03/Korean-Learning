import api from '@/services/api';
import type { Course } from '@/models/Course';

export interface TeacherCourseStats {
  totalCourses: number;
  activeCourses: number;
  draftCourses: number;
  archivedCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

export interface TeacherCourseStudent {
  id: number;
  fullName: string;
  email: string;
  enrolledAt: string;
  progress: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'completed';
}

export const teacherCourseService = {
  async getCourses(teacherId: number): Promise<Course[]> {
    const response = await api.get(`/teacher/${teacherId}/courses`);
    return response.data;
  },
  async getCourseStudents(teacherId: number, courseId: number): Promise<TeacherCourseStudent[]> {
    const response = await api.get(`/teacher/${teacherId}/courses/${courseId}/students`);
    return response.data;
  },

  async getDashboard(teacherId: number): Promise<{
    totalCourses: number;
    totalStudents: number;
    courses: Course[];
  }> {
    const response = await api.get(`/teacher/${teacherId}/dashboard`);
    return response.data;
  },

  async getCourseStats(teacherId: number): Promise<TeacherCourseStats> {
    const dashboard = await this.getDashboard(teacherId);
    return {
      totalCourses: dashboard.totalCourses,
      activeCourses: dashboard.courses.filter(c => c.status === 'active').length,
      draftCourses: dashboard.courses.filter(c => c.status === 'draft').length,
      archivedCourses: dashboard.courses.filter(c => c.status === 'archived').length,
      totalStudents: dashboard.totalStudents,
      totalRevenue: 0, 
    };
  },
};
