import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useDeleteCourse } from '@/hooks/admin/useDeleteCourse';

interface DeleteCourseButtonProps {
  courseId: number;
  courseName: string;
  onDeleted?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export const DeleteCourseButton: React.FC<DeleteCourseButtonProps> = ({
  courseId,
  courseName,
  onDeleted,
  variant = 'destructive',
  size = 'sm',
  showText = true,
  className
}) => {
  const { isDeleting, deleteCourse } = useDeleteCourse();

  const handleDelete = async () => {
    const success = await deleteCourse(courseId, courseName);
    if (success && onDeleted) {
      onDeleted();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDelete}
      disabled={isDeleting}
      className={className}
    >
      {isDeleting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {showText && <span className="ml-2">Đang xóa...</span>}
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4" />
          {showText && <span className="ml-2">Xóa</span>}
        </>
      )}
    </Button>
  );
};
