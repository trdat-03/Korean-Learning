import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import ChatWindow from './ChatWindow';
import AdminChatDashboard from './AdminChatDashboard';
import { useUser } from '../../hooks/useUser';

interface ChatButtonProps {
  userId: number;
  userRole: 'user' | 'ADMIN' | 'STUDENT';
}

const ChatButton: React.FC<ChatButtonProps> = ({ userId, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user } = useUser();

  const isAdmin = userRole === 'ADMIN';

  // Xử lý đăng xuất - đóng chat
  useEffect(() => {
    if (!user) {
      setIsOpen(false);
      setIsMinimized(false);
      setIsFullscreen(false);
      setUnreadCount(0);
    }
  }, [user]);

  const handleToggleChat = () => {
    if (isOpen) {
      if (isAdmin) {
        setIsFullscreen(!isFullscreen);
      } else {
        setIsMinimized(!isMinimized);
      }
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      if (isAdmin) {
        setIsFullscreen(true);
      }
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsFullscreen(false);
  };

  // Reset unread count khi mở chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  // Không hiển thị nếu user đã đăng xuất
  if (!user) return null;

  // Admin chat - fullscreen overlay
  if (isAdmin && isOpen && isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Admin Chat Console</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(false)}
              className="text-gray-600 hover:text-gray-800 p-2"
              title="Minimize"
            >
              <Minimize2 size={20} />
            </button>
            <button
              onClick={handleCloseChat}
              className="text-gray-600 hover:text-gray-800 p-2"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="h-[calc(100vh-73px)]">
          <AdminChatDashboard adminId={userId} />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Button - Fixed position với theme đỏ */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggleChat}
          className={`relative text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105 ${
            isAdmin 
              ? 'bg-gray-600 hover:bg-gray-700' 
              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
          }`}
          aria-label={isAdmin ? "Admin chat console" : "Chat with admin"}
        >
          {isOpen ? (
            <Minimize2 size={24} className="animate-pulse" />
          ) : (
            <MessageCircle size={24} className="animate-bounce" />
          )}
          
          {/* Unread count badge với theme đỏ */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-bold animate-pulse shadow-lg">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window - User chat với theme đỏ */}
      {isOpen && !isAdmin && (
        <div className={`fixed bottom-24 right-6 z-40 transition-all duration-300 ${
          isMinimized ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}>
          <div className="bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden w-80 max-w-sm">
            {/* Header với gradient đỏ */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Chat Support</h3>
                  <p className="text-xs text-red-100">We're here to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-red-100 hover:text-white hover:bg-red-600 p-1 rounded transition-colors"
                  title="Minimize"
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={handleCloseChat}
                  className="text-red-100 hover:text-white hover:bg-red-600 p-1 rounded transition-colors"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <ChatWindow
                userId={userId}
                userRole={userRole}
                onUnreadCountChange={setUnreadCount}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
