import { useState, useEffect } from 'react';
import { courseCategoryService } from '@/services/admin/courseCategoryService';
import { teacherService } from '@/services/admin/teacherService';

export interface SelectOption {
  value: string;
  label: string;
}

export interface UseCourseFormDataReturn {
  categories: SelectOption[];
  teachers: SelectOption[];
  isLoading: boolean;
  error: string | null;
}

export const useCourseFormData = (): UseCourseFormDataReturn => {
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [teachers, setTeachers] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [categoriesData, teachersData] = await Promise.all([
          courseCategoryService.getCategoriesForSelect(),
          teacherService.getTeachersForSelect()
        ]);

        setCategories(categoriesData);
        setTeachers(teachersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
        console.error('Error fetching course form data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    categories,
    teachers,
    isLoading,
    error
  };
};
