import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import type { ChatTopic } from '@/types/conversation';
import { conversationService } from '@/services/communication/conversationService';
import { AuthService } from '@/utils/AuthService';
import api from '@/services/api';

export const useChatTopics = () => {
  const [topics, setTopics] = useState<ChatTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = AuthService.getUser()?.id;

  useEffect(() => {
    const fetchTopics = async () => {
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/conversation/topics');
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
        if (error instanceof AxiosError) {
          setError(error.response?.data?.message || 'Failed to fetch chat topics');
        } else {
          setError('Failed to fetch chat topics');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [userId]);

  const handleStartChat = async (topic: ChatTopic) => {
    if (!userId) {
      setError('User not authenticated');
      navigate('/login');
      return;
    }

    try {
      const conversation = await conversationService.startConversation(
        userId,
        topic.id,
        topic.prompt
      );
      navigate(`/conversation/${conversation.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Failed to start chat');
      } else {
        setError('Failed to start chat');
      }
    }
  };

  return {
    topics,
    isLoading,
    error,
    handleStartChat,
  };
}; 