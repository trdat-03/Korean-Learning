import type { LessonDetailType } from '@/models/LessonDetail';
import type { PracticeConfig, PracticeQuestion } from '@/types/practice';
import type { Vocabulary } from '@/models/Vocabulary';
import type { Grammar } from '@/models/Grammar';
import { shuffle } from '@/lib/utils';

export const generateQuestions = (lesson: LessonDetailType, config: PracticeConfig): PracticeQuestion[] => {
  const { vocabularies, grammars } = lesson;
  const allVocabs = [...vocabularies];
  const allGrammars = grammars || [];
  const vocabQuestionPool: PracticeQuestion[] = [];

  // Tạo câu hỏi trắc nghiệm
  if (config.types.multipleChoice) {
    allVocabs.forEach((vocab: Vocabulary) => {
      const otherOptions = shuffle(
        allVocabs.filter((v: Vocabulary) => v.id !== vocab.id)
      ).slice(0, 3);

      if (config.format.answerWithTerm) {
        vocabQuestionPool.push({
          id: `mc-term-${vocab.id}`,
          type: 'multipleChoice',
          question: `Từ nào có nghĩa là "${vocab.wordVietnamese}"?`,
          correctAnswer: vocab.wordKorean,
          options: shuffle([
            vocab.wordKorean,
            ...otherOptions.map((o: Vocabulary) => o.wordKorean),
          ]),
        });
      }
      if (config.format.answerWithDefinition) {
        vocabQuestionPool.push({
          id: `mc-def-${vocab.id}`,
          type: 'multipleChoice',
          question: `"${vocab.wordKorean}" có nghĩa là gì?`,
          correctAnswer: vocab.wordVietnamese,
          options: shuffle([
            vocab.wordVietnamese,
            ...otherOptions.map((o: Vocabulary) => o.wordVietnamese),
          ]),
        });
      }
    });
  }

  // Tạo câu hỏi tự luận
  if (config.types.written) {
    allVocabs.forEach((vocab: Vocabulary) => {
      if (config.format.answerWithTerm) {
        vocabQuestionPool.push({
          id: `written-term-${vocab.id}`,
          type: 'written',
          question: `Viết từ tiếng Hàn có nghĩa là "${vocab.wordVietnamese}"`,
          correctAnswer: vocab.wordKorean,
        });
      }
      if (config.format.answerWithDefinition) {
        vocabQuestionPool.push({
          id: `written-def-${vocab.id}`,
          type: 'written',
          question: `Viết nghĩa tiếng Việt của từ "${vocab.wordKorean}"`,
          correctAnswer: vocab.wordVietnamese,
        });
      }
    });
  }

  // Tạo câu hỏi đúng/sai
  if (config.types.trueFalse) {
    allVocabs.forEach((vocab: Vocabulary) => {
      vocabQuestionPool.push({
        id: `tf-correct-${vocab.id}`,
        type: 'trueFalse',
        question: `"${vocab.wordKorean}" có nghĩa là "${vocab.wordVietnamese}"`,
        correctAnswer: 'true',
      });

      const wrongVocab = allVocabs.find((v: Vocabulary) => v.id !== vocab.id);
      if (wrongVocab) {
        vocabQuestionPool.push({
          id: `tf-wrong-${vocab.id}`,
          type: 'trueFalse',
          question: `"${vocab.wordKorean}" có nghĩa là "${wrongVocab.wordVietnamese}"`,
          correctAnswer: 'false',
        });
      }
    });
  }

  // Tạo câu hỏi từ ngữ pháp
  const grammarQuestionPool: PracticeQuestion[] = [];
  if (allGrammars.length > 0) {
    allGrammars.forEach((grammar: Grammar) => {
      if (config.types.multipleChoice) {
        grammarQuestionPool.push({
          id: `grammar-mc-${grammar.id}`,
          type: 'multipleChoice',
          question: `Cấu trúc ngữ pháp nào được sử dụng để ${grammar.meaning}?`,
          correctAnswer: grammar.structure,
          options: shuffle([
            grammar.structure,
            ...allGrammars
              .filter((g: Grammar) => g.id !== grammar.id)
              .slice(0, 3)
              .map((g: Grammar) => g.structure),
          ]),
        });
      }

      if (config.types.written) {
        grammarQuestionPool.push({
          id: `grammar-written-${grammar.id}`,
          type: 'written',
          question: `Viết cấu trúc ngữ pháp được sử dụng để ${grammar.meaning}`,
          correctAnswer: grammar.structure,
          hint: grammar.usageDescription,
        });
      }
    });
  }

  // Kết hợp và xáo trộn tất cả câu hỏi
  const allQuestions = shuffle([...vocabQuestionPool, ...grammarQuestionPool]);
  
  // Lấy số lượng câu hỏi theo cấu hình
  return allQuestions.slice(0, config.questionCount);
}; 