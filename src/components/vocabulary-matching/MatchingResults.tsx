import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface MatchingResultsProps {
  timeElapsed: number;
  formatTime: (seconds: number) => string;
  handleBack: () => void;
}

export const MatchingResults = ({
  timeElapsed,
  formatTime,
  handleBack
}: MatchingResultsProps) => {
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
}; 