import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import ChatWindow from '../components/ChatWindow';
import ConversationList from '../components/ConversationList';
import type { Conversation, Message, MessageResponse, ChatTopic } from '../types/chat';
import { chatService } from '../services/chatService';

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<Record<string, ChatTopic>>({});
  const { conversationId } = useParams(); 
  const userId = '123'; 

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

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await chatService.getUserConversations(userId);
        // 2. Chuyển đổi dữ liệu từ API sang định dạng frontend
        const convertedConversations = response.map(conv => ({
          ...conv,
          messages: conv.messages.map(msg => {
            // Convert API's USER/AI to user/bot
            const sender = msg.senderType === 'USER' ? 'user' as const : 'bot' as const;
            return {
              id: msg.id,
              content: msg.content,
              translation: msg.translation,
              sender,
              timestamp: new Date(msg.createdAt)
            };
          })
        }));
        console.log('Converted conversations:', convertedConversations);
        setConversations(convertedConversations);
        
        // 4. Nếu có conversationId trong URL, tải cuộc trò chuyện đó
        if (conversationId) {
          const conversation = convertedConversations.find(conv => conv.id === conversationId);
          if (conversation) {
            setSelectedConversation(conversation);
          } else {
            // If conversation is not in the list, fetch it directly
            try {
              const response = await chatService.getConversation(conversationId);
              const convertedConversation = {
                ...response,
                messages: response.messages.map((msg: MessageResponse) => {
                  // Convert API's USER/AI to user/bot
                  const sender = msg.senderType === 'USER' ? 'user' as const : 'bot' as const;
                  return {
                    id: msg.id,
                    content: msg.content,
                    translation: msg.translation,
                    sender,
                    timestamp: new Date(msg.createdAt)
                  };
                })
              };
              console.log('Converted single conversation:', convertedConversation);
              setSelectedConversation(convertedConversation);
              setConversations(prev => [...prev, convertedConversation]);
            } catch (error) {
              console.error('Error fetching conversation:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [conversationId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    setIsLoading(true);
    try {
        // 1. Tạo tin nhắn người dùng ngay lập tức
      const userMessage: Message = {
        id: Date.now().toString(),
        content: content,
        sender: 'user' as const,
        timestamp: new Date()
      };

       // 2. Cập nhật UI ngay lập tức với tin nhắn người dùng
      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, userMessage]
        };
      });

       // 3. Gửi tin nhắn đến API
      const response: MessageResponse = await chatService.sendMessage(selectedConversation.id, content);
      console.log('Send message response:', response);
      
     // 4. Chuyển đổi phản hồi từ bot
      const botMessage: Message = {
        id: response.id,
        content: response.content,
        translation: response.translation,
        sender: response.senderType === 'USER' ? 'user' as const : 'bot' as const,
        timestamp: new Date(response.createdAt)
      };

       // 5. Cập nhật UI với tin nhắn từ bot
      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, botMessage]
        };
      });

      // Cập nhật danh sách cuộc trò chuyện
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, userMessage, botMessage]
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Chuyển đổi tin nhắn người dùng thành tin nhắn lỗi
      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages.slice(0, -1) // Xoá tin nhắn cuối cùng bị
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-gray-200 bg-white">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            onDeleteConversation={(conversationId) => {
              setConversations(prev => prev.filter(conv => conv.id !== conversationId));
              if (selectedConversation?.id === conversationId) {
                setSelectedConversation(null);
              }
            }}
          />
        </div>
        <div className="flex-1">
          <ChatWindow
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            topicInfo={selectedConversation ? topics[selectedConversation.topic] : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat; 