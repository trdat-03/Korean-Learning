import { Card, CardContent } from '@/components/ui/card';
import type { MatchingItem } from '@/types/vocabulary-matching';

interface MatchingCardProps {
  item: MatchingItem;
  onClick: (item: MatchingItem) => void;
}

export const MatchingCard = ({ item, onClick }: MatchingCardProps) => {
  return (
    <Card
      className={`
        cursor-pointer transition-all transform hover:scale-105
        ${item.isSelected ? 'ring-2 ring-red-500' : ''}
        ${item.isMatched ? 'bg-green-50' : ''}
        ${!item.isMatched && !item.isSelected ? 'hover:shadow-lg' : ''}
      `}
      onClick={() => onClick(item)}
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
  );
}; 