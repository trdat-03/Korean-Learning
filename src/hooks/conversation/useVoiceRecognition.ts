import { useState, useEffect } from 'react';
import { speechRecognitionService } from '@/services/communication/speechRecognitionService';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string) => void;
}

export const useVoiceRecognition = ({ onTranscript }: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    setIsSupported(speechRecognitionService.isSupported());
    const recognitionInstance = speechRecognitionService.initialize();

    if (recognitionInstance) {
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);

      return () => {
        recognitionInstance.stop();
      };
    }
  }, [onTranscript]);

  const startListening = () => {
    if (recognition && !isListening) {
      speechRecognitionService.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      speechRecognitionService.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening
  };
}; 