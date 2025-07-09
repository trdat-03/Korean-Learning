export interface Question {
  questionNumber: number;
  type: string;
  questionText: string;
  context: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResponse {
  courseTitle: string;
  courseId: number;
  totalQuestions: number;
  createdAt: string;
  questions: Question[];
}

export interface ParsedQuestionType {
  mainTopic: string;
  questionType: string;
}

export interface QuizState {
  data: QuizResponse | null;
  loading: boolean;
  error: string | null;
}

export interface QuizError {
  status: number;
  message: string;
}

// Interfaces cho quiz attempt (làm bài)
export interface QuizAttempt {
  quizId: string;
  courseId: number;
  courseTitle: string;
  questions: QuizAttemptQuestion[];
  startTime: string;
  timeLimit?: number; // phút
}

export interface QuizAttemptQuestion {
  questionNumber: number;
  type: string;
  questionText: string;
  context: string;
  options: string[];
  userAnswer?: string;
}

export interface QuizSubmission {
  quizId: string;
  answers: { questionNumber: number; answer: string }[];
  timeSpent: number; // giây
}

export interface QuizResult {
  quizId: string;
  courseTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // phần trăm
  timeSpent: number;
  answers: QuizResultAnswer[];
}

export interface QuizResultAnswer {
  questionNumber: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}
