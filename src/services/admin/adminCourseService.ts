import api from '@/services/api';


export interface AdminCourseDTO {
  id: number;
  title: string;
  description: string;
  image: string;
  createdAt: string; 
  teacherName: string;
  categoryName: string;
  studentCount: number;
  lessonCount: number;
}

export interface AdminCourseData {
  id?: number;
  title: string;
  description: string;
  image?: string;
  teacherId?: number;
  categoryId: number;
  price?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'inactive' | 'draft';
}

export interface AdminCourseDetail extends AdminCourseDTO {
  lessons: AdminCourseLesson[];
  students: AdminCourseStudent[];
  teacher: {
    id: number;
    fullName: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
  };
}

export interface AdminCourseLesson {
  id: number;
  title: string;
  description: string;
  order: number;
  duration: number;
  status: 'published' | 'draft' | 'archived';
  completions: number;
}

export interface AdminCourseStudent {
  id: number;
  fullName: string;
  email: string;
  enrolledAt: string;
  progress: number;
  completedAt?: string;
  status: 'active' | 'completed' | 'dropped';
}

export const adminCourseService = {
  async getCourses(): Promise<AdminCourseDTO[]> {
    const response = await api.get('/api/admin/courses');
    return response.data;
  },

  async getCourseDetail(courseId: number): Promise<AdminCourseDetail> {
    const response = await api.get(`/api/admin/courses/${courseId}`);
    return response.data;
  },

  async createCourse(courseData: AdminCourseData): Promise<AdminCourseDTO> {
    const response = await api.post('/api/admin/courses', courseData);
    return response.data;
  },

  async updateCourse(courseId: number, courseData: Partial<AdminCourseData>): Promise<AdminCourseDTO> {
    const response = await api.put(`/api/admin/courses/${courseId}`, courseData);
    return response.data;
  },

  async deleteCourse(courseId: number): Promise<void> {
    await api.delete(`/api/admin/courses/${courseId}`);
  },

  async updateCourseStatus(courseId: number, status: 'active' | 'inactive' | 'draft'): Promise<void> {
    await api.patch(`/api/admin/courses/${courseId}/status`, { status });
  },

  async getCourseStudents(courseId: number): Promise<AdminCourseStudent[]> {
    const response = await api.get(`/api/admin/courses/${courseId}/students`);
    return response.data;
  },

  async getCourseLessons(courseId: number): Promise<AdminCourseLesson[]> {
    const response = await api.get(`/api/admin/courses/${courseId}/lessons`);
    return response.data;
  },


  async searchCourses(query: string): Promise<AdminCourseDTO[]> {
    const response = await api.get('/api/admin/courses/search', { params: { q: query } });
    return response.data;
  },

  async getCoursesByCategory(categoryId: number): Promise<AdminCourseDTO[]> {
    const response = await api.get(`/api/admin/courses/category/${categoryId}`);
    return response.data;
  },

  async getCoursesByTeacher(teacherId: number): Promise<AdminCourseDTO[]> {
    const response = await api.get(`/api/admin/courses/teacher/${teacherId}`);
    return response.data;
  },

  async bulkUpdateStatus(courseIds: number[], status: 'active' | 'inactive' | 'draft'): Promise<void> {
    await api.patch('/api/admin/courses/bulk-status', { courseIds, status });
  },


  async exportCourses(format: 'csv' | 'excel'): Promise<Blob> {
    const response = await api.get('/api/admin/courses/export', { 
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },
};
