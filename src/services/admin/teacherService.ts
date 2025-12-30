import api from '@/services/api';
import type { CourseDTO } from './courseCategoryService';

export interface UserDTO {
  id: number;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  createdAt: string;
}

export interface TeacherDTO extends UserDTO {
  role: 'TEACHER';
}

export const teacherService = {
  async getTeacherCourses(teacherId: number): Promise<CourseDTO[]> {
    const response = await api.get(`/teacher/${teacherId}/courses`);
    return response.data;
  },
  async getAllTeachers(): Promise<TeacherDTO[]> {
    const response = await api.get('/teacher/allTeacher');
    return response.data;
  },

  // Get teachers formatted for select options
  async getTeachersForSelect(): Promise<{ value: string; label: string }[]> {
    const teachers = await this.getAllTeachers();
    return teachers.map(teacher => ({
      value: teacher.id.toString(),
      label: teacher.fullName
    }));
  }
};
