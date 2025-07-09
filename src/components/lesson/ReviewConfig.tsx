import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';
import type { LessonDetailType } from '../../models/LessonDetail';

interface ReviewConfigProps {
  lesson: LessonDetailType;
  onClose: () => void;
}

const ReviewConfig: React.FC<ReviewConfigProps> = ({ lesson, onClose }) => {
  const navigate = useNavigate();
  const [config, setConfig] = React.useState({
    examDate: new Date().toISOString().split('T')[0],
    questionCount: 10,
    types: {
      multipleChoice: true,
      written: true,
      trueFalse: true,
    },
    format: {
      answerWithTerm: true,
      answerWithDefinition: true,
    },
  });

  const handleStartPractice = () => {
    navigate(`/practice/${lesson.id}`, {
      state: { config, lesson },
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Tùy chọn ôn tập</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Test Length Section */}
        <div className="space-y-4">
          <Label htmlFor="questionCount">Số lượng câu hỏi</Label>
          <Input
            id="questionCount"
            type="number"
            min={1}
            max={lesson.vocabularies.length}
            value={config.questionCount}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              const capped = Math.min(value, lesson.vocabularies.length);
              setConfig((prev) => ({
                ...prev,
                questionCount: capped,
              }));
            }}
          />
          <p className="text-sm text-gray-500">
            Tối đa: {lesson.vocabularies.length} từ vựng
          </p>
        </div>

        {/* Question Types Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Loại câu hỏi</h3>
          <div className="grid gap-4">
            {Object.entries(config.types).map(([type, enabled]) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({
                      ...prev,
                      types: {
                        ...prev.types,
                        [type]: checked === true,
                      },
                    }))
                  }
                />
                <Label htmlFor={type} className="capitalize">
                  {type === 'multipleChoice'
                    ? 'Trắc nghiệm'
                    : type === 'written'
                    ? 'Tự luận'
                    : 'Đúng/Sai'}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Answer Format Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Định dạng câu trả lời</h3>
          <div className="grid gap-4">
            {Object.entries(config.format).map(([format, enabled]) => (
              <div key={format} className="flex items-center space-x-2">
                <Checkbox
                  id={format}
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({
                      ...prev,
                      format: {
                        ...prev.format,
                        [format]: checked === true,
                      },
                    }))
                  }
                />
                <Label htmlFor={format}>
                  {format === 'answerWithTerm'
                    ? 'Trả lời bằng từ tiếng Hàn'
                    : 'Trả lời bằng nghĩa tiếng Việt'}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            onClick={handleStartPractice}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Bắt đầu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};



export default ReviewConfig; 