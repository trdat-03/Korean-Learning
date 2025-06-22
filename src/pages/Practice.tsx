import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Timer, CheckCircle2, XCircle, ArrowLeft, Circle, TrendingUp, MessageSquare } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import type { LessonDetailType } from '../models/LessonDetail';
import { AuthService } from "@/utils/AuthService";
import type { Vocabulary } from '../models/Vocabulary';
import type { Grammar } from '../models/Grammar';
import { cn } from '../lib/utils';
import { shuffle } from '../lib/utils';
import { submitTestResult, type TestResultResponse } from '../services/api';
import { format } from 'date-fns';

interface PracticeConfig {
  examDate: string;
  questionCount: number;
  types: {
    multipleChoice: boolean;
    written: boolean;
    trueFalse: boolean;
  };
  format: {
    answerWithTerm: boolean;
    answerWithDefinition: boolean;
  };
}

interface PracticeQuestion {
  id: string;
  type: 'flashcard' | 'multipleChoice' | 'written' | 'trueFalse';
  question: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
}

const Practice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { config, lesson }: { config: PracticeConfig; lesson: LessonDetailType } = location.state || {};
  const questionRefs = useRef<Record<string, HTMLDivElement>>({});

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<TestResultResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tạo câu hỏi dựa trên cấu hình và dữ liệu bài học
  useEffect(() => {
    if (!lesson || !config) {
      navigate('/');
      return;
    }

    const { vocabularies, grammars } = lesson;
    const allVocabs = [...vocabularies];
    const allGrammars = grammars || [];

    // Tạo pool câu hỏi từ từ vựng
    const vocabQuestionPool: PracticeQuestion[] = [];


    // Tạo câu hỏi trắc nghiệm
    if (config.types.multipleChoice) {
      allVocabs.forEach((vocab: Vocabulary) => {
        // Lấy ngẫu nhiên 3 từ vựng khác làm đáp án nhiễu
        const otherOptions = shuffle(
          allVocabs.filter((v: Vocabulary) => v.id !== vocab.id)
        ).slice(0, 3);

        if (config.format.answerWithTerm) {
          vocabQuestionPool.push({
            id: `mc-term-${vocab.id}`,
            type: 'multipleChoice',
            question: `Từ nào có nghĩa là "${vocab.wordVietnamese}"?`,
            correctAnswer: vocab.wordKorean,
            options: shuffle([
              vocab.wordKorean,
              ...otherOptions.map((o: Vocabulary) => o.wordKorean),
            ]),
          });
        }
        if (config.format.answerWithDefinition) {
          vocabQuestionPool.push({
            id: `mc-def-${vocab.id}`,
            type: 'multipleChoice',
            question: `"${vocab.wordKorean}" có nghĩa là gì?`,
            correctAnswer: vocab.wordVietnamese,
            options: shuffle([
              vocab.wordVietnamese,
              ...otherOptions.map((o: Vocabulary) => o.wordVietnamese),
            ]),
          });
        }
      });
    }

    // Tạo câu hỏi tự luận
    if (config.types.written) {
      allVocabs.forEach((vocab: Vocabulary) => {
        if (config.format.answerWithTerm) {
          vocabQuestionPool.push({
            id: `written-term-${vocab.id}`,
            type: 'written',
            question: `Viết từ tiếng Hàn có nghĩa là "${vocab.wordVietnamese}"`,
            correctAnswer: vocab.wordKorean,
          });
        }
        if (config.format.answerWithDefinition) {
          vocabQuestionPool.push({
            id: `written-def-${vocab.id}`,
            type: 'written',
            question: `Viết nghĩa tiếng Việt của từ "${vocab.wordKorean}"`,
            correctAnswer: vocab.wordVietnamese,
          });
        }
      });
    }

    // Tạo câu hỏi đúng/sai
    if (config.types.trueFalse) {
      allVocabs.forEach((vocab: Vocabulary) => {
        // Tạo câu đúng
        vocabQuestionPool.push({
          id: `tf-correct-${vocab.id}`,
          type: 'trueFalse',
          question: `"${vocab.wordKorean}" có nghĩa là "${vocab.wordVietnamese}"`,
          correctAnswer: 'true',
        });

        // Tạo câu sai bằng cách ghép với nghĩa của từ khác
        const wrongVocab = allVocabs.find((v: Vocabulary) => v.id !== vocab.id);
        if (wrongVocab) {
          vocabQuestionPool.push({
            id: `tf-wrong-${vocab.id}`,
            type: 'trueFalse',
            question: `"${vocab.wordKorean}" có nghĩa là "${wrongVocab.wordVietnamese}"`,
            correctAnswer: 'false',
          });
        }
      });
    }

    // Tạo câu hỏi từ ngữ pháp
    const grammarQuestionPool: PracticeQuestion[] = [];
    if (allGrammars.length > 0) {
      allGrammars.forEach((grammar: Grammar) => {
        // Câu hỏi trắc nghiệm về cấu trúc ngữ pháp
        if (config.types.multipleChoice) {
          grammarQuestionPool.push({
            id: `grammar-mc-${grammar.id}`,
            type: 'multipleChoice',
            question: `Cấu trúc ngữ pháp nào được sử dụng để ${grammar.meaning}?`,
            correctAnswer: grammar.structure,
            options: shuffle([
              grammar.structure,
              ...allGrammars
                .filter((g: Grammar) => g.id !== grammar.id)
                .slice(0, 3)
                .map((g: Grammar) => g.structure),
            ]),
          });
        }

        // Câu hỏi tự luận về ngữ pháp
        if (config.types.written) {
          grammarQuestionPool.push({
            id: `grammar-written-${grammar.id}`,
            type: 'written',
            question: `Viết cấu trúc ngữ pháp được sử dụng để ${grammar.meaning}`,
            correctAnswer: grammar.structure,
            hint: grammar.usageDescription,
          });
        }
      });
    }

    // Kết hợp và xáo trộn tất cả câu hỏi
    const allQuestions = shuffle([...vocabQuestionPool, ...grammarQuestionPool]);
    
    // Lấy số lượng câu hỏi theo cấu hình
    const finalQuestions = allQuestions.slice(0, config.questionCount);
    setQuestions(finalQuestions);
  }, [lesson, config, navigate]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const scrollToQuestion = (questionId: string) => {
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const getQuestionStatus = (questionId: string) => {
    if (!userAnswers[questionId]) return 'unanswered';
    if (userAnswers[questionId].toLowerCase() === questions.find(q => q.id === questionId)?.correctAnswer.toLowerCase()) {
      return 'correct';
    }
    return 'incorrect';
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleFinish = async () => {
    setIsFinished(true);
    setIsSubmitting(true);
    
    try {
      const score = calculateScore();
      const userId = AuthService.getUser().id;
      
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const results = await submitTestResult(
        userId,
        String(lesson.id),
        score
      );
      
      setTestResults(results);
    } catch (error) {
      console.error('Error submitting test results:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTestResults = () => {
    if (!testResults) return null;

    return (
      <div className="space-y-6 mt-8">
        {/* Score Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Điểm số hiện tại
              </h3>
              <p className="text-3xl font-bold text-red-600">{testResults.currentScore}%</p>
              {testResults.previousScore !== null && (
                <p className="text-sm text-gray-500 mt-2">
                  Lần trước: {testResults.previousScore}%
                  {testResults.currentScore > testResults.previousScore ? (
                    <span className="text-green-500 ml-2">↑ Cải thiện!</span>
                  ) : testResults.currentScore < testResults.previousScore ? (
                    <span className="text-red-500 ml-2">↓ Giảm</span>
                  ) : (
                    <span className="text-gray-500 ml-2">→ Giữ nguyên</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                Nhận xét
              </h3>
              <p className="text-gray-700">{testResults.feedbackMessage}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Results */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lịch sử kiểm tra gần đây</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Ngày kiểm tra</th>
                    <th className="text-left py-2 px-4">Bài học</th>
                    <th className="text-left py-2 px-4">Điểm số</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.lastFiveResults.map((result, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-2 px-4">
                        {format(new Date(result.testDate), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="py-2 px-4">Bài {result.lessonId}</td>
                      <td className="py-2 px-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-sm",
                          result.scorePercentage >= 80 ? "bg-green-100 text-green-800" :
                          result.scorePercentage >= 60 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {result.scorePercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderQuestion = (question: PracticeQuestion) => {
    switch (question.type) {
      case 'multipleChoice':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium mb-4">{question.question}</p>
            <RadioGroup
              value={userAnswers[question.id] || ''}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-option-${index}`} />
                  <Label htmlFor={`${question.id}-option-${index}`}>{option}</Label>
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
              value={userAnswers[question.id] || ''}
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
              value={userAnswers[question.id] || ''}
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
            onClick={() => setShowAnswer(prev => ({ ...prev, [question.id]: !prev[question.id] }))}
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

  if (isFinished) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Kết quả ôn tập</h2>
              <p className="text-gray-600">
                Thời gian hoàn thành: {formatTime(timeElapsed)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Điểm số:</span>
                <span className="text-2xl font-bold text-red-600">
                  {calculateScore()}%
                </span>
              </div>

              <Progress value={calculateScore()} className="h-3" />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-medium">Đúng</p>
                  <p className="text-2xl font-bold text-green-700">
                    {
                      Object.entries(userAnswers).filter(
                        ([id, answer]) =>
                          answer.toLowerCase() ===
                          questions
                            .find((q) => q.id === id)
                            ?.correctAnswer.toLowerCase()
                      ).length
                    }
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-600 font-medium">Sai</p>
                  <p className="text-2xl font-bold text-red-700">
                    {
                      Object.entries(userAnswers).filter(
                        ([id, answer]) =>
                          answer.toLowerCase() !==
                          questions
                            .find((q) => q.id === id)
                            ?.correctAnswer.toLowerCase()
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            {isSubmitting ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Đang xử lý kết quả...</p>
              </div>
            ) : (
              renderTestResults()
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Chi tiết câu trả lời</h3>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-4 rounded-lg border space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-1">
                        {userAnswers[question.id]?.toLowerCase() ===
                        question.correctAnswer.toLowerCase() ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          Câu {index + 1}: {question.question}
                        </p>
                        <p className="text-sm text-gray-600">
                          Câu trả lời của bạn: {userAnswers[question.id]}
                        </p>
                        {userAnswers[question.id]?.toLowerCase() !==
                          question.correctAnswer.toLowerCase() && (
                          <p className="text-sm text-green-600">
                            Đáp án đúng: {question.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Làm lại bài kiểm tra
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Sidebar */}
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

        {/* Main content */}
        <div className="flex-1">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                ref={el => {
                  if (el) questionRefs.current[question.id] = el;
                }}
                className="scroll-mt-4"
              >
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
                    {renderQuestion(question)}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice; 