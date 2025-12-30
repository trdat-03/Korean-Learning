import { useState, useEffect } from 'react';
import { courseCategoryService } from '@/services/admin/courseCategoryService';
import { useTeacherId } from '@/hooks/teacher/useTeacherId';

export interface SelectOption {
  value: string;
  label: string;
}

export interface UseTeacherCourseFormDataReturn {
  categories: SelectOption[];
  currentTeacher: {
    id: number;
    name: string;
    email: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export const useTeacherCourseFormData = (): UseTeacherCourseFormDataReturn => {
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isTeacher, currentUser } = useTeacherId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Kiểm tra xem user có phải là teacher không
        if (!isTeacher || !currentUser) {
          setError('Bạn không có quyền truy cập trang này');
          return;
        }

        const categoriesData = await courseCategoryService.getCategoriesForSelect();
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
        console.error('Error fetching teacher course form data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isTeacher, currentUser]);

  return {
    categories,
    currentTeacher: currentUser ? {
      id: currentUser.id,
      name: currentUser.fullName,
      email: currentUser.email
    } : null,
    isLoading,
    error
  };
};
