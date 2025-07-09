import { ref, push, onValue, off, set, update, get } from "firebase/database";
import { database } from '../firebase/config';
import type { ChatMessage } from '../types/chat';

export const firebaseChatService = {
  // Gửi tin nhắn
  sendMessage: async (chatId: string, messageData: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<void> => {
    try {
      const messagesRef = ref(database, `messages/${chatId}`);
      const newMessageRef = push(messagesRef);
      
      const messageWithTimestamp = {
        ...messageData,
        timestamp: Date.now(),
        id: newMessageRef.key,
      };

      await set(newMessageRef, messageWithTimestamp);

      // Cập nhật last message trong chat session
      const chatRef = ref(database, `chats/${chatId}`);
      await set(chatRef, {
        lastMessage: messageData.content,
        lastMessageTime: Date.now(),
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Lắng nghe tin nhắn mới
  listenForMessages: (chatId: string, callback: (messages: ChatMessage[]) => void): (() => void) => {
    const messagesRef = ref(database, `messages/${chatId}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages: ChatMessage[] = Object.values(data);
        // Sắp xếp theo timestamp
        messages.sort((a, b) => a.timestamp - b.timestamp);
        callback(messages);
      } else {
        callback([]);
      }
    });

    // Trả về function để cleanup listener
    return () => off(messagesRef, 'value', unsubscribe);
  },

  // Đánh dấu tin nhắn đã đọc
  markMessagesAsRead: async (chatId: string, userId: string): Promise<void> => {
    try {
      const messagesRef = ref(database, `messages/${chatId}`);
      
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const updates: Record<string, ChatMessage> = {};
          
          Object.entries(data).forEach(([messageId, message]) => {
            const msg = message as ChatMessage;
            if (msg.senderId !== userId && !msg.isRead) {
              // Sửa lại cách update để tránh key có dấu "/"
              updates[messageId] = { ...msg, isRead: true };
            }
          });

          if (Object.keys(updates).length > 0) {
            const messagesRefForUpdate = ref(database, `messages/${chatId}`);
            update(messagesRefForUpdate, updates);
          }
        }
      }, { onlyOnce: true });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Lắng nghe trạng thái chat
  listenForChatStatus: (chatId: string, callback: (status: string) => void): (() => void) => {
    const chatRef = ref(database, `chats/${chatId}/status`);
    
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const status = snapshot.val();
      if (status) {
        callback(status);
      }
    });

    return () => off(chatRef, 'value', unsubscribe);
  },

  // Tạo chat session trong Firebase
  createChatInFirebase: async (chatId: string, userId: string, adminId: string): Promise<void> => {
    try {
      const chatRef = ref(database, `chats/${chatId}`);
      await set(chatRef, {
        userId,
        adminId,
        status: 'active',
        createdAt: Date.now(),
        lastMessage: '',
        lastMessageTime: Date.now(),
      });
    } catch (error) {
      console.error('Error creating chat in Firebase:', error);
      throw error;
    }
  },

  // Lấy tin nhắn một lần (không listen)
  getMessages: async (chatId: string): Promise<ChatMessage[]> => {
    try {
      const messagesRef = ref(database, `messages/${chatId}`);
      const snapshot = await get(messagesRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.entries(data).map(([id, message]) => ({
          id,
          ...(message as Omit<ChatMessage, 'id'>),
        })).sort((a, b) => a.timestamp - b.timestamp);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },
};
