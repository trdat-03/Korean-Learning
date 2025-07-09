import { useState, useCallback } from 'react';
import { speechService } from '@/services/speechService';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const speak = useCallback((text: string, messageId: string, lang: string = 'vi-VN') => {
    if (isSpeaking === messageId) {
      stopSpeaking();
      return;
    }

    const utterance = speechService.speak(text, { lang });
    
    utterance.onstart = () => setIsSpeaking(messageId);
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);
  }, [isSpeaking]);

  const stopSpeaking = useCallback(() => {
    speechService.stop();
    setIsSpeaking(null);
  }, []);

  return {
    speak,
    stopSpeaking,
    isSpeaking
  };
};