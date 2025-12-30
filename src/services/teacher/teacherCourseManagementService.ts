import api from '@/services/api';
import type { CourseDTO } from '@/services/admin/courseCategoryService';

export interface TeacherCreateCourseRequest {
  title: string;
  description: string;
  image: string;
  categoryId?: number | null;
  teacherId: number; // Thêm teacherId bắt buộc
}

export const teacherCourseManagementService = {
  // Tạo khóa học cho teacher (teacherId được truyền từ user đang đăng nhập)
  async createCourse(data: TeacherCreateCourseRequest): Promise<CourseDTO> {
    const requestData = {
      ...data,
      categoryId: data.categoryId || null,
      teacherId: data.teacherId // Đảm bảo teacherId được gửi
    };
    
    const response = await api.post('/admin/courses', requestData);
    return response.data;
  },

  // Cập nhật khóa học cho teacher
  async updateCourse(id: number, data: TeacherCreateCourseRequest): Promise<CourseDTO> {
    const requestData = {
      ...data,
      categoryId: data.categoryId || null,
      teacherId: data.teacherId // Đảm bảo teacherId được gửi
    };
    
    const response = await api.put(`/admin/courses/${id}`, requestData);
    return response.data;
  },

  // Lấy thông tin khóa học theo ID để chỉnh sửa
  async getCourseById(id: number): Promise<CourseDTO> {
    const response = await api.get(`/admin/courses/${id}`);
    return response.data;
  },

  // Xóa khóa học
  async deleteCourse(id: number): Promise<void> {
    await api.delete(`/courses/${id}`);
  }
};
