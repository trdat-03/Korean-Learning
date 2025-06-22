import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Timer, ArrowLeft } from 'lucide-react';
import type { LessonDetailType } from '../models/LessonDetail';
import type { Vocabulary } from '../models/Vocabulary';
import { shuffle } from '../lib/utils';

interface MatchingItem {
  id: string;
  text: string;
  type: 'korean' | 'vietnamese';
  isSelected: boolean;
  isMatched: boolean;
  matchedWithId: string | null;
}

const VocabularyMatching = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lesson, vocabularyCount }: { lesson: LessonDetailType; vocabularyCount: number } = location.state || {};

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [matchingItems, setMatchingItems] = useState<MatchingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MatchingItem | null>(null);

  useEffect(() => {
    if (!lesson) {
      navigate('/');
      return;
    }
    startMatching();
  }, [lesson, navigate]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const startMatching = () => {
    const selectedVocabs = shuffle([...lesson.vocabularies]).slice(0, vocabularyCount);
    
    const items: MatchingItem[] = [];
    selectedVocabs.forEach((vocab: Vocabulary) => {
      // Add Korean word
      items.push({
        id: `k-${vocab.id}`,
        text: vocab.wordKorean,
        type: 'korean',
        isSelected: false,
        isMatched: false,
        matchedWithId: null,
      });
      // Add Vietnamese meaning
      items.push({
        id: `v-${vocab.id}`,
        text: vocab.wordVietnamese,
        type: 'vietnamese',
        isSelected: false,
        isMatched: false,
        matchedWithId: null,
      });
    });

    setMatchingItems(shuffle(items));
    setIsStarted(true);
  };

  const handleItemClick = (item: MatchingItem) => {
    if (item.isMatched) return;

    if (!selectedItem) {
      // First selection
      setSelectedItem(item);
      setMatchingItems(items =>
        items.map(i => i.id === item.id ? { ...i, isSelected: true } : i)
      );
    } else if (selectedItem.id === item.id) {
      // Deselect
      setSelectedItem(null);
      setMatchingItems(items =>
        items.map(i => i.id === item.id ? { ...i, isSelected: false } : i)
      );
    } else {
      // Second selection - check if it's a match
      const isMatch = 
        selectedItem.id.substring(2) === item.id.substring(2) && 
        selectedItem.type !== item.type;

      if (isMatch) {
        // Match found
        setMatchingItems(items =>
          items.map(i => 
            i.id === selectedItem.id || i.id === item.id
              ? { ...i, isMatched: true, isSelected: false, matchedWithId: i.id === selectedItem.id ? item.id : selectedItem.id }
              : i
          )
        );
        setSelectedItem(null);

        // Check if all items are matched
        const updatedItems = matchingItems.map(i => 
          i.id === selectedItem.id || i.id === item.id
            ? { ...i, isMatched: true }
            : i
        );
        if (updatedItems.every(i => i.isMatched)) {
          setIsFinished(true);
        }
      } else {
        // No match - deselect both
        setMatchingItems(items =>
          items.map(i => 
            i.id === selectedItem.id || i.id === item.id
              ? { ...i, isSelected: false }
              : i
          )
        );
        setSelectedItem(null);
      }
    }
  };

  if (isFinished) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Chúc mừng!</h2>
            <p className="text-lg mb-6">
              Bạn đã hoàn thành trò chơi ghép từ trong{' '}
              <span className="font-bold">{formatTime(timeElapsed)}</span>
            </p>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => window.location.reload()}
            >
              Chơi lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex items-center gap-2 text-lg">
          <Timer className="w-5 h-5" />
          <span className="font-medium">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {matchingItems.map((item) => (
          <Card
            key={item.id}
            className={`
              cursor-pointer transition-all transform hover:scale-105
              ${item.isSelected ? 'ring-2 ring-red-500' : ''}
              ${item.isMatched ? 'bg-green-50' : ''}
              ${!item.isMatched && !item.isSelected ? 'hover:shadow-lg' : ''}
            `}
            onClick={() => handleItemClick(item)}
          >
            <CardContent className="p-4 text-center">
              <p className={`
                text-lg font-medium
                ${item.type === 'korean' ? 'text-red-600' : 'text-blue-600'}
              `}>
                {item.text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VocabularyMatching; 