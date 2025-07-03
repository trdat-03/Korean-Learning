import React from 'react';
import type { LessonDetailType } from '../../../models/LessonDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  Brain,
  Target,
  BookOpen,
  Clock,
  GraduationCap
} from 'lucide-react';
import GrammarPracticeComponent from './GrammarPracticeTab';
import { LearnTabContent } from './LearnTab';
import { ReviewTabContent } from './ReviewTab';
import { MatchingTabContent } from './MatchingTab';

interface LessonProps {
  lesson: LessonDetailType;
}

const Lesson: React.FC<LessonProps> = ({ lesson }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bài {lesson.orderNumber}: {lesson.title}
          </h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              <span>{lesson.vocabularyCount} từ vựng</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="learn" className="w-full">
        <TabsList className="flex w-full gap-2 bg-white p-1 rounded-lg">
          <TabsTrigger value="learn" className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all">
            <div className="flex flex-col items-center gap-2">
              <Brain className="w-5 h-5" />
              <span>Học</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="grammar" className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all">
            <div className="flex flex-col items-center gap-2">
              <Target className="w-5 h-5" />
              <span>Ngữ pháp</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="review" className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all">
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Ôn tập</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="matching" className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all">
            <div className="flex flex-col items-center gap-2">
              <Target className="w-5 h-5" />
              <span>Ghép từ</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="mt-6">
          <LearnTabContent lesson={lesson} />
        </TabsContent>

        <TabsContent value="grammar" className="mt-6">
          <GrammarPracticeComponent lesson={lesson} />
        </TabsContent>

        <TabsContent value="review" className="mt-6">
          <ReviewTabContent lesson={lesson} />
        </TabsContent>

        <TabsContent value="matching" className="mt-6">
          <MatchingTabContent lesson={lesson} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Lesson; 