import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { LessonDetailType } from '../../models/LessonDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import {
  Brain,
  Target,
  BookOpen,
  Clock,
  GraduationCap,
  Lock
} from 'lucide-react';
import GrammarPracticeComponent from './GrammarPracticeTab';
import { LearnTabContent } from './LearnTab';
import { ReviewTabContent } from './ReviewTab';
import { MatchingTabContent } from './MatchingTab';

interface LessonProps {
  lesson: LessonDetailType;
  isPreview?: boolean;
  courseId?: number;
}

const Lesson: React.FC<LessonProps> = ({ lesson, isPreview = false, courseId }) => {
  const navigate = useNavigate();
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
          
          <TabsTrigger 
            value="grammar" 
            className={`flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all ${
              isPreview ? 'opacity-75' : ''
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <Target className="w-5 h-5" />
                {isPreview && <Lock className="w-3 h-3 absolute -top-1 -right-1 text-gray-400" />}
              </div>
              <span>Ngữ pháp</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="review" 
            className={`flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all ${
              isPreview ? 'opacity-75' : ''
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <BookOpen className="w-5 h-5" />
                {isPreview && <Lock className="w-3 h-3 absolute -top-1 -right-1 text-gray-400" />}
              </div>
              <span>Ôn tập</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="matching" 
            className={`flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all ${
              isPreview ? 'opacity-75' : ''
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <Target className="w-5 h-5" />
                {isPreview && <Lock className="w-3 h-3 absolute -top-1 -right-1 text-gray-400" />}
              </div>
              <span>Ghép từ</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="mt-6">
          <LearnTabContent lesson={lesson} />
        </TabsContent>

        <TabsContent value="grammar" className="mt-6">
          {isPreview ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="flex flex-col items-center gap-4">
                <Lock className="w-16 h-16 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600">Tính năng bị khóa</h3>
                <p className="text-gray-500 max-w-md">
                  Tính năng Ngữ pháp chỉ dành cho thành viên đã đăng ký. Hãy đăng ký khóa học để trải nghiệm đầy đủ.
                </p>
                <Button 
                  onClick={() => courseId && navigate(`/courses/${courseId}`)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Đăng ký khóa học ngay
                </Button>
              </div>
            </div>
          ) : (
            <GrammarPracticeComponent lesson={lesson} />
          )}
        </TabsContent>

        <TabsContent value="review" className="mt-6">
          {isPreview ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="flex flex-col items-center gap-4">
                <Lock className="w-16 h-16 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600">Tính năng bị khóa</h3>
                <p className="text-gray-500 max-w-md">
                  Tính năng Ôn tập chỉ dành cho thành viên đã đăng ký. Hãy đăng ký khóa học để trải nghiệm đầy đủ.
                </p>
                <Button 
                  onClick={() => courseId && navigate(`/courses/${courseId}`)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Đăng ký khóa học ngay
                </Button>
              </div>
            </div>
          ) : (
            <ReviewTabContent lesson={lesson} />
          )}
        </TabsContent>

        <TabsContent value="matching" className="mt-6">
          {isPreview ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="flex flex-col items-center gap-4">
                <Lock className="w-16 h-16 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600">Tính năng bị khóa</h3>
                <p className="text-gray-500 max-w-md">
                  Tính năng Ghép từ chỉ dành cho thành viên đã đăng ký. Hãy đăng ký khóa học để trải nghiệm đầy đủ.
                </p>
                <Button 
                  onClick={() => courseId && navigate(`/courses/${courseId}`)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Đăng ký khóa học ngay
                </Button>
              </div>
            </div>
          ) : (
            <MatchingTabContent lesson={lesson} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Lesson; 