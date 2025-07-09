import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { LessonDetailType } from '../../models/LessonDetail';

interface VocabularyMatchingConfigProps {
  lesson: LessonDetailType;
  onClose: () => void;
  onStart: (count: number) => void;
}

const MatchingConfig = ({ lesson, onClose, onStart }: VocabularyMatchingConfigProps) => {
  const [vocabularyCount, setVocabularyCount] = useState(5);

  const handleStartMatching = () => {
    onStart(vocabularyCount);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Cấu hình trò chơi ghép từ</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="vocabularyCount">Số lượng từ vựng</Label>
            <Input
              id="vocabularyCount"
              type="number"
              min={1}
              max={lesson.vocabularies.length}
              value={vocabularyCount}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                const capped = Math.min(value, lesson.vocabularies.length);
                setVocabularyCount(capped);
              }}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Tối đa: {lesson.vocabularies.length} từ vựng
            </p>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleStartMatching}
            >
              Bắt đầu
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingConfig; 