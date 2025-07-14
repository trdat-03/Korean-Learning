import api from '@/services/api';
import type { Course } from '@/models/Course';

export interface AdminCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
  courseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategoryData {
  id?: number;
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
}

export interface AdminCategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalCourses: number;
  averageCoursesPerCategory: number;
}

export const adminCategoryService = {
  // Get all categories
  async getCategories(): Promise<AdminCategory[]> {
    const response = await api.get('/api/admin/categories');
    return response.data;
  },

  // Get category statistics
  async getCategoryStats(): Promise<AdminCategoryStats> {
    const response = await api.get('/api/admin/categories/statistics');
    return response.data;
  },

  // Get category detail
  async getCategoryDetail(categoryId: number): Promise<AdminCategory> {
    const response = await api.get(`/api/admin/categories/${categoryId}`);
    return response.data;
  },

  // Create new category
  async createCategory(categoryData: AdminCategoryData): Promise<AdminCategory> {
    const response = await api.post('/api/admin/categories', categoryData);
    return response.data;
  },

  // Update category
  async updateCategory(categoryId: number, categoryData: Partial<AdminCategoryData>): Promise<AdminCategory> {
    const response = await api.put(`/api/admin/categories/${categoryId}`, categoryData);
    return response.data;
  },

  // Delete category
  async deleteCategory(categoryId: number): Promise<void> {
    await api.delete(`/api/admin/categories/${categoryId}`);
  },

  // Update category status
  async updateCategoryStatus(categoryId: number, status: 'active' | 'inactive'): Promise<void> {
    await api.patch(`/api/admin/categories/${categoryId}/status`, { status });
  },

  // Get courses by category
  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    const response = await api.get(`/api/admin/categories/${categoryId}/courses`);
    return response.data;
  },

  // Search categories
  async searchCategories(query: string): Promise<AdminCategory[]> {
    const response = await api.get('/admin/categories/search', { params: { q: query } });
    return response.data;
  },

};
