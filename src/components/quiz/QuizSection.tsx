import React from 'react';
import { QuizGenerator } from './QuizGenerator';
import { useQuiz } from '@/hooks/quiz/useQuiz';

interface QuizSectionProps {
  courseId: number;
  courseTitle: string;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  courseId,
  courseTitle
}) => {
  const {
    loading,
    error,
    generateQuiz,
    retryQuiz
  } = useQuiz();

  return (
    <div className="space-y-6">
      <QuizGenerator
        courseId={courseId}
        courseTitle={courseTitle}
        loading={loading}
        error={error}
        onGenerate={generateQuiz}
        onRetry={retryQuiz}
      />
    </div>
  );
};
