import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { ChatTopic } from '@/types/chat';

interface ChatTopicHeaderProps {
  topic: ChatTopic;
}

export const ChatTopicHeader = ({ topic }: ChatTopicHeaderProps) => {
  return (
    <div className="flex-shrink-0 border-b border-gray-200 bg-white">
      <div className="max-w-[1200px] mx-auto p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={topic.imageUrl} 
              alt={topic.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {topic.displayName}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {topic.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <InformationCircleIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}; 