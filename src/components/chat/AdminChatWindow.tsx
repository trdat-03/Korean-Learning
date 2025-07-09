import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, User, MessageSquare } from 'lucide-react';
import { firebaseChatService } from '../../services/communication/firebaseChatService';
import type { ChatMessage } from '../../types/chat';

interface AdminChatWindowProps {
  chatId: string;
  userId: number;
  adminId: number;
  onClose?: () => void;
}

const AdminChatWindow: React.FC<AdminChatWindowProps> = ({ 
  chatId, 
  userId, 
  adminId
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for messages when chatId changes
  useEffect(() => {
    if (!chatId) return;

    setIsLoading(true);

    const unsubscribe = firebaseChatService.listenForMessages(chatId, (newMessages) => {
      setMessages(newMessages);
      setIsLoading(false);
      
      // Mark messages as read
      firebaseChatService.markMessagesAsRead(chatId, adminId.toString());
    });

    return () => {
      unsubscribe();
    };
  }, [chatId, adminId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || isSending) return;

    try {
      setIsSending(true);
      setError(null);

      const messageData = {
        senderId: adminId.toString(),
        senderType: 'ADMIN' as const,
        content: newMessage.trim(),
        isRead: false,
      };

      await firebaseChatService.sendMessage(chatId, messageData);
      setNewMessage('');
    } catch (err) {
      setError('Lỗi khi gửi tin nhắn: ' + (err as Error).message);
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

  const formatDate = (timestamp: number) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    }
    
    return messageDate.toLocaleDateString('vi-VN');
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chọn cuộc trò chuyện</h3>
          <p className="text-gray-600">Chọn một cuộc trò chuyện từ danh sách để bắt đầu phản hồi người dùng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white rounded-r-lg overflow-hidden">
      {/* Header với theme nhẹ nhàng hơn */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-slate-100 to-slate-200 border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-700">Người dùng {userId}</h3>
            <p className="text-sm text-slate-500">Cuộc trò chuyện hỗ trợ</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs text-slate-500">
            Tin nhắn: {messages.length}
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 chat-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin text-red-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Đang tải cuộc trò chuyện...</p>
            </div>
          </div>
        ) : Object.keys(groupedMessages).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600">Chưa có tin nhắn trong cuộc trò chuyện này</p>
              <p className="text-sm text-gray-500">Đang chờ người dùng gửi tin nhắn...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full">
                    {date}
                  </div>
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-3">
                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === adminId.toString() ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                          message.senderId === adminId.toString()
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-between mt-1 ${
                          message.senderId === adminId.toString()
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}>
                          <span className="text-xs">
                            {message.senderId === adminId.toString() ? 'Bạn' : `Người dùng ${userId}`}
                          </span>
                          <span className="text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border-t border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-slate-200 p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập phản hồi của bạn..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm transition-all"
            disabled={isSending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-full hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Nhấn Enter để gửi</span>
          <span className={newMessage.length > 800 ? 'text-red-500' : ''}>{newMessage.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

export default AdminChatWindow;
