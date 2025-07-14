import api from '../api';
import type { ConversationResponse, MessageResponse } from '../../types/conversation';

export const conversationService = {
  // Start new conversation
  startConversation: async (userId: number, topic: string, roleScenario: string): Promise<ConversationResponse> => {
    const requestBody = {
      userId,
      topic,
      roleScenario
    };
    const response = await api.post('/conversation/conversations', requestBody);
    return response.data;
  },

  // Send message
  sendMessage: async (conversationId: string, content: string, userId: string, needsCorrection = false): Promise<MessageResponse> => {
    try {
      const response = await api.post(`/conversation/conversations/${conversationId}/messages`, {
        content,
        userId,
        needsCorrection,
        senderType: 'USER' 
      });
      return response.data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  },

  // Get conversation with messages
  getConversation: async (conversationId: string): Promise<ConversationResponse> => {
    const response = await api.get(`/conversation/conversations/${conversationId}`);
    return response.data;
  },

  // Get user conversations
  getUserConversations: async (userId: number): Promise<ConversationResponse[]> => {
    const response = await api.get(`/conversation/users/${userId}/conversations`);
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`/conversation/conversations/${conversationId}`);
  }
}; 