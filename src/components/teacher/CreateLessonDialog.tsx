import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { adminLessonService } from '@/services/admin/lessonService';
import type { LessonRequestDTO, LessonDetailDTO } from '@/services/admin/lessonService';

interface CreateLessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseName: string;
  onLessonCreated: (lesson: LessonDetailDTO) => void;
}

export const CreateLessonDialog: React.FC<CreateLessonDialogProps> = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  onLessonCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tên bài học');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const lessonData: LessonRequestDTO = {
        courseId,
        title: title.trim()
      };

      console.log('Creating lesson with data:', lessonData);
      const createdLesson = await adminLessonService.createSimpleLesson(lessonData);
      console.log('Lesson created successfully:', createdLesson);
      
      // Gọi callback để parent component cập nhật danh sách
      onLessonCreated(createdLesson);
      
      // Reset form và đóng dialog
      setTitle('');
      onClose();
      
      alert('Tạo bài học thành công!');
      
    } catch (error) {
      console.error('Error creating lesson:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: unknown } };
        console.error('Error details:', axiosError.response.data);
      }
      alert('Có lỗi xảy ra khi tạo bài học. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo bài học mới</DialogTitle>
          <p className="text-sm text-gray-600">
            Tạo bài học cho khóa học: <strong>{courseName}</strong>
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="lesson-title">Tên bài học</Label>
            <Input
              id="lesson-title"
              type="text"
              placeholder="Nhập tên bài học..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="text-sm text-gray-500">
            <p>• Bài học sẽ được tạo với thông tin cơ bản</p>
            <p>• Bạn có thể chỉnh sửa chi tiết sau khi tạo</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo bài học'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
