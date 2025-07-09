export interface ChatSession {
  chatId: string;
  userId: number;
  adminId: number;
  status: 'active' | 'closed';
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'user' | 'ADMIN' | 'STUDENT';
  content: string;
  timestamp: number;
  isRead: boolean;
}

export interface CreateChatRequest {
  userId: number;
  adminId: number;
}

export interface CreateChatResponse {
  chatId: string;
}

export interface ChatState {
  isOpen: boolean;
  currentChatId: string | null;
  messages: ChatMessage[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'ADMIN' | 'STUDENT';
}
