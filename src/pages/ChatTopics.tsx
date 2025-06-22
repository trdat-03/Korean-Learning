import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import type { ChatTopic } from '../types/chat';
import { chatService } from '../services/chatService';
import { AxiosError } from 'axios';

const ChatTopics = () => {
  const [topics, setTopics] = useState<ChatTopic[]>([]);
  const navigate = useNavigate();
  const userId = '123'; // Replace with actual user ID

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/chat/topics');
        const data = await response.json();
        console.log('Fetched topics:', data);
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  const handleStartChat = async (topic: ChatTopic) => {
    try {
      console.log('Starting chat with topic:', topic);
       // Tạo cuộc trò chuyện mới với chủ đề được chọn
      const conversation = await chatService.startConversation(
        userId,
        topic.id, 
        topic.prompt 
      );
       // Chuyển hướng đến trang chat với ID cuộc trò chuyện
      navigate(`/chat/${conversation.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      if (error instanceof AxiosError && error.response) {
        console.log('Error response:', error.response.data);
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-12 px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
              Chat với DaSo
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hệt như đang nói chuyện với người bản địa! Được hỗ trợ bởi AI.
            </p>
          </div>

          {/* Topics Grid */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {topics.map((topic) => (
              <motion.div
                key={topic.id}
                variants={item}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={topic.imageUrl}
                      alt={topic.displayName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {topic.displayName}
                    </h3>
                    <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                      {topic.description}
                    </p>
                    <Button 
                      onClick={() => handleStartChat(topic)}
                      className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
                    >
                      Bắt đầu trò chuyện
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ChatTopics; 