import { useState } from 'react';
import { courseManagementService } from '@/services/admin/courseManagementService';

export interface UseDeleteCourseReturn {
  isDeleting: boolean;
  deleteCourse: (id: number, courseName: string) => Promise<boolean>;
}

export const useDeleteCourse = (): UseDeleteCourseReturn => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCourse = async (id: number, courseName: string): Promise<boolean> => {
    // Hiển thị dialog xác nhận
    const confirmMessage = `Bạn có chắc chắn muốn xóa khóa học "${courseName}"?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return false;
    }

    try {
      setIsDeleting(true);
      
      await courseManagementService.deleteCourse(id);
      
      alert('Xóa khóa học thành công!');
      return true;
      
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Có lỗi xảy ra khi xóa khóa học. Vui lòng thử lại.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteCourse
  };
};
