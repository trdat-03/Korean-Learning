import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { PracticeQuestion as PracticeQuestionType } from '@/types/practice';

interface PracticeQuestionProps {
  question: PracticeQuestionType;
  index: number;
  userAnswer: string;
  showAnswer: Record<string, boolean>;
  getQuestionStatus: (questionId: string) => string;
  handleAnswer: (questionId: string, answer: string) => void;
  toggleShowAnswer: (questionId: string) => void;
}

export const PracticeQuestion = ({
  question,
  index,
  userAnswer,
  showAnswer,
  getQuestionStatus,
  handleAnswer,
  toggleShowAnswer
}: PracticeQuestionProps) => {
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multipleChoice':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium mb-4">{question.question}</p>
            <RadioGroup
              value={userAnswer || ''}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-option-${optionIndex}`} />
                  <Label htmlFor={`${question.id}-option-${optionIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'written':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium mb-4">{question.question}</p>
            {question.hint && (
              <p className="text-sm text-gray-500 italic">Gợi ý: {question.hint}</p>
            )}
            <Input
              value={userAnswer || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Nhập câu trả lời của bạn..."
            />
          </div>
        );

      case 'trueFalse':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium mb-4">{question.question}</p>
            <RadioGroup
              value={userAnswer || ''}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${question.id}-true`} />
                <Label htmlFor={`${question.id}-true`}>Đúng</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${question.id}-false`} />
                <Label htmlFor={`${question.id}-false`}>Sai</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 'flashcard':
        return (
          <div
            className="cursor-pointer"
            onClick={() => toggleShowAnswer(question.id)}
          >
            <Card className="h-64 relative perspective">
              <div
                className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                  showAnswer[question.id] ? 'rotate-y-180' : ''
                }`}
              >
                <CardContent className="absolute w-full h-full backface-hidden flex items-center justify-center p-6">
                  <p className="text-2xl font-medium text-center">
                    {question.question}
                  </p>
                </CardContent>
                <CardContent className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 bg-red-50">
                  <p className="text-2xl font-medium text-center">
                    {question.correctAnswer}
                  </p>
                </CardContent>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Câu {index + 1}</h3>
          {getQuestionStatus(question.id) === 'correct' ? (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Đúng
            </span>
          ) : getQuestionStatus(question.id) === 'incorrect' ? (
            <span className="text-red-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              Sai
            </span>
          ) : null}
        </div>
        {renderQuestionContent()}
      </CardContent>
    </Card>
  );
}; 