import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowPathIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { Conversation, ChatTopic } from '../types/chat';

interface ChatWindowProps {
  conversation: Conversation | null;
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  topicInfo?: ChatTopic;
}

const ChatWindow = ({ conversation, onSendMessage, isLoading, topicInfo }: ChatWindowProps) => {
  const [message, setMessage] = useState('');
  const [showTranslationIds, setShowTranslationIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await onSendMessage(message);
    setMessage('');
  };

  const toggleTranslation = (messageId: string) => {
    setShowTranslationIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
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
      {/* Topic Description Header */}
      {topicInfo && (
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="max-w-[1200px] mx-auto p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={topicInfo.imageUrl} 
                  alt={topicInfo.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {topicInfo.displayName}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {topicInfo.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <InformationCircleIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full p-4 flex flex-col justify-end">
          <div className="space-y-4">
            <AnimatePresence>
              {conversation.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  // Căn lề dựa vào người gửi
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <img 
                        src={msg.sender === 'user' ? "/images/avatar.avif" : "/images/bot-avatar.avif"} 
                        alt={msg.sender} 
                        className="w-full h-full object-cover"
                      />
                    </Avatar>
                    <div className="space-y-1">
                      <div className={`rounded-2xl px-4 py-2 ${
                        msg.sender === 'user' 
                          ? 'bg-[#FF3B3B] text-white' 
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        {msg.content}
                      </div>
                      
                      {/* Translation toggle button for bot messages */}
                      {msg.sender === 'bot' && msg.translation && (
                        <>
                          <button
                            onClick={() => toggleTranslation(msg.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors ml-2"
                          >
                            <ArrowPathIcon className="w-3 h-3" />
                            {showTranslationIds.has(msg.id) ? 'Ẩn bản dịch' : 'Hiện bản dịch'}
                          </button>
                          
                          {/* Translation content */}
                          <AnimatePresence>
                            {showTranslationIds.has(msg.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-2xl ml-2"
                              >
                                {msg.translation}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Vùng nhập tin nhắn */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
        <div className="flex gap-2 max-w-[1200px] mx-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Nhập tin nhắn của bạn..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-[#FF3B3B] hover:bg-[#FF2525] text-white px-6 flex-shrink-0"
          >
            {isLoading ? 'Đang gửi...' : 'Gửi'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 