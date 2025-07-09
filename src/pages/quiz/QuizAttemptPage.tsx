import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuizAttemptQuestionComponent } from '@/components/quiz/QuizAttemptQuestion';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { QuizResponse, QuizAttempt, QuizAttemptQuestion } from '@/types/quiz';

const QuizAttemptPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(true);

  // Parse question type
  const parseQuestionType = useCallback((type: string) => {
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

  // Load quiz data
  useEffect(() => {
    if (!quizId) {
      navigate('/');
      return;
    }

    const quizData = localStorage.getItem(`quiz_${quizId}`);
    if (!quizData) {
      navigate('/');
      return;
    }

    try {
      const parsedData: QuizResponse = JSON.parse(quizData);
      
      // Convert to quiz attempt format (remove correct answers)
      const attemptQuestions: QuizAttemptQuestion[] = parsedData.questions.map(q => ({
        questionNumber: q.questionNumber,
        type: q.type,
        questionText: q.questionText,
        context: q.context,
        options: q.options,
        userAnswer: undefined
      }));

      setQuiz({
        quizId,
        courseId: parsedData.courseId,
        courseTitle: parsedData.courseTitle,
        questions: attemptQuestions,
        startTime: new Date().toISOString(),
        timeLimit: 60 // 60 phút
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading quiz:', error);
      navigate('/');
    }
  }, [quizId, navigate]);

  // Timer
  useEffect(() => {
    if (!quiz) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((questionNumber: number, answer: string) => {
    if (!quiz) return;

    const updatedQuestions = quiz.questions.map(q => 
      q.questionNumber === questionNumber 
        ? { ...q, userAnswer: answer }
        : q
    );

    setQuiz(prev => prev ? { ...prev, questions: updatedQuestions } : null);
  }, [quiz]);

  // Navigate questions
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit quiz
  const submitQuiz = useCallback(() => {
    if (!quiz) return;

    // Save answers to localStorage for result page
    const quizResult = {
      quizId,
      timeSpent: timeElapsed,
      answers: quiz.questions.map(q => ({
        questionNumber: q.questionNumber,
        answer: q.userAnswer || ''
      }))
    };

    localStorage.setItem(`quiz_result_${quizId}`, JSON.stringify(quizResult));
    navigate(`/quiz/${quizId}/result`);
  }, [quiz, quizId, timeElapsed, navigate]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Đang tải bài kiểm tra...</p>
          </div>
        </div>
      </>
    );
  }

  if (!quiz) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Không tìm thấy bài kiểm tra!</p>
          </div>
        </div>
      </>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = quiz.questions.filter(q => q.userAnswer).length;
  const progress = (answeredCount / quiz.questions.length) * 100;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{quiz.courseTitle}</CardTitle>
                <p className="text-gray-600 mt-1">Bài kiểm tra - {quiz.questions.length} câu hỏi</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5" />
                  {formatTime(timeElapsed)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tiến độ</p>
                <Progress value={progress} className="mt-1" />
                <p className="text-xs text-gray-500 mt-1">
                  {answeredCount}/{quiz.questions.length} câu
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Câu hiện tại</p>
                <Badge variant="outline" className="mt-1">
                  {currentQuestionIndex + 1}/{quiz.questions.length}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <div className="flex items-center gap-1 mt-1">
                  {currentQuestion.userAnswer ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  )}
                  <span className="text-sm">
                    {currentQuestion.userAnswer ? 'Đã trả lời' : 'Chưa trả lời'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Danh sách câu hỏi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {quiz.questions.map((q, index) => (
                    <Button
                      key={q.questionNumber}
                      variant={index === currentQuestionIndex ? "default" : "outline"}
                      size="sm"
                      className={`h-10 w-10 p-0 ${
                        q.userAnswer 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-300'
                      }`}
                      onClick={() => goToQuestion(index)}
                    >
                      {q.questionNumber}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Question */}
          <div className="lg:col-span-3">
            <QuizAttemptQuestionComponent
              question={currentQuestion}
              parseQuestionType={parseQuestionType}
              onAnswerSelect={handleAnswerSelect}
            />

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Câu trước
              </Button>

              <div className="flex gap-2">
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <Button onClick={nextQuestion}>
                    Câu tiếp theo
                  </Button>
                ) : (
                  <Button 
                    onClick={submitQuiz}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Nộp bài
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizAttemptPage;
