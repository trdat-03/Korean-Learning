import type { Conversation, ChatTopic } from '@/types/chat';
import { ConversationItem } from './ConversationItem';

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation?: (conversationId: string) => void;
  topics: Record<string, ChatTopic>;
}

export const ConversationSidebar = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onDeleteConversation,
  topics,
}: ConversationSidebarProps) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Cuộc hội thoại
        </h2>
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              topic={topics[conversation.topic]}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 