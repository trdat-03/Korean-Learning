import api from './api';
import type { ChatSession, CreateChatRequest, CreateChatResponse } from '../types/chat';

export const chatService = {
  // Tạo chat session mới
  createChatSession: async (request: CreateChatRequest): Promise<CreateChatResponse> => {
    try {
      const response = await api.post('/chat/create', request);
      return response.data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  },

  // Lấy danh sách chat của user
  getUserChats: async (userId: number): Promise<ChatSession[]> => {
    try {
      const response = await api.get(`/chat/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user chats:', error);
      throw error;
    }
  },

  // Lấy danh sách chat của admin
  getAdminChats: async (adminId: number): Promise<ChatSession[]> => {
    try {
      const response = await api.get(`/chat/admin/${adminId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin chats:', error);
      throw error;
    }
  },

  // Lấy tất cả chat sessions đang active
  getActiveChats: async (): Promise<ChatSession[]> => {
    try {
      const response = await api.get('/chat/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active chats:', error);
      throw error;
    }
  },

  // Đóng chat session
  closeChatSession: async (chatId: string): Promise<void> => {
    try {
      await api.put(`/chat/close/${chatId}`);
    } catch (error) {
      console.error('Error closing chat session:', error);
      throw error;
    }
  },

  // Gửi tin nhắn (optional, có thể dùng Firebase thay thế)
  sendMessage: async (chatId: string, senderId: string, content: string): Promise<void> => {
    try {
      const requestBody = {
        chatId,
        senderId,
        content,
        timestamp: Date.now()
      };
      await api.post('/chat/send-message', requestBody);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};
