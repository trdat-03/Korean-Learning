import { Header } from '@/components/Header';
import { ChatRoom } from './components/ChatRoom';
import { ConversationSidebar } from './components/ConversationSidebar';
import { useConversation } from '@/hooks/conversation/useConversation';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ConversationPage = () => {
  const {
    conversations,
    selectedConversation,
    isLoading,
    error,
    topics,
    aiUsageCount,
    handleSendMessage,
    handleDeleteConversation,
    setSelectedConversation
  } = useConversation();

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-gray-200 bg-white">
          <ConversationSidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            onDeleteConversation={handleDeleteConversation}
            topics={topics}
          />
        </div>
        <div className="flex-1">
          {error && (
            <Alert variant="destructive" className="m-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <ChatRoom
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            topicInfo={selectedConversation ? topics[selectedConversation.topic] : undefined}
            aiUsageCount={aiUsageCount ?? undefined}
          />
        </div>
      </div>
    </div>
  );
}; 