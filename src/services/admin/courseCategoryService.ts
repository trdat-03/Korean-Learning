import api from '@/services/api';

export interface CourseCategoryDTO {
  id: number;
  name: string;
  subCategories: CourseDTO[];
}

export interface CourseDTO {
  id: number;
  title: string;
  description: string;
  image: string;
  teacherId?: number;
  categoryId?: number;
  createdAt: string;
  teacherName?: string;
  categoryName?: string;
  studentCount: number;
  lessonCount: number;
}

export const courseCategoryService = {
  // Get all course categories
  async getAllCategories(): Promise<CourseCategoryDTO[]> {
    const response = await api.get('/course-categories');
    return response.data;
  },

  // Get categories formatted for select options
  async getCategoriesForSelect(): Promise<{ value: string; label: string }[]> {
    const categories = await this.getAllCategories();
    return categories.map(category => ({
      value: category.id.toString(),
      label: category.name
    }));
  }
};
