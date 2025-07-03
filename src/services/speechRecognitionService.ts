class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;

  initialize(): SpeechRecognition | null {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';
    recognition.maxAlternatives = 1;

    this.recognition = recognition;
    return recognition;
  }

  isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  start() {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService(); 