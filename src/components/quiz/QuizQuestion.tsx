import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import type { Question } from '@/types/quiz';

interface QuizQuestionProps {
  question: Question;
  parseQuestionType: (type: string) => { mainTopic: string; questionType: string };
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  parseQuestionType
}) => {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const { mainTopic, questionType } = parseQuestionType(question.type);

  const getTopicColor = (topic: string) => {
    switch (topic.toLowerCase()) {
      case 'từ vựng':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ngữ pháp':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            Câu {question.questionNumber}
          </CardTitle>
          <div className="flex flex-col gap-1 items-end">
            <Badge className={getTopicColor(mainTopic)}>
              {mainTopic}
            </Badge>
            {questionType && (
              <span className="text-xs text-gray-500 italic">
                {questionType}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Ngữ cảnh */}
        {question.context && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Ngữ cảnh:</p>
            <p className="text-sm text-gray-600">{question.context}</p>
          </div>
        )}

        {/* Câu hỏi */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Câu hỏi:</p>
          <p className="text-base">{question.questionText}</p>
        </div>

        {/* Các lựa chọn */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Lựa chọn:</p>
          <div className="grid gap-2">
            {question.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isCorrect = question.correctAnswer === optionLetter;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-3 rounded-lg border ${
                    isCorrect 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCorrect 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {optionLetter}
                  </div>
                  <span className={`flex-1 ${isCorrect ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                    {option}
                  </span>
                  {isCorrect && (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Đáp án đúng */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm font-medium text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Đáp án đúng: {question.correctAnswer}
          </p>
        </div>

        {/* Giải thích */}
        <Collapsible open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-sm font-medium text-gray-700">Giải thích</span>
              {isExplanationOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">{question.explanation}</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
