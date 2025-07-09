import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChatTopic } from "@/types/conversation";

interface TopicCardProps {
  topic: ChatTopic;
  onStartChat: (topic: ChatTopic) => void;
}

export const TopicCard = ({ topic, onStartChat }: TopicCardProps) => {
  return (
    <Card className="w-full transition-transform hover:scale-[1.02]">
      <CardHeader>
        <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
          <img 
            src={topic.imageUrl} 
            alt={topic.displayName} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardTitle className="text-xl">{topic.displayName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{topic.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onStartChat(topic)}
        >
          Bắt đầu trò chuyện
        </Button>
      </CardFooter>
    </Card>
  );
}; 