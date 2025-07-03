import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseService } from '@/services/features/courseService';
import { AuthService } from '@/utils/AuthService';
import type { CourseDetail } from '@/models/CourseDetail';

export const useCourse = (courseId: number) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", err);
        toast.error("Không thể tải thông tin khóa học!");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const checkEnrollment = async () => {
      const user = AuthService.getUser();
      if (!user || !course?.id) return;

      try {
        const isUserEnrolled = await courseService.checkEnrollment(user.id, course.id);
        setIsEnrolled(isUserEnrolled);
      } catch (err) {
        console.error("Lỗi khi kiểm tra đăng ký:", err);
      }
    };

    if (course) {
      checkEnrollment();
    }
  }, [course]);

  const handleEnrollment = async () => {
    const user = AuthService.getUser();
    if (!user || !course) return;

    try {
      await courseService.enrollCourse(user.id, course.id);
      toast.success("Đăng ký khóa học thành công!");
      setIsEnrolled(true);
      setShowDialog(false);
    } catch {
      toast.error("Đăng ký khóa học thất bại!");
    }
  };

  const handleCourseAction = () => {
    if (!AuthService.isLoggedIn()) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (isEnrolled) {
      navigate(`/courses/${courseId}/learn`);
    } else {
      setShowDialog(true);
    }
  };

  return {
    course,
    loading,
    isEnrolled,
    showDialog,
    showLoginPrompt,
    setShowDialog,
    setShowLoginPrompt,
    handleEnrollment,
    handleCourseAction,
  };
}; 