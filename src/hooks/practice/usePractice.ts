import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PracticeConfig, PracticeQuestion, UserAnswers, QuestionRefs } from '@/types/practice';
import type { LessonDetailType } from '@/models/LessonDetail';
import type { TestResultResponse } from '@/services/learning';
import { generateQuestions } from '@/services/learning/practiceService';
import { submitTestResult } from '@/services/learning';
import { AuthService } from '@/utils/AuthService';

export const usePractice = (config: PracticeConfig | undefined, lesson: LessonDetailType | undefined) => {
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<TestResultResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionRefs = useRef<QuestionRefs>({});

  useEffect(() => {
    if (!lesson || !config) {
      navigate('/');
      return;
    }

    const generatedQuestions = generateQuestions(lesson, config);
    setQuestions(generatedQuestions);
  }, [lesson, config, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        String(lesson?.id),
        score
      );
      
      setTestResults(results);
    } catch (error) {
      console.error('Error submitting test results:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowAnswer = (questionId: string) => {
    setShowAnswer(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return {
    userAnswers,
    questions,
    timeElapsed,
    isFinished,
    showAnswer,
    testResults,
    isSubmitting,
    questionRefs,
    formatTime,
    handleAnswer,
    handleBack,
    scrollToQuestion,
    getQuestionStatus,
    calculateScore,
    handleFinish,
    toggleShowAnswer
  };
}; 