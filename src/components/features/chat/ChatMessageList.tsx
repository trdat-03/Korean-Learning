import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';
import { useState } from 'react';
import { Volume2, Languages, Loader2 } from 'lucide-react';
import type { Message } from '@/types/chat';
import { useTranslation } from '@/hooks/features/chat/useTranslation';
import { useSpeech } from '@/hooks/features/chat/useSpeech';

interface ChatMessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

// Component con để hiển thị message với các chức năng
const MessageContent = ({ msg }: { msg: Message }) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const { translateText, isTranslating } = useTranslation();
  const { speak, isSpeaking } = useSpeech();

  const handleTranslate = async () => {
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }

    if (!translatedText) {
      const translated = await translateText(msg.content);
      setTranslatedText(translated);
    }
    setShowTranslation(true);
  };

  const handleSpeak = () => {
    const textToSpeak = showTranslation && translatedText ? translatedText : msg.content;
    const lang = showTranslation ? 'vi-VN' : 'ko-KR';
    speak(textToSpeak, msg.id, lang);
  };

  return (
    <div className="space-y-1">
      <div className={`rounded-2xl px-4 py-2 ${
        msg.senderType === 'USER'
          ? 'bg-[#FF3B3B] text-white'
          : 'bg-white border border-gray-200 text-gray-900'
      }`}>
        {msg.content}
      </div>

      {/* Hiển thị bản dịch nếu có */}
      {showTranslation && translatedText && (
        <motion.div
          initial={{ opacity:0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`rounded-2xl px-4 py-2 text-sm ${
            msg.senderType === 'USER'
              ? 'bg-[#FF3B3B]/80 text-white'
              : 'bg-gray-50 border border-gray-100 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-1 mb-1">
            <Languages className="w-3 h-3" />
            <span className="text-xs opacity-75">Bản dịch</span>
          </div>
          {translatedText}
        </motion.div>
      )}

      {/* Nút điều khiển cho tin nhắn AI */}
      {msg.senderType === 'AI' && (
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleSpeak}
            disabled={isSpeaking === msg.id}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
              isSpeaking === msg.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <Volume2 className="w-3 h-3" />
            {isSpeaking === msg.id ? 'Đang đọc...' : 'Đọc'}
          </button>

          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
              showTranslation
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {isTranslating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Languages className="w-3 h-3" />
            )}
            {isTranslating ? 'Đang dịch...' : showTranslation ? 'Ẩn dịch' : 'Dịch'}
          </button>
        </div>
      )}
    </div>
  );
};

export const ChatMessageList = ({
  messages,
  messagesEndRef,
}: ChatMessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full p-4 flex flex-col justify-end">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${msg.senderType === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[70%] ${msg.senderType === 'USER' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <img
                      src={msg.senderType === 'USER' ? "/images/avatar.avif" : "/images/bot-avatar.avif"}
                      alt={msg.senderType}
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                  <MessageContent msg={msg} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};