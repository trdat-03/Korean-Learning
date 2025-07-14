import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Conversation, Message, MessageResponse, ChatTopic } from '@/types/conversation';
import { conversationService } from '@/services/communication/conversationService';
import { AuthService } from '@/utils/AuthService';
import { userService } from '@/services/system/userService';
import api from '@/services/api';

export const useConversation = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<Record<string, ChatTopic>>({});
  const [error, setError] = useState<string | null>(null);
  const [aiUsageCount, setAiUsageCount] = useState<number | null>(null);
  const { conversationId } = useParams();
  const userId = AuthService.getUser()?.id;

  // Utility function to ensure unique conversations
  const ensureUniqueConversations = (conversations: Conversation[]) => {
    return conversations.filter((conv, index, self) => 
      index === self.findIndex(c => c.id === conv.id)
    );
  };

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

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data } = await api.get<ChatTopic[]>('/conversation/topics');
        const topicsMap = data.reduce((acc, topic) => {
          acc[topic.id] = topic;
          return acc;
        }, {} as Record<string, ChatTopic>);
        setTopics(topicsMap);
      } catch {
        setError('Failed to fetch topics');
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      try {
        const response = await conversationService.getUserConversations(userId);
        const convertedConversations = response.map(conv => ({
          ...conv,
          messages: conv.messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            senderType: msg.senderType,
            timestamp: new Date(msg.createdAt)
          }))
        }));

        const uniqueConversations = ensureUniqueConversations(convertedConversations);
        setConversations(uniqueConversations);
        
        if (conversationId) {
          const conversation = uniqueConversations.find(conv => conv.id === conversationId);
          if (conversation) {
            setSelectedConversation(conversation);
          } else {
            try {
              const response = await conversationService.getConversation(conversationId);
              const convertedConversation = {
                ...response,
                messages: response.messages.map((msg: MessageResponse) => ({
                  id: msg.id,
                  content: msg.content,
                  senderType: msg.senderType,
                  timestamp: new Date(msg.createdAt)
                }))
              };
              setSelectedConversation(convertedConversation);
              // Chỉ thêm vào danh sách nếu chưa tồn tại
              setConversations(prev => {
                const exists = prev.some(conv => conv.id === conversationId);
                if (!exists) {
                  return ensureUniqueConversations([...prev, convertedConversation]);
                }
                return prev;
              });
            } catch {
              setError('Failed to fetch conversation');
            }
          }
        }
      } catch {
        setError('Failed to fetch conversations');
      }
    };

    fetchConversations();
  }, [conversationId, userId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !content.trim() || !userId) return;

    setIsLoading(true);
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: content,
        senderType: 'USER',
        timestamp: new Date()
      };

      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, userMessage]
        };
      });

      const response = await conversationService.sendMessage(selectedConversation.id, content, userId.toString());
      
      const botMessage: Message = {
        id: response.id,
        content: response.content,
        senderType: response.senderType,
        timestamp: new Date(response.createdAt)
      };

      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, botMessage]
        };
      });

      setConversations(prev => 
        ensureUniqueConversations(prev.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, userMessage, botMessage]
            };
          }
          return conv;
        }))
      );

      // Sau khi gửi tin nhắn thành công, fetch lại aiUsageCount
      await fetchAiUsageCount();
    } catch {
      setError('Failed to send message');
      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages.slice(0, -1)
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await conversationService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
    } catch {
      setError('Failed to delete conversation');
    }
  };

  return {
    conversations,
    selectedConversation,
    isLoading,
    error,
    topics,
    aiUsageCount,
    handleSendMessage,
    handleDeleteConversation,
    setSelectedConversation,
    fetchAiUsageCount
  };
}; 