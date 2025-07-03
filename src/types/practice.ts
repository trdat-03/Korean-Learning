export interface PracticeConfig {
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

export interface PracticeQuestion {
  id: string;
  type: 'flashcard' | 'multipleChoice' | 'written' | 'trueFalse';
  question: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
}

export interface UserAnswers {
  [key: string]: string;
}

export interface QuestionRefs {
  [key: string]: HTMLDivElement;
}

export interface ShowAnswer {
  [key: string]: boolean;
} 