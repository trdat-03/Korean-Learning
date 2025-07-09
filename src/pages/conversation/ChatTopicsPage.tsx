import { Header } from "@/components/Header";
import { TopicCard } from "./components/TopicCard";
import { useChatTopics } from "@/hooks/conversation/useChatTopics";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ChatTopicsPage = () => {
  const { topics, isLoading, error, handleStartChat } = useChatTopics();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Chủ đề trò chuyện</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onStartChat={handleStartChat}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}; 