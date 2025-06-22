export interface Message {
  id: string;
  content: string;
  translation?: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  topic: string;
  messages: Message[];
  roleScenario?: string;
}

export interface ChatTopic {
  id: string;
  displayName: string;
  description: string;
  imageUrl: string;
  prompt: string;
}

export interface MessageResponse {
  id: string;
  content: string;
  translation?: string;
  sender?: 'user' | 'bot';
  senderType: 'USER' | 'AI';
  timestamp: string;
  createdAt: string;
  correctionFeedback: string | null;
}

export interface ConversationResponse {
  id: string;
  topic: string;
  messages: MessageResponse[];
  roleScenario?: string;
  userId: string;
  createdAt: string;
  isActive: boolean;
} 