import React from 'react';
import type {LessonDetailType} from '../models/LessonDetail';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Book, Clock, GraduationCap, User } from 'lucide-react';

interface LessonListProps {
  lessons: LessonDetailType[];
  selectedLessonId: number;
  onSelectLesson: (lesson: LessonDetailType) => void;
}

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  selectedLessonId,
  onSelectLesson,
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Nội dung khóa học</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>Giảng viên: Alice Teacher</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Book className="w-4 h-4" />
          <span>{lessons.length} bài học</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`p-4 cursor-pointer transition-all hover:bg-red-50 ${
                selectedLessonId === lesson.id
                  ? 'bg-red-100 border-l-4 border-red-600'
                  : ''
              }`}
              onClick={() => onSelectLesson(lesson)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  Bài {lesson.orderNumber}: {lesson.title}
                </h3>
                <Badge
                  variant={selectedLessonId === lesson.id ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {lesson.level}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>{lesson.vocabularyCount} từ vựng</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonList; 