import { Alert, AlertTitle, AlertDescription } from './alert';

interface AlertAiUsageCountProps {
  aiUsageCount: number;
}

export function AlertAiUsageCount({ aiUsageCount }: AlertAiUsageCountProps) {
  const isUnlimited = aiUsageCount === -1;
  return (
    <Alert
      className={`mt-2 px-3 py-2 border ${
        isUnlimited ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'
      }`}
    >
      <AlertTitle className="text-sm font-medium mb-0">
        {isUnlimited ? 'Không giới hạn AI' : 'Số lượt sử dụng AI còn lại'}
      </AlertTitle>
      <AlertDescription className="text-sm mt-1">
        {isUnlimited ? (
          <span>Bạn có thể <b>thoả sức luyện tập</b> với AI mà <b>không giới hạn</b>!</span>
        ) : (
          <span>Bạn còn <b>{aiUsageCount}</b> lượt sử dụng AI.</span>
        )}
      </AlertDescription>
    </Alert>
  );
} 