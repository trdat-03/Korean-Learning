import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Timer, ArrowLeft } from 'lucide-react';
import type { LessonDetailType } from '@/models/LessonDetail';
import { useVocabularyMatching } from '@/hooks/vocabulary-matching/useVocabularyMatching';
import { MatchingCard } from '@/components/vocabulary-matching/MatchingCard';
import { MatchingResults } from '@/components/vocabulary-matching/MatchingResults';

const VocabularyMatchingPage = () => {
  const location = useLocation();
  const { lesson, vocabularyCount }: { lesson: LessonDetailType; vocabularyCount: number } = location.state || {};

  const {
    timeElapsed,
    isFinished,
    matchingItems,
    formatTime,
    handleBack,
    handleItemClick
  } = useVocabularyMatching(lesson, vocabularyCount);

  if (isFinished) {
    return (
      <MatchingResults
        timeElapsed={timeElapsed}
        formatTime={formatTime}
        handleBack={handleBack}
      />
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
          <MatchingCard
            key={item.id}
            item={item}
            onClick={handleItemClick}
          />
        ))}
      </div>
    </div>
  );
};

export default VocabularyMatchingPage; 