import React, { useState } from 'react';
import type { LessonDetailType } from '../models/LessonDetail';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Headphones,
  Mic,
  Volume2,
  Brain,
  Target,
  Clock,
  GraduationCap
} from 'lucide-react';
import './Lesson.css';
import PracticeTestConfig from './PracticeTestConfig';
import VocabularyMatchingConfig from './VocabularyMatchingConfig';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import { useNavigate } from 'react-router-dom';

interface LessonProps {
  lesson: LessonDetailType;
}

const Lesson: React.FC<LessonProps> = ({ lesson }) => {
  const [currentVocabularyIndex, setCurrentVocabularyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPracticeConfig, setShowPracticeConfig] = useState(false);
  const [showMatchingConfig, setShowMatchingConfig] = useState(false);
  const navigate = useNavigate();

  const currentVocabulary = lesson.vocabularies[currentVocabularyIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentVocabularyIndex((prev) =>
      prev === lesson.vocabularies.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentVocabularyIndex((prev) =>
      prev === 0 ? lesson.vocabularies.length - 1 : prev - 1
    );
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setCurrentVocabularyIndex(0);
  };

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

      {/* Description */}


      <Tabs defaultValue="learn" className="w-full">
        <TabsList className="flex w-full gap-2 bg-white p-1 rounded-lg">
          <TabsTrigger
            value="learn"
            className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <Brain className="w-5 h-5" />
              <span>Học</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="grammar"
            className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <Target className="w-5 h-5" />
              <span>Ngữ pháp</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="review"
            className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Ôn tập</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="matching"
            className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md py-3 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <Target className="w-5 h-5" />
              <span>Ghép từ</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="mt-6">
          {/* Vocabulary Flashcard */}
          {lesson.vocabularies.length === 0 ? (
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Thẻ từ vựng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500">Chưa có từ vựng nào trong bài học này.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Thẻ từ vựng</CardTitle>
              <p className="text-sm text-gray-500">
                {currentVocabularyIndex + 1} / {lesson.vocabularies.length}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flashcard */}
              <div className="relative">
                <div
                  className={`flashcard w-full h-64 bg-white rounded-lg border-2 border-red-200 cursor-pointer shadow-sm hover:shadow-md transition-all ${
                    isFlipped ? 'flipped' : ''
                  }`}
                  onClick={handleFlip}
                >
                  <div className="flashcard-inner">
                    <div className="flashcard-front">
                      <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        {currentVocabulary.wordKorean}
                      </h2>
                      <p className="text-lg text-gray-600">Nhấp để xem nghĩa</p>
                    </div>

                    <div className="flashcard-back">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        {currentVocabulary.wordVietnamese}
                      </h3>
                      <p className="text-lg text-gray-600 mb-4">
                        {currentVocabulary.wordKorean}
                      </p>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">Ví dụ:</p>
                        <p className="text-base text-gray-700">
                          {currentVocabulary.exampleSentence}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  className="w-10 h-10 hover:bg-red-50 hover:text-red-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleFlip}
                  className="px-6 hover:bg-red-50 hover:text-red-600"
                >
                  {isFlipped ? 'Xem từ' : 'Xem nghĩa'}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="w-10 h-10 hover:bg-red-50 hover:text-red-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Reset Button */}
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600"
                >
                  <RotateCcw className="w-4 h-4" />
                  Bắt đầu lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

          {/* Learning Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Công cụ học tập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20 hover:bg-red-50 hover:text-red-600"
                >
                  <Volume2 className="w-6 h-6" />
                  <span className="text-sm">Phát âm</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20 hover:bg-red-50 hover:text-red-600"
                >
                  <Mic className="w-6 h-6" />
                  <span className="text-sm">Ghi âm</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20 hover:bg-red-50 hover:text-red-600"
                >
                  <Headphones className="w-6 h-6" />
                  <span className="text-sm">Nghe</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20 hover:bg-red-50 hover:text-red-600"
                >
                  <BookOpen className="w-6 h-6" />
                  <span className="text-sm">Bài tập</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vocabulary List */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Danh sách từ vựng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {lesson.vocabularies.map((vocab, index) => (
                  <div
                    key={vocab.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      index === currentVocabularyIndex
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                    onClick={() => {
                      setCurrentVocabularyIndex(index);
                      setIsFlipped(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {vocab.wordKorean}
                          </h3>
                          <span className="text-lg text-gray-600">-</span>
                          <h4 className="text-lg text-gray-700">
                            {vocab.wordVietnamese}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {vocab.exampleSentence}
                        </p>
                      </div>
                      {index === currentVocabularyIndex && (
                        <Badge variant="destructive" className="ml-2">
                          Đang học
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grammar" className="mt-6">
          {lesson.grammars?.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Chưa có ngữ pháp trong bài học này.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lesson.grammars.map((grammar) => (
                <Card key={grammar.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{grammar.structure}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>
                      <span className="font-semibold text-gray-700">Ý nghĩa: </span>
                      {grammar.meaning}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Cách dùng: </span>
                      {grammar.usageDescription}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Ví dụ: </span>
                      {grammar.exampleSentence}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="review" className="mt-6">
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
            <Dialog open={showPracticeConfig} onOpenChange={setShowPracticeConfig}>
              <DialogTrigger asChild>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 group-hover:scale-105 transition-transform duration-300" />
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Ôn tập kiến thức</h3>
                    <p className="text-gray-600">
                      Kiểm tra kiến thức của bạn với các dạng bài tập đa dạng: trắc nghiệm, tự luận, và nhiều hơn nữa
                    </p>
                    <Button className="bg-red-600 hover:bg-red-700 text-white group-hover:scale-105 transition-transform duration-300">
                      Bắt đầu ôn tập
                    </Button>
                  </CardContent>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cấu hình ôn tập</DialogTitle>
                  <DialogDescription>
                    Tùy chỉnh các thiết lập cho phần ôn tập của bạn
                  </DialogDescription>
                </DialogHeader>
                <PracticeTestConfig lesson={lesson} onClose={() => setShowPracticeConfig(false)} />
              </DialogContent>
            </Dialog>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="mt-6">
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
            <Dialog open={showMatchingConfig} onOpenChange={setShowMatchingConfig}>
              <DialogTrigger asChild>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:scale-105 transition-transform duration-300" />
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Trò chơi ghép từ</h3>
                    <p className="text-gray-600">
                      Thử thách trí nhớ và phản xạ của bạn với trò chơi ghép từ tiếng Hàn - tiếng Việt thú vị
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105 transition-transform duration-300">
                      Chơi ngay
                    </Button>
                  </CardContent>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cấu hình trò chơi ghép từ</DialogTitle>
                  <DialogDescription>
                    Tùy chỉnh các thiết lập cho trò chơi ghép từ của bạn
                  </DialogDescription>
                </DialogHeader>
                <VocabularyMatchingConfig 
                  lesson={lesson} 
                  onClose={() => setShowMatchingConfig(false)} 
                  onStart={(count) => {
                    setShowMatchingConfig(false);
                    navigate(`/matching/${lesson.id}`, {
                      state: { lesson, vocabularyCount: count }
                    });
                  }}
                />
              </DialogContent>
            </Dialog>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Lesson; 