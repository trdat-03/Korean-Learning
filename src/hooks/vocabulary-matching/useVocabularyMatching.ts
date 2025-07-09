import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LessonDetailType } from '@/models/LessonDetail';
import type { MatchingItem } from '@/types/vocabulary-matching';
import { generateMatchingItems, checkMatch } from '@/services/learning/vocabularyMatchingService';

export const useVocabularyMatching = (
  lesson: LessonDetailType | undefined,
  vocabularyCount: number
) => {
  const navigate = useNavigate();
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
    const items = generateMatchingItems(lesson!, vocabularyCount);
    setMatchingItems(items);
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
      const isMatch = checkMatch(selectedItem, item);

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

  return {
    timeElapsed,
    isStarted,
    isFinished,
    matchingItems,
    selectedItem,
    formatTime,
    handleBack,
    handleItemClick,
    startMatching
  };
}; 