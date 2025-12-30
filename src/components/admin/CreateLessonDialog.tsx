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
import { Loader2, Plus } from 'lucide-react';
import { adminLessonService } from '@/services/admin/lessonService';
import type { LessonRequestDTO, LessonDetailDTO } from '@/services/admin/lessonService';

interface CreateLessonDialogProps {
  courseId: number;
  courseName: string;
  onLessonCreated: (lesson: LessonDetailDTO) => void;
}

export const CreateLessonDialog: React.FC<CreateLessonDialogProps> = ({
  courseId,
  courseName,
  onLessonCreated
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

      const createdLesson = await adminLessonService.createSimpleLesson(lessonData);
      
      // Gọi callback để parent component cập nhật danh sách
      onLessonCreated(createdLesson);
      
      // Reset form và đóng dialog
      setTitle('');
      setIsOpen(false);
      
      alert('Tạo bài học thành công!');
      
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Có lỗi xảy ra khi tạo bài học. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Tạo bài học mới
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo bài học mới</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="course-name">Thuộc khóa học</Label>
              <Input
                id="course-name"
                value={courseName}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            
            <div>
              <Label htmlFor="lesson-title">Tên bài học *</Label>
              <Input
                id="lesson-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Bài 1: Chào hỏi cơ bản"
                required
                disabled={isSubmitting}
              />
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
                type="submit"
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
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
