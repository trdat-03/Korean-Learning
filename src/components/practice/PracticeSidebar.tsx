import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timer, CheckCircle2, XCircle, ArrowLeft, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PracticeQuestion } from '@/types/practice';

interface PracticeSidebarProps {
  questions: PracticeQuestion[];
  userAnswers: Record<string, string>;
  timeElapsed: number;
  formatTime: (seconds: number) => string;
  handleBack: () => void;
  scrollToQuestion: (questionId: string) => void;
  getQuestionStatus: (questionId: string) => string;
  handleFinish: () => void;
}

export const PracticeSidebar = ({
  questions,
  userAnswers,
  timeElapsed,
  formatTime,
  handleBack,
  scrollToQuestion,
  getQuestionStatus,
  handleFinish
}: PracticeSidebarProps) => {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="sticky top-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
              <div className="flex items-center gap-2 text-gray-600">
                <Timer className="w-4 h-4" />
                <span className="text-sm">{formatTime(timeElapsed)}</span>
              </div>
            </div>

            <div className="mb-4">
              <Progress
                value={(Object.keys(userAnswers).length / questions.length) * 100}
                className="h-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                {Object.keys(userAnswers).length} / {questions.length} câu hỏi
              </p>
            </div>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-2">
                {questions.map((question, index) => {
                  const status = getQuestionStatus(question.id);
                  return (
                    <Button
                      key={question.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2",
                        status === 'correct' && "text-green-600",
                        status === 'incorrect' && "text-red-600"
                      )}
                      onClick={() => scrollToQuestion(question.id)}
                    >
                      {status === 'correct' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : status === 'incorrect' ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      Câu {index + 1}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>

            <Button 
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleFinish}
            >
              Kết thúc bài kiểm tra
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 