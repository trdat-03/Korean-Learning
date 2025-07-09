import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuizQuestion } from './QuizQuestion';
import { Calendar, FileText, Hash } from 'lucide-react';
import type { QuizResponse } from '@/types/quiz';

interface QuizResultsProps {
  quiz: QuizResponse;
  parseQuestionType: (type: string) => { mainTopic: string; questionType: string };
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  parseQuestionType
}) => {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div id="quiz-results" className="space-y-6">
      {/* Quiz Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bài kiểm tra đã tạo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Khóa học</p>
                <p className="font-medium">{quiz.courseTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Số câu hỏi</p>
                <Badge variant="outline" className="text-sm">
                  {quiz.totalQuestions} câu
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Thời gian tạo</p>
                <p className="text-sm font-medium">{formatDate(quiz.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Questions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Danh sách câu hỏi ({quiz.questions.length})
        </h3>
        
        <div className="space-y-4">
          {quiz.questions.map((question) => (
            <QuizQuestion
              key={question.questionNumber}
              question={question}
              parseQuestionType={parseQuestionType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
