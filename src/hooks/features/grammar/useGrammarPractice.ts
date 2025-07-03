import { useState, useEffect } from 'react';
import { grammarService, type CheckGrammarRequest } from '@/services/features/grammarService';
import { userService } from '@/services/features/userService';
import { AuthService } from '@/utils/AuthService';

export const useGrammarPractice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiUsageCount, setAiUsageCount] = useState<number | null>(null);

  const fetchAiUsageCount = async () => {
    const user = AuthService.getUser();
    if (user && user.id) {
      try {
        const count = await userService.getAiUsageCount(user.id);
        setAiUsageCount(count);
      } catch {
        // Có thể xử lý lỗi ở đây nếu muốn
      }
    }
  };

  useEffect(() => {
    fetchAiUsageCount();
  }, []);

  const checkGrammarUsage = async ( grammarId: number, userSentence: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = AuthService.getUser();

      const data: CheckGrammarRequest = {
         grammarId,
         userId: user?.id || 0, 
         userSentence
      };
      const response = await grammarService.checkGrammarUsage(data);
      
      // Sau khi check thành công, fetch lại aiUsageCount từ backend
      if (response) {
        await fetchAiUsageCount();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi kiểm tra ngữ pháp';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkGrammarUsage,
    isLoading,
    error,
    aiUsageCount,
    fetchAiUsageCount
  };
}; 