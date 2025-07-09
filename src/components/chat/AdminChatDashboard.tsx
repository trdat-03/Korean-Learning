import React, { useState } from 'react';
import AdminChatList from './AdminChatList';
import AdminChatWindow from './AdminChatWindow';

interface AdminChatDashboardProps {
  adminId: number;
}

const AdminChatDashboard: React.FC<AdminChatDashboardProps> = ({ adminId }) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleSelectChat = (chatId: string, userId: number) => {
    setSelectedChatId(chatId);
    setSelectedUserId(userId);
  };

  const handleCloseChat = () => {
    setSelectedChatId(null);
    setSelectedUserId(null);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-lg shadow-sm border border-slate-200">
      {/* Left Panel - Chat List */}
      <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col rounded-l-lg overflow-hidden">
        <AdminChatList
          adminId={adminId}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
        />
      </div>

      {/* Right Panel - Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChatId && selectedUserId ? (
          <AdminChatWindow
            chatId={selectedChatId}
            userId={selectedUserId}
            adminId={adminId}
            onClose={handleCloseChat}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-b from-slate-50 to-white rounded-r-lg">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chọn cuộc trò chuyện
              </h3>
              <p className="text-gray-600 mb-4">
                Chọn một cuộc trò chuyện từ bảng bên trái để bắt đầu quản lý hỗ trợ khách hàng
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>• Xem tất cả cuộc trò chuyện đang hoạt động</p>
                <p>• Thông báo tin nhắn thời gian thực</p>
                <p>• Khả năng phản hồi nhanh chóng</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatDashboard;
