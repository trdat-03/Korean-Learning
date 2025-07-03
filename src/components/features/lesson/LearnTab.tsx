import React, { useState } from 'react';
import type { LessonDetailType } from '../../../models/LessonDetail';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface LearnTabContentProps {
  lesson: LessonDetailType;
}

export const LearnTabContent: React.FC<LearnTabContentProps> = ({ lesson }) => {
  const [currentVocabularyIndex, setCurrentVocabularyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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

  return (
    <div className="space-y-6">
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
          <CardContent>
            <div
              className={`flashcard w-full h-64 bg-white rounded-lg border-2 border-red-200 cursor-pointer shadow-sm hover:shadow-md transition-all ${
                isFlipped ? 'flipped' : ''
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
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
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" onClick={handlePrevious}>Trước</Button>
              <Button variant="outline" onClick={() => setIsFlipped(!isFlipped)}>
                {isFlipped ? 'Xem từ' : 'Xem nghĩa'}
              </Button>
              <Button variant="outline" onClick={handleNext}>Tiếp</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vocabulary List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách từ vựng</CardTitle>
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
                  <div>
                    <h3 className="text-xl font-semibold">{vocab.wordKorean}</h3>
                    <p className="text-gray-600">{vocab.wordVietnamese}</p>
                    <p className="text-sm text-gray-500 mt-1">{vocab.exampleSentence}</p>
                  </div>
                  {index === currentVocabularyIndex && (
                    <Badge variant="destructive">Đang học</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 