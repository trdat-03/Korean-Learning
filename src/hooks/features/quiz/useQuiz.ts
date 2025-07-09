import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { quizService } from '@/services/features/quizService';
import type { QuizState, QuizError, ParsedQuestionType } from '@/types/quiz';

export const useQuiz = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<QuizState>({
    data: null,
    loading: false,
    error: null
  });

  /**
   * Tách chuỗi type thành chủ đề chính và dạng câu hỏi
   * @param type - Chuỗi type từ API (ví dụ: "Từ vựng - Điền từ vào hội thoại")
   * @returns ParsedQuestionType
   */
  const parseQuestionType = useCallback((type: string): ParsedQuestionType => {
    const parts = type.split(' - ');
    if (parts.length >= 2) {
      return {
        mainTopic: parts[0].trim(),
        questionType: parts[1].trim()
      };
    }
    return {
      mainTopic: type,
      questionType: ''
    };
  }, []);

  /**
   * Tạo quiz mặc định cho khóa học
   * @param courseId - ID của khóa học
   */
  const generateQuiz = useCallback(async (courseId: number) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    // Hiển thị thông báo loading chi tiết
    toast.loading('Đang tạo bài kiểm tra... Vui lòng đợi trong giây lát.', {
      toastId: 'quiz-loading',
      autoClose: false,
    });

    try {
      const quizData = await quizService.generateDefaultQuiz(courseId);
      
      // Dismiss loading toast
      toast.dismiss('quiz-loading');
      
      // Kiểm tra dữ liệu trả về
      if (!quizData.questions || quizData.questions.length === 0) {
        throw {
          status: 0,
          message: 'Không thể tạo bài kiểm tra do dữ liệu không đầy đủ.'
        };
      }

      setState(prev => ({
        ...prev,
        data: quizData,
        loading: false,
        error: null
      }));

      toast.success('Tạo bài kiểm tra thành công!');
      
      // Chuyển sang trang làm bài thay vì hiển thị đáp án
      const quizId = `${courseId}_${Date.now()}`; // Tạo ID tạm thời
      
      // Lưu quiz data vào localStorage để sử dụng trong trang làm bài
      localStorage.setItem(`quiz_${quizId}`, JSON.stringify(quizData));
      
      // Chuyển sang trang làm bài
      navigate(`/quiz/${quizId}/attempt`);
      
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss('quiz-loading');
      
      const quizError = error as QuizError;
      let errorMessage = '';
      
      switch (quizError.status) {
        case 408: // Timeout
          errorMessage = 'Tạo bài kiểm tra mất quá nhiều thời gian. Vui lòng thử lại.';
          break;
        case 400:
          errorMessage = 'Dữ liệu đầu vào không hợp lệ.';
          if (quizError.message) {
            errorMessage += ` ${quizError.message}`;
          }
          break;
        case 404:
          errorMessage = 'Không tìm thấy khóa học.';
          break;
        case 500:
          errorMessage = 'Đã xảy ra lỗi khi tạo bài kiểm tra.';
          break;
        default:
          errorMessage = quizError.message || 'Đã xảy ra lỗi không xác định.';
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      toast.error(errorMessage);
    }
  }, [navigate]);

  /**
   * Reset trạng thái quiz
   */
  const resetQuiz = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  /**
   * Retry tạo quiz
   */
  const retryQuiz = useCallback((courseId: number) => {
    generateQuiz(courseId);
  }, [generateQuiz]);

  return {
    ...state,
    generateQuiz,
    resetQuiz,
    retryQuiz,
    parseQuestionType
  };
};
