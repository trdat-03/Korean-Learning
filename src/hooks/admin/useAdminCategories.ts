import { useState, useEffect, useCallback } from 'react';
import { 
  adminCategoryService, 
  type AdminCategoryData, 
  type AdminCategoryStats,
  type AdminCategory
} from '@/services/admin/categoryService';

interface UseAdminCategoriesOptions {
  autoLoad?: boolean;
  includeStats?: boolean;
}

export const useAdminCategories = (options: UseAdminCategoriesOptions = {}) => {
  const { autoLoad = true, includeStats = false } = options;
  
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [stats, setStats] = useState<AdminCategoryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminCategoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminCategoryService.getCategoryStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData: AdminCategoryData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newCategory = await adminCategoryService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (categoryId: number, categoryData: Partial<AdminCategoryData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedCategory = await adminCategoryService.updateCategory(categoryId, categoryData);
      setCategories(prev => prev.map(category => 
        category.id === categoryId ? updatedCategory : category
      ));
      
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await adminCategoryService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(category => category.id !== categoryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCategories = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminCategoryService.searchCategories(query);
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdateStatus = useCallback(async (categoryIds: number[], status: 'active' | 'inactive') => {
    try {
      setLoading(true);
      setError(null);
      
      await adminCategoryService.bulkUpdateStatus(categoryIds, status);
      // Refresh categories after bulk update
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const checkSlugAvailability = useCallback(async (slug: string, excludeId?: number) => {
    try {
      setError(null);
      
      const result = await adminCategoryService.checkSlugAvailability(slug, excludeId);
      return result.available;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check slug availability');
      return false;
    }
  }, []);

  // Auto-load categories on mount
  useEffect(() => {
    if (autoLoad) {
      fetchCategories();
      if (includeStats) {
        fetchStats();
      }
    }
  }, [autoLoad, includeStats, fetchCategories, fetchStats]);

  return {
    categories,
    stats,
    loading,
    error,
    
    // Actions
    fetchCategories,
    fetchStats,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    bulkUpdateStatus,
    checkSlugAvailability,
    
    // Utilities
    clearError: () => setError(null),
    refresh: fetchCategories,
  };
};

// Hook for single category detail
export const useAdminCategoryDetail = (categoryId: number) => {
  const [category, setCategory] = useState<AdminCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminCategoryService.getCategoryDetail(categoryId);
      setCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category detail');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetail();
    }
  }, [categoryId, fetchCategoryDetail]);

  return {
    category,
    loading,
    error,
    
    // Actions
    fetchCategoryDetail,
    
    // Utilities
    clearError: () => setError(null),
    refresh: fetchCategoryDetail,
  };
};
