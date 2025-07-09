
import { useLocation } from 'react-router-dom';
import type { LessonDetailType } from '../models/LessonDetail';
import type { PracticeConfig } from '@/types/practice';
import { usePractice } from '@/hooks/practice/usePractice';
import { PracticeSidebar } from '@/components/practice/PracticeSidebar';
import { PracticeQuestion } from '@/components/practice/PracticeQuestion';
import { PracticeResults } from '@/components/practice/PracticeResults';

const PracticePage = () => {
  const location = useLocation();
  const { config, lesson }: { config: PracticeConfig; lesson: LessonDetailType } = location.state || {};

  const {
    userAnswers,
    questions,
    timeElapsed,
    isFinished,
    showAnswer,
    testResults,
    isSubmitting,
    questionRefs,
    formatTime,
    handleAnswer,
    handleBack,
    scrollToQuestion,
    getQuestionStatus,
    calculateScore,
    handleFinish,
    toggleShowAnswer
  } = usePractice(config, lesson);

  if (isFinished) {
    return (
      <PracticeResults
        timeElapsed={timeElapsed}
        formatTime={formatTime}
        calculateScore={calculateScore}
        questions={questions}
        userAnswers={userAnswers}
        testResults={testResults}
        isSubmitting={isSubmitting}
        handleBack={handleBack}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <PracticeSidebar
          questions={questions}
          userAnswers={userAnswers}
          timeElapsed={timeElapsed}
          formatTime={formatTime}
          handleBack={handleBack}
          scrollToQuestion={scrollToQuestion}
          getQuestionStatus={getQuestionStatus}
          handleFinish={handleFinish}
        />

        <div className="flex-1">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                ref={el => {
                  if (el) questionRefs.current[question.id] = el;
                }}
                className="scroll-mt-4"
              >
                <PracticeQuestion
                  question={question}
                  index={index}
                  userAnswer={userAnswers[question.id] || ''}
                  showAnswer={showAnswer}
                  getQuestionStatus={getQuestionStatus}
                  handleAnswer={handleAnswer}
                  toggleShowAnswer={toggleShowAnswer}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage; 