import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, MessageSquare, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { PracticeQuestion } from '@/types/practice';
import type { TestResultResponse } from '@/services/learning';

interface PracticeResultsProps {
  timeElapsed: number;
  formatTime: (seconds: number) => string;
  calculateScore: () => number;
  questions: PracticeQuestion[];
  userAnswers: Record<string, string>;
  testResults: TestResultResponse | null;
  isSubmitting: boolean;
  handleBack: () => void;
}

export const PracticeResults = ({
  timeElapsed,
  formatTime,
  calculateScore,
  questions,
  userAnswers,
  testResults,
  isSubmitting,
  handleBack
}: PracticeResultsProps) => {
  const renderTestResults = () => {
    if (!testResults) return null;

    return (
      <div className="space-y-6 mt-8">
        {/* Score Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Điểm số hiện tại
              </h3>
              <p className="text-3xl font-bold text-red-600">{testResults.currentScore}%</p>
              {testResults.previousScore !== null && (
                <p className="text-sm text-gray-500 mt-2">
                  Lần trước: {testResults.previousScore}%
                  {testResults.currentScore > testResults.previousScore ? (
                    <span className="text-green-500 ml-2">↑ Cải thiện!</span>
                  ) : testResults.currentScore < testResults.previousScore ? (
                    <span className="text-red-500 ml-2">↓ Giảm</span>
                  ) : (
                    <span className="text-gray-500 ml-2">→ Giữ nguyên</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                Nhận xét
              </h3>
              <p className="text-gray-700">{testResults.feedbackMessage}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Results */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lịch sử kiểm tra gần đây</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Ngày kiểm tra</th>
                    <th className="text-left py-2 px-4">Bài học</th>
                    <th className="text-left py-2 px-4">Điểm số</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.lastFiveResults.map((result, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-2 px-4">
                        {format(new Date(result.testDate), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="py-2 px-4">Bài {result.lessonId}</td>
                      <td className="py-2 px-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-sm",
                          result.scorePercentage >= 80 ? "bg-green-100 text-green-800" :
                          result.scorePercentage >= 60 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {result.scorePercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={handleBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Kết quả ôn tập</h2>
            <p className="text-gray-600">
              Thời gian hoàn thành: {formatTime(timeElapsed)}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Điểm số:</span>
              <span className="text-2xl font-bold text-red-600">
                {calculateScore()}%
              </span>
            </div>

            <Progress value={calculateScore()} className="h-3" />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-600 font-medium">Đúng</p>
                <p className="text-2xl font-bold text-green-700">
                  {
                    Object.entries(userAnswers).filter(
                      ([id, answer]) =>
                        answer.toLowerCase() ===
                        questions
                          .find((q) => q.id === id)
                          ?.correctAnswer.toLowerCase()
                    ).length
                  }
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-red-600 font-medium">Sai</p>
                <p className="text-2xl font-bold text-red-700">
                  {
                    Object.entries(userAnswers).filter(
                      ([id, answer]) =>
                        answer.toLowerCase() !==
                        questions
                          .find((q) => q.id === id)
                          ?.correctAnswer.toLowerCase()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          {isSubmitting ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang xử lý kết quả...</p>
            </div>
          ) : (
            renderTestResults()
          )}

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Chi tiết câu trả lời</h3>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 rounded-lg border space-y-2"
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      {userAnswers[question.id]?.toLowerCase() ===
                      question.correctAnswer.toLowerCase() ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        Câu {index + 1}: {question.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Câu trả lời của bạn: {userAnswers[question.id]}
                      </p>
                      {userAnswers[question.id]?.toLowerCase() !==
                        question.correctAnswer.toLowerCase() && (
                        <p className="text-sm text-green-600">
                          Đáp án đúng: {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Làm lại bài kiểm tra
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 