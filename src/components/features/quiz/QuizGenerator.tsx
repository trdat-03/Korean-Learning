import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, RefreshCw } from 'lucide-react';

interface QuizGeneratorProps {
  courseId: number;
  courseTitle: string;
  loading: boolean;
  error: string | null;
  onGenerate: (courseId: number) => void;
  onRetry: (courseId: number) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  courseId,
  courseTitle,
  loading,
  error,
  onGenerate,
  onRetry
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Tạo bài kiểm tra
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Khóa học:</p>
          <Badge variant="outline" className="text-sm">
            {courseTitle}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Hệ thống sẽ tự động tạo <strong>40 câu hỏi</strong> dựa trên nội dung khóa học.
          </p>
          <p className="text-xs text-gray-500">
            Bài kiểm tra sẽ bao gồm các dạng câu hỏi về từ vựng và ngữ pháp.
          </p>
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                💡 Quá trình tạo bài kiểm tra có thể mất 1-2 phút. Vui lòng không tắt trang.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700 mb-2">{error}</p>
            <Button
              onClick={() => onRetry(courseId)}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Thử lại
            </Button>
          </div>
        )}

        <Button
          onClick={() => onGenerate(courseId)}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Đang tạo bài kiểm tra...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Tạo bài kiểm tra
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
