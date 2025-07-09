class TranslationService {
  private baseUrl = 'https://api.mymemory.translated.net/get';

  async translateText(text: string, sourceLang: string = 'ko', targetLang: string = 'vi'): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
      );
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }
}

export const translationService = new TranslationService(); 