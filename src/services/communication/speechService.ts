interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
}

class SpeechService {
  private defaultOptions: SpeechOptions = {
    rate: 0.9,
    pitch: 1
  };

  speak(text: string, options: SpeechOptions = {}) {
    // Dừng speech hiện tại nếu có
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const mergedOptions = { ...this.defaultOptions, ...options };

    utterance.lang = mergedOptions.lang || 'vi-VN';
    utterance.rate = mergedOptions.rate || 0.9;
    utterance.pitch = mergedOptions.pitch || 1;

    speechSynthesis.speak(utterance);
    return utterance;
  }

  stop() {
    speechSynthesis.cancel();
  }
}

export const speechService = new SpeechService(); 