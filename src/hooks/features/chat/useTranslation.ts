import { useState } from 'react';
import { translationService } from '@/services/translationService';

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const translateText = async (text: string, sourceLang: string = 'ko', targetLang: string = 'vi') => {
    // Kiểm tra cache trước khi dịch
    if (translations[text]) {
      return translations[text];
    }

    setIsTranslating(true);
    try {
      const translatedText = await translationService.translateText(text, sourceLang, targetLang);
      // Lưu vào cache
      setTranslations(prev => ({ ...prev, [text]: translatedText }));
      return translatedText;
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translateText,
    isTranslating,
    translations
  };
}; 