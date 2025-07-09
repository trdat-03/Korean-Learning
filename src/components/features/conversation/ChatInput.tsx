import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';
import { Mic, Square } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/features/conversation/useVoiceRecognition';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
}

export const ChatInput = ({
  message,
  isLoading,
  onMessageChange,
  onSendMessage,
  disabled = false,
}: ChatInputProps) => {
  // Sử dụng useCallback để tránh re-render
  const handleVoiceTranscript = useCallback((transcript: string) => {
    const newMessage = message + transcript;
    onMessageChange(newMessage);
  }, [message, onMessageChange]);

  const {
    isListening,
    isSupported,
    toggleListening
  } = useVoiceRecognition({ onTranscript: handleVoiceTranscript });

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (disabled) return; // Không cho phép gửi nếu disabled
    if (isListening) {
      toggleListening(); // Dừng recording trước khi gửi
    }
    onSendMessage();
  };

  // Xử lý Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
      <div className="flex gap-2 max-w-[1200px] mx-auto">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              disabled 
                ? "Hết lượt sử dụng AI. Vui lòng nâng cấp gói."
                : isListening 
                  ? "Đang nghe... nói tiếng Hàn" 
                  : "Nhập tin nhắn của bạn..."
            }
            className={`flex-1 pr-12 ${isListening ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}
            disabled={isLoading || disabled}
          />
          
          {/* Hiển thị trạng thái đang nghe */}
          {isListening && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-500">REC</span>
              </div>
            </div>
          )}
        </div>

        {/* Nút Voice Recognition */}
        {isSupported && (
          <Button
            onClick={toggleListening}
            disabled={isLoading || disabled}
            variant="outline"
            className={`px-3 flex-shrink-0 ${
              isListening 
                ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                : 'hover:bg-gray-50'
            }`}
            title={
              disabled 
                ? "Hết lượt sử dụng AI"
                : isListening 
                  ? "Dừng ghi âm" 
                  : "Bắt đầu ghi âm (tiếng Hàn)"
            }
          >
            {isListening ? (
              <Square className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        )}

        {/* Nút gửi */}
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || (!message.trim() && !isListening) || disabled}
          className="bg-[#FF3B3B] hover:bg-[#FF2525] text-white px-6 flex-shrink-0"
        >
          {disabled ? 'Hết lượt AI' : isLoading ? 'Đang gửi...' : 'Gửi'}
        </Button>
      </div>

      {/* Thông báo không hỗ trợ */}
      {!isSupported && (
        <div className="text-xs text-gray-500 text-center mt-2">
          Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói
        </div>
      )}

      {/* Hướng dẫn sử dụng */}
      {isSupported && (
        <div className="text-xs text-gray-500 text-center mt-2">
          {isListening 
            ? "🎤 Đang nghe... Nói tiếng Hàn để chuyển đổi thành văn bản" 
            : "💡 Click biểu tượng mic để nói tiếng Hàn"
          }
        </div>
      )}
    </div>
  );
};