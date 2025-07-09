import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { QuizAttemptQuestion } from '@/types/quiz';

interface QuizAttemptQuestionProps {
  question: QuizAttemptQuestion;
  parseQuestionType: (type: string) => { mainTopic: string; questionType: string };
  onAnswerSelect: (questionNumber: number, answer: string) => void;
}

export const QuizAttemptQuestionComponent: React.FC<QuizAttemptQuestionProps> = ({
  question,
  parseQuestionType,
  onAnswerSelect
}) => {
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
          <p className="text-sm font-medium text-gray-700">Chọn đáp án:</p>
          <div className="grid gap-2">
            {question.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = question.userAnswer === optionLetter;
              
              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  className={`flex items-center gap-2 p-4 h-auto justify-start ${
                    isSelected 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => onAnswerSelect(question.questionNumber, optionLetter)}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    isSelected 
                      ? 'bg-white text-blue-500' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {optionLetter}
                  </div>
                  <span className="flex-1 text-left">
                    {option}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
