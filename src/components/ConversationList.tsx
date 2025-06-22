import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Conversation, ChatTopic } from '../types/chat';
import { chatService } from '../services/chatService';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation?: (conversationId: string) => void;
}

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onDeleteConversation,
}: ConversationListProps) => {
  const [topics, setTopics] = useState<Record<string, ChatTopic>>({});
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/chat/topics');
        const data: ChatTopic[] = await response.json();
        const topicsMap = data.reduce((acc, topic) => {
          acc[topic.id] = topic;
          return acc;
        }, {} as Record<string, ChatTopic>);
        setTopics(topicsMap);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  const handleDelete = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation(); // Prevent conversation selection when clicking delete
    if (isDeleting) return; // Prevent multiple deletes

    try {
      setIsDeleting(conversationId);
      await chatService.deleteConversation(conversationId);
      onDeleteConversation?.(conversationId);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Cuộc hội thoại
        </h2>
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              className={`group relative w-full rounded-lg transition-colors ${
                selectedConversation?.id === conversation.id
                  ? 'bg-red-50 text-red-900'
                  : 'hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => onSelectConversation(conversation)}
                className="w-full text-left p-3 pr-12"
              >
                <div className="font-medium">{topics[conversation.topic]?.displayName || conversation.topic}</div>
                {conversation.messages.length > 0 && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation.messages[conversation.messages.length - 1].content}
                  </p>
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(e, conversation.id)}
                disabled={isDeleting === conversation.id}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationList; 