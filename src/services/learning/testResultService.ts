import api from '@/services/api';

export interface TestResultResponse {
  currentScore: number;
  previousScore: number | null;
  feedbackMessage: string;
  lastFiveResults: {
    lessonId: string;
    scorePercentage: number;
    testDate: string;
  }[];
}

export const submitTestResult = async (
  userId: string,
  lessonId: string,
  scorePercentage: number
): Promise<TestResultResponse> => {
  const response = await api.post(
    `/test-results/submit-with-feedback?userId=${userId}&lessonId=${lessonId}&scorePercentage=${scorePercentage}`
  );
  return response.data;
};

export const testResultService = {
  submitTestResult,
};
