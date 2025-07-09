import { motion } from 'framer-motion';
import type { Conversation, ChatTopic } from '@/types/conversation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  topic?: ChatTopic;
  onSelect: (conversation: Conversation) => void;
  onDelete?: (conversationId: string) => void;
}

export const ConversationItem = ({
  conversation,
  isSelected,
  topic,
  onSelect,
  onDelete,
}: ConversationItemProps) => {
  return (
    <motion.div
      className={`group relative w-full rounded-lg transition-colors ${
        isSelected
          ? 'bg-red-50 text-red-900'
          : 'hover:bg-gray-50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={() => onSelect(conversation)}
        className="w-full text-left p-3 pr-12"
      >
        <div className="font-medium">
          {topic?.displayName || conversation.topic}
        </div>
        {conversation.messages.length > 0 && (
          <p className="text-sm text-gray-500 truncate mt-1">
            {conversation.messages[conversation.messages.length - 1].content}
          </p>
        )}
      </button>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(conversation.id);
          }}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      )}
    </motion.div>
  );
}; 