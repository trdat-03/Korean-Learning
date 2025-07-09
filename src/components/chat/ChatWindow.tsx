import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { chatService } from '../../services/communication/chatService';
import { firebaseChatService } from '../../services/communication/firebaseChatService';
import type { ChatMessage } from '../../types/chat';

interface ChatWindowProps {
  userId: number;
  userRole: 'user' | 'ADMIN' | 'STUDENT';
  onUnreadCountChange: (count: number) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  userId, 
  userRole, 
  onUnreadCountChange 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Admin ID mặc định
  const DEFAULT_ADMIN_ID = 10;

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing chats khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let sessions = [];
        if (userRole === 'ADMIN') {
          sessions = await chatService.getAdminChats(userId);
        } else {
          sessions = await chatService.getUserChats(userId);
        }
        
        // Nếu có chat session, chọn cái đầu tiên
        if (sessions.length > 0) {
          setCurrentChatId(sessions[0].chatId);
        } else if (userRole !== 'ADMIN') {
          // Chỉ tạo chat session khi user thực sự gửi tin nhắn đầu tiên
          // Không tạo ngay khi component mount
          setCurrentChatId(null);
        }
      } catch (err) {
        console.error('Error loading chat sessions:', err);
        setError('Failed to load chat sessions');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [userId, userRole]);

  useEffect(() => {
    if (currentChatId) {
      const unsubscribe = firebaseChatService.listenForMessages(
        currentChatId,
        (newMessages) => {
          setMessages(newMessages);
          
          // Đếm tin nhắn chưa đọc từ người khác
          const unreadMessages = newMessages.filter(
            msg => msg.senderId !== userId.toString() && !msg.isRead
          );
          onUnreadCountChange(unreadMessages.length);
        }
      );

      // Đánh dấu tin nhắn đã đọc khi mở chat
      firebaseChatService.markMessagesAsRead(currentChatId, userId.toString());

      return unsubscribe;
    }
  }, [currentChatId, userId, onUnreadCountChange]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }
    
    if (isSending) {
      return;
    }

    try {
      setIsSending(true);
      setError(null);

      // Nếu chưa có chat session, tạo mới
      let chatId = currentChatId;
      if (!chatId && userRole !== 'ADMIN') {
        const response = await chatService.createChatSession({
          userId,
          adminId: DEFAULT_ADMIN_ID,
        });
        
        // Tạo chat session trong Firebase
        await firebaseChatService.createChatInFirebase(
          response.chatId,
          userId.toString(),
          DEFAULT_ADMIN_ID.toString()
        );
        
        chatId = response.chatId;
        setCurrentChatId(chatId);
      }

      if (!chatId) {
        setError('No active chat session');
        return;
      }

      const messageData = {
        senderId: userId.toString(),
        senderType: userRole === 'STUDENT' ? 'user' as const : userRole,
        content: newMessage.trim(),
        isRead: false,
      };

      await firebaseChatService.sendMessage(chatId, messageData);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message: ' + (err as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && !currentChatId) {
    return (
      <div className="flex flex-col items-center justify-center h-80 p-4 bg-gradient-to-b from-red-50 to-white">
        <Loader2 className="w-6 h-6 animate-spin text-red-600 mb-2" />
        <p className="text-sm text-gray-600">Connecting to support...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-80 bg-gradient-to-b from-red-50 to-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-gray-100">
        {error && (
          <div className="text-red-600 text-sm text-center p-3 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        {!currentChatId ? (
          <div className="text-center text-gray-500 text-sm py-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-6 h-6 text-red-600" />
            </div>
            {userRole === 'ADMIN' 
              ? 'No active chat sessions' 
              : 'Send your first message to start chatting!'}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-6 h-6 text-red-600" />
            </div>
            {userRole === 'ADMIN' 
              ? 'Waiting for user messages...' 
              : 'Start a conversation with our support team!'}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === userId.toString() ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                  message.senderId === userId.toString()
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === userId.toString()
                      ? 'text-red-100'
                      : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-red-100 p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-red-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all"
            disabled={isLoading || isSending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
