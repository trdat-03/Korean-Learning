import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, User, Dot } from 'lucide-react';
import { chatService } from '../../services/communication/chatService';
import { firebaseChatService } from '../../services/communication/firebaseChatService';
import type { ChatSession, ChatMessage } from '../../types/chat';

interface AdminChatListProps {
  adminId: number;
  onSelectChat: (chatId: string, userId: number) => void;
  selectedChatId: string | null;
}

interface ChatWithLastMessage extends ChatSession {
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
  userName?: string;
}

const AdminChatList: React.FC<AdminChatListProps> = ({ 
  adminId, 
  onSelectChat, 
  selectedChatId 
}) => {
  const [chats, setChats] = useState<ChatWithLastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const chatSessions = await chatService.getAdminChats(adminId);
        
        // Get additional info for each chat
        const chatsWithInfo = await Promise.all(
          chatSessions.map(async (chat) => {
            try {
              // Get last messages for this chat
              const messages = await getLastMessages(chat.chatId);
              const unreadCount = messages.filter(msg => 
                msg.senderId !== adminId.toString() && !msg.isRead
              ).length;
              
              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
                  return {
              ...chat,
              lastMessage: lastMessage?.content || 'Chưa có tin nhắn',
              lastMessageTime: lastMessage?.timestamp || Date.now(),
              unreadCount,
              userName: `Người dùng ${chat.userId}`,
            } as ChatWithLastMessage;
            } catch (err) {
              console.error('Error getting chat info for', chat.chatId, err);
              return {
                ...chat,
                lastMessage: 'Error loading messages',
                lastMessageTime: Date.now(),
                unreadCount: 0,
                userName: `User ${chat.userId}`,
              } as ChatWithLastMessage;
            }
          })
        );
        
        // Sort by last message time
        chatsWithInfo.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
        setChats(chatsWithInfo);
            } catch (err) {
      console.error('Error loading admin chats:', err);
      setError('Không thể tải cuộc trò chuyện');
    } finally {
      setIsLoading(false);
    }
    };
    
    loadData();
    
    // Refresh chats every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [adminId]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const chatSessions = await chatService.getAdminChats(adminId);
      
      // Get additional info for each chat
      const chatsWithInfo = await Promise.all(
        chatSessions.map(async (chat) => {
          try {
            // Get last messages for this chat
            const messages = await getLastMessages(chat.chatId);
            const unreadCount = messages.filter(msg => 
              msg.senderId !== adminId.toString() && !msg.isRead
            ).length;
            
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
            
            return {
              ...chat,
              lastMessage: lastMessage?.content || 'Chưa có tin nhắn',
              lastMessageTime: lastMessage?.timestamp || Date.now(),
              unreadCount,
              userName: `Người dùng ${chat.userId}`,
            } as ChatWithLastMessage;
          } catch (err) {
            console.error('Error getting chat info for', chat.chatId, err);
            return {
              ...chat,
              lastMessage: 'Lỗi khi tải tin nhắn',
              lastMessageTime: Date.now(),
              unreadCount: 0,
              userName: `Người dùng ${chat.userId}`,
            } as ChatWithLastMessage;
          }
        })
      );
      
      // Sort by last message time
      chatsWithInfo.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
      setChats(chatsWithInfo);
      
    } catch (err) {
      console.error('Error loading admin chats:', err);
      setError('Không thể tải cuộc trò chuyện');
    } finally {
      setIsLoading(false);
    }
  };

  const getLastMessages = async (chatId: string): Promise<ChatMessage[]> => {
    try {
      return await firebaseChatService.getMessages(chatId);
    } catch (error) {
      console.error('Error getting messages for chat:', chatId, error);
      return [];
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) { // Less than 1 minute
      return 'Vừa xong';
    } else if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)} phút trước`;
    } else if (diff < 86400000) { // Less than 1 day
      return `${Math.floor(diff / 3600000)} giờ trước`;
    } else {
      return new Date(timestamp).toLocaleDateString('vi-VN');
    }
  };

  const truncateMessage = (message: string, length: number = 50) => {
    return message.length > length ? message.substring(0, length) + '...' : message;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải cuộc trò chuyện...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <button 
          onClick={loadChats}
          className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-4">
        <div>
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Chưa có cuộc trò chuyện nào</p>
          <p className="text-sm text-gray-500">Đang chờ người dùng bắt đầu trò chuyện...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto chat-scrollbar">
      <div className="p-4 border-b bg-gradient-to-r from-slate-100 to-slate-200 border-slate-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-slate-700">Hỗ trợ trò chuyện</h3>
            <p className="text-sm text-slate-500">{chats.length} cuộc trò chuyện</p>
          </div>
          <button
            onClick={loadChats}
            className="flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600 hover:text-slate-700"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
        </div>
      </div>
      
      <div className="divide-y">
        {chats.map((chat) => (
          <div
            key={chat.chatId}
            onClick={() => onSelectChat(chat.chatId, chat.userId)}
            className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
              selectedChatId === chat.chatId ? 'bg-red-50 border-r-4 border-red-400' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{chat.userName}</h4>
                  <p className="text-xs text-gray-500">ID: {chat.userId}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {chat.unreadCount > 0 && (
                  <span className="bg-red-400 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                  </span>
                )}
                <span className={`w-2 h-2 rounded-full ${
                  chat.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 flex-1">
                {truncateMessage(chat.lastMessage || 'Chưa có tin nhắn')}
              </p>
              <div className="flex items-center text-xs text-gray-500 ml-2">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(chat.lastMessageTime || Date.now())}
              </div>
            </div>
            
            {chat.status === 'active' && (
              <div className="flex items-center mt-2">
                <Dot className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">Đang hoạt động</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChatList;
