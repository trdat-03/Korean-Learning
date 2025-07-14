import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import type { Grammar } from '@/models/Grammar';
import type { LessonDetailType } from '@/models/LessonDetail';
import { useGrammarPractice } from '@/hooks/grammar/useGrammarPractice';
import type { GrammarFeedback } from '@/services/learning/grammarService';
import { useToast } from '@/components/ui/use-toast';
import { AlertAiUsageCount } from '@/components/ui/AlertAiUsageCount';

interface GrammarPracticeProps {
  lesson: LessonDetailType;
}

const GrammarPracticeComponent: React.FC<GrammarPracticeProps> = ({ lesson }) => {
  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<GrammarFeedback | null>(null);
  const { checkGrammarUsage, isLoading, error, aiUsageCount } = useGrammarPractice();
    const { toast } = useToast();

  const handleSubmit = async () => {

    if (!userInput.trim() || !selectedGrammar || !selectedGrammar.id) {
        toast({
          variant: "destructive",
          title: "Thiếu dữ liệu",
          description: "Vui lòng nhập câu và chọn ngữ pháp hợp lệ.",
        });
        return;
      }

      if ((aiUsageCount ?? 0) <= 0) {
      toast({
        variant: "destructive",
        title: "Hết lượt sử dụng AI",
        description: "Bạn đã hết lượt sử dụng AI. Vui lòng nâng cấp tài khoản để tiếp tục luyện tập. Hoặc đợi sang ngày mai để nhận lượt sử dụng miễn phí tiếp tục nhé.",
      });
      return;
    }
    
    const result = await checkGrammarUsage( selectedGrammar.id,userInput);
    
    if (result) {
      setFeedback(result);
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error
      });
    }
  };

  const resetPractice = () => {
    setUserInput('');
    setFeedback(null);
  };

  const backToSelection = () => {
    setSelectedGrammar(null);
    setUserInput('');
    setFeedback(null);
  };

  if (!lesson.grammars || lesson.grammars.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Chưa có ngữ pháp trong bài học này.</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedGrammar) {
    return (
      <div className="mt-6 space-y-6">
        <AlertAiUsageCount aiUsageCount={aiUsageCount || 0} />
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Chọn ngữ pháp để luyện tập</h3>
          <p className="text-gray-600">Chọn một ngữ pháp và thực hành với AI thông minh</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {lesson.grammars.map((grammar) => (
            <Card 
              key={grammar.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300"
              onClick={() => setSelectedGrammar(grammar)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {grammar.structure}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold text-blue-800">Ý nghĩa: </span>
                    <span className="text-gray-700">{grammar.meaning}</span>
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold text-green-800">Cách dùng: </span>
                    <span className="text-gray-700">{grammar.usageDescription}</span>
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold text-yellow-800">Ví dụ: </span>
                    <span className="text-gray-700 font-medium">{grammar.exampleSentence}</span>
                  </p>
                </div>
                <Button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Bắt đầu luyện tập
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={backToSelection}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          Đang luyện: {selectedGrammar.structure}
        </Badge>
      </div>

      <AlertAiUsageCount aiUsageCount={aiUsageCount || 0} />

      {/* Grammar Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {selectedGrammar.structure}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-1">Ý nghĩa:</p>
              <p className="text-gray-700">{selectedGrammar.meaning}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-1">Cách dùng:</p>
              <p className="text-gray-700">{selectedGrammar.usageDescription}</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <p className="text-sm font-semibold text-blue-700 mb-1">Ví dụ:</p>
            <p className="text-gray-800 font-medium">{selectedGrammar.exampleSentence}</p>
          </div>
        </CardContent>
      </Card>

      {/* Practice Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <MessageCircle className="h-5 w-5" />
            Thực hành với AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Viết một câu sử dụng ngữ pháp này:
            </label>
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Nhập câu của bạn ở đây..."
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSubmit}
              disabled={!userInput.trim() || isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang kiểm tra...
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Gửi để kiểm tra
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetPractice}
              disabled={isLoading}
            >
              Làm mới
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Feedback */}
      {feedback && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Sparkles className="h-5 w-5" />
              Phản hồi từ AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Accuracy */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border">
              {feedback.correct ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <div>
                <p className="font-semibold">
                  {feedback.correct ? 'Chính xác! 🎉' : 'Cần cải thiện 📝'}
                </p>
                <p className="text-sm text-gray-600">Câu gốc: "{feedback.originalSentence}"</p>
              </div>
            </div>

            {/* Feedback */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Nhận xét:
              </h4>
              <p className="text-gray-700">{feedback.feedback}</p>
            </div>

            {/* Corrected Sentence */}
            {feedback.correctedSentence && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Câu đã sửa:</h4>
                <p className="text-gray-800 font-medium">"{feedback.correctedSentence}"</p>
              </div>
            )}

            {/* Suggestions */}
            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Gợi ý:
                </h4>
                <ul className="space-y-1">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-yellow-600 font-bold">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Grammar Explanation */}
            {feedback.grammarExplanation && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Giải thích ngữ pháp:</h4>
                <p className="text-gray-700 whitespace-pre-line">{feedback.grammarExplanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GrammarPracticeComponent;