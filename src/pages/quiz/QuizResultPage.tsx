import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CertificateNotification } from '@/components/certificate/CertificateNotification';
import { Clock, Trophy, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useCertificate } from '@/hooks/certificate/useCertificate';
import { useUser } from '@/hooks/authentication/useUser';
import type { QuizResponse, QuizResult } from '@/types/quiz';
import type { Certificate } from '@/types/certificate';

const QuizResultPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { createCertificateFromQuiz } = useCertificate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

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

  // Load quiz result
  useEffect(() => {
    const loadQuizResult = async () => {
      if (!quizId) {
        navigate('/');
        return;
      }

      const resultData = localStorage.getItem(`quiz_result_${quizId}`);
      const originalQuizData = localStorage.getItem(`quiz_${quizId}`);
      
      if (!resultData || !originalQuizData) {
        navigate('/');
        return;
      }

      try {
        const parsedResult = JSON.parse(resultData);
        const parsedQuizData: QuizResponse = JSON.parse(originalQuizData);
        
        // Calculate score
        let correctAnswers = 0;
        const resultAnswers = parsedResult.answers.map((answer: { questionNumber: number; answer: string }) => {
          const question = parsedQuizData.questions.find(q => q.questionNumber === answer.questionNumber);
          if (!question) return null;
          
          const isCorrect = answer.answer === question.correctAnswer;
          if (isCorrect) correctAnswers++;
          
          return {
            questionNumber: answer.questionNumber,
            question: question.questionText,
            userAnswer: answer.answer,
            correctAnswer: question.correctAnswer,
            isCorrect,
            explanation: question.explanation
          };
        }).filter(Boolean);

        const score = Math.round((correctAnswers / parsedQuizData.questions.length) * 100);

        const finalResult: QuizResult = {
          quizId,
          courseTitle: parsedQuizData.courseTitle,
          totalQuestions: parsedQuizData.questions.length,
          correctAnswers,
          score,
          timeSpent: parsedResult.timeSpent,
          answers: resultAnswers
        };

        setResult(finalResult);
        setQuizData(parsedQuizData);
        setLoading(false);
        
        // Tạo chứng chỉ nếu đủ điều kiện và có user
        if (user && finalResult.score >= 60) {
          try {
            const newCertificate = await createCertificateFromQuiz({
              userId: user.id,
              courseId: parsedQuizData.courseId,
              courseTitle: parsedQuizData.courseTitle,
              score: finalResult.score,
              userName: user.name || 'Người dùng'
            });
            
            if (newCertificate) {
              setCertificate(newCertificate);
            }
          } catch (error) {
            console.error('Lỗi khi tạo chứng chỉ:', error);
            // Không hiển thị lỗi cho user vì chứng chỉ là tính năng phụ
          }
        }
      } catch (error) {
        console.error('Error loading quiz result:', error);
        navigate('/');
      }
    };

    loadQuizResult();
  }, [quizId, navigate, user, createCertificateFromQuiz]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get score message
  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Xuất sắc! 🎉';
    if (score >= 80) return 'Rất tốt! 👍';
    if (score >= 70) return 'Tốt! 😊';
    if (score >= 60) return 'Khá! 🙂';
    return 'Cần cố gắng thêm! 💪';
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Đang tải kết quả...</p>
          </div>
        </div>
      </>
    );
  }

  if (!result || !quizData) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Không tìm thấy kết quả bài kiểm tra!</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Result Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Kết quả bài kiểm tra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}%
                </div>
                <p className="text-sm text-gray-600 mt-1">{getScoreMessage(result.score)}</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <p className="text-sm text-gray-600 mt-1">Câu trả lời đúng</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600 flex items-center justify-center gap-1">
                  <Clock className="h-5 w-5" />
                  {formatTime(result.timeSpent)}
                </div>
                <p className="text-sm text-gray-600 mt-1">Thời gian làm bài</p>
              </div>
              
              <div className="text-center">
                <Progress value={result.score} className="mb-2" />
                <p className="text-sm text-gray-600">Tiến độ hoàn thành</p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-lg font-medium mb-2">{result.courseTitle}</p>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => navigate(`/courses/${quizData.courseId}`)}
                  variant="outline"
                >
                  Quay lại khóa học
                </Button>
                <Button
                  onClick={() => {
                    // Clear old quiz data and redirect to course for new quiz
                    localStorage.removeItem(`quiz_${quizId}`);
                    localStorage.removeItem(`quiz_result_${quizId}`);
                    navigate(`/courses/${quizData.courseId}`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Tạo bài kiểm tra mới
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Notification */}
        {certificate && (
          <div className="mb-6">
            <CertificateNotification
              certificate={certificate}
              onViewCertificate={(cert) => {
                console.log('View certificate:', cert);
                // TODO: Implement view certificate functionality
              }}
              onDownloadCertificate={(cert) => {
                console.log('Download certificate:', cert);
                // TODO: Implement download certificate functionality
              }}
            />
          </div>
        )}

        {/* Detailed Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Chi tiết kết quả ({result.answers.length} câu)
          </h3>
          
          {quizData.questions.map((question) => {
            const userResult = result.answers.find(a => a.questionNumber === question.questionNumber);
            
            return (
              <Card key={question.questionNumber} className="relative">
                <div className="absolute top-4 right-4">
                  {userResult?.isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between pr-10">
                    <CardTitle className="text-lg">
                      Câu {question.questionNumber}
                    </CardTitle>
                    <div className="flex flex-col gap-1 items-end">
                      <Badge className={
                        parseQuestionType(question.type).mainTopic.toLowerCase() === 'từ vựng'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }>
                        {parseQuestionType(question.type).mainTopic}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Context */}
                  {question.context && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Ngữ cảnh:</p>
                      <p className="text-sm text-gray-600">{question.context}</p>
                    </div>
                  )}

                  {/* Question */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Câu hỏi:</p>
                    <p className="text-base">{question.questionText}</p>
                  </div>

                  {/* Options with results */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Lựa chọn:</p>
                    <div className="grid gap-2">
                      {question.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index);
                        const isCorrect = question.correctAnswer === optionLetter;
                        const isUserAnswer = userResult?.userAnswer === optionLetter;
                        
                        let className = 'flex items-center gap-2 p-3 rounded-lg border ';
                        if (isCorrect) {
                          className += 'bg-green-50 border-green-200';
                        } else if (isUserAnswer) {
                          className += 'bg-red-50 border-red-200';
                        } else {
                          className += 'bg-gray-50 border-gray-200';
                        }
                        
                        return (
                          <div key={index} className={className}>
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                              isCorrect 
                                ? 'bg-green-500 text-white' 
                                : isUserAnswer
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}>
                              {optionLetter}
                            </div>
                            <span className={`flex-1 ${
                              isCorrect 
                                ? 'text-green-700 font-medium' 
                                : isUserAnswer
                                ? 'text-red-700 font-medium'
                                : 'text-gray-700'
                            }`}>
                              {option}
                            </span>
                            {isCorrect && (
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            )}
                            {isUserAnswer && !isCorrect && (
                              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* User Answer vs Correct Answer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-800">Câu trả lời của bạn:</p>
                      <p className="text-sm text-blue-700">
                        {userResult?.userAnswer || 'Chưa trả lời'}
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800">Đáp án đúng:</p>
                      <p className="text-sm text-green-700">{question.correctAnswer}</p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Giải thích:</p>
                    <p className="text-sm text-yellow-700">{question.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default QuizResultPage;
