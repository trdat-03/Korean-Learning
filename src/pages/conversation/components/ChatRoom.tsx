import { useState, useRef, useEffect } from 'react';
import type { Conversation, ChatTopic } from '@/types/conversation';
import { ChatTopicHeader } from './ChatTopicHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { AlertAiUsageCount } from '@/components/ui/AlertAiUsageCount';

interface ChatRoomProps {
  conversation: Conversation | null;
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  topicInfo?: ChatTopic;
  aiUsageCount?: number;
}

export const ChatRoom = ({ conversation, onSendMessage, isLoading, topicInfo, aiUsageCount }: ChatRoomProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Kiểm tra số lượt AI trước khi gửi tin nhắn
    if ((aiUsageCount ?? 0) <= 0) {
      return;
    }
    
    await onSendMessage(message);
    setMessage('');
  };

  
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có cuộc hội thoại nào được chọn
          </h3>
          <p className="text-gray-500">
            Vui lòng chọn một cuộc hội thoại hoặc tạo cuộc hội thoại mới
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {topicInfo && <ChatTopicHeader topic={topicInfo} />}
      
      {/* Hiển thị số lượt AI còn lại */}
      <div className="px-4 py-2">
        <AlertAiUsageCount aiUsageCount={aiUsageCount || 0} />
      </div>
      
      <ChatMessageList
        messages={conversation.messages}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        message={message}
        isLoading={isLoading}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        disabled={(aiUsageCount ?? 0) <= 0}
      />
    </div>
  );
}; 