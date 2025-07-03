import api from '../api';

export interface GrammarFeedback {
  originalSentence: string;
  feedback: string;
  correctedSentence: string;
  suggestions: string[];
  grammarExplanation: string;
  correct: boolean;
}

export interface CheckGrammarRequest {
  grammarId: number;
  userId: number;
  userSentence: string;
}

export const grammarService = {
  checkGrammarUsage: async (data: CheckGrammarRequest): Promise<GrammarFeedback> => {
    const response = await api.post<GrammarFeedback>('/grammar-practice/check', data);
    return response.data;
  },

  // Add more grammar-related API calls here if needed
}; 