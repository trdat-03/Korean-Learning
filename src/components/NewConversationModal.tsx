import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import type { ChatTopic } from '../types/chat';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (topic: string, roleScenario: string) => Promise<void>;
}

const NewConversationModal = ({
  isOpen,
  onClose,
  onCreateConversation,
}: NewConversationModalProps) => {
  const [topics, setTopics] = useState<ChatTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ChatTopic | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/chat/topics');
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    if (isOpen) {
      fetchTopics();
    }
  }, [isOpen]);

  const handleCreateConversation = async (topic: ChatTopic) => {
    try {
      setIsLoading(true);
      await onCreateConversation(topic.id, topic.id);
      onClose();
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo cuộc hội thoại mới</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`relative overflow-hidden rounded-lg border cursor-pointer transition-all ${
                selectedTopic?.id === topic.id
                  ? 'border-red-600 ring-2 ring-red-600'
                  : 'border-gray-200 hover:border-red-600'
              }`}
              onClick={() => setSelectedTopic(topic)}
            >
              <div className="relative h-32">
                <img
                  src={topic.imageUrl}
                  alt={topic.displayName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold">{topic.displayName}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={() => selectedTopic && handleCreateConversation(selectedTopic)}
            disabled={!selectedTopic || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Đang tạo...' : 'Bắt đầu'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationModal; 