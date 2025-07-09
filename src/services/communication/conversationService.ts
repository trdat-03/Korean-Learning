import api from '../api';
import type { ConversationResponse, MessageResponse } from '../../types/conversation';

export const conversationService = {
  // Start new conversation
  startConversation: async (userId: string, topic: string, roleScenario: string): Promise<ConversationResponse> => {
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
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  },

  // Get conversation with messages
  getConversation: async (conversationId: string): Promise<ConversationResponse> => {
    const response = await api.get(`/conversation/conversations/${conversationId}`);
    console.log('Get Conversation Response:', response.data); // Log the response
    return response.data;
  },

  // Get user conversations
  getUserConversations: async (userId: string): Promise<ConversationResponse[]> => {
    const response = await api.get(`/conversation/users/${userId}/conversations`);
    console.log('Get User Conversations Response:', response.data); // Log the response
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`/conversation/conversations/${conversationId}`);
  }
}; 