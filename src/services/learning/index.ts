// Export all learning services
export { courseService } from './courseService';
export { flashcardService } from './flashcardService';
export { grammarService } from './grammarService';
export { lessonService } from './lessonService';
export { generateQuestions } from './practiceService';
export { quizService } from './quizService';
export { testResultService, submitTestResult } from './testResultService';
export type { TestResultResponse } from './testResultService';
export { vocabularyAnalysisService } from './vocabularyAnalysisService';
export { generateMatchingItems, checkMatch } from './vocabularyMatchingService';
