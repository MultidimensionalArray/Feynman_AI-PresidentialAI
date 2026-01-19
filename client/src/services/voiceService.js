class VoiceService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.onResult = null;
    this.onError = null;
    this.onEnd = null;
    
    this.initializeSpeechRecognition();
  }

  // Initialize Speech Recognition
  initializeSpeechRecognition() {
    // eslint-disable-next-line no-undef
    if ('webkitSpeechRecognition' in window) {
      // eslint-disable-next-line no-undef
      this.recognition = new webkitSpeechRecognition();
    // eslint-disable-next-line no-undef
    } else if ('SpeechRecognition' in window) {
      // eslint-disable-next-line no-undef
      this.recognition = new SpeechRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (this.onResult) {
        this.onResult(finalTranscript, interimTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) {
        this.onEnd();
      }
    };
  }

  // Text-to-Speech Methods
  speak(text, options = {}) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Stop any current speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice options
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.lang = options.lang || 'en-US';

    const voices = this.synthesis.getVoices();
    if (options.voice && typeof options.voice === 'object') {
      utterance.voice = options.voice;
    } else if (options.voiceName) {
      const selected = voices.find((voice) => voice.name === options.voiceName);
      if (selected) {
        utterance.voice = selected;
      }
    } else if (options.preferredVoices && options.preferredVoices.length > 0) {
      const preferredVoice = voices.find((voice) =>
        options.preferredVoices.some((name) =>
          voice.name.toLowerCase().includes(name.toLowerCase()),
        ),
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    } else {
      const preferredVoice = voices.find((voice) =>
        voice.name.includes('Google') ||
        voice.name.includes('Microsoft') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Alex'),
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      console.error('Speech synthesis error:', event.error);
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  pauseSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  resumeSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.resume();
    }
  }

  // Speech Recognition Methods
  startListening(options = {}) {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = options.lang || 'en-US';
    this.recognition.continuous = options.continuous || false;
    this.recognition.interimResults = options.interimResults !== false;
    
    this.onResult = options.onResult;
    this.onError = options.onError;
    this.onEnd = options.onEnd;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  abortListening() {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
    }
  }

  // Utility Methods
  isSupported() {
    return {
      tts: !!this.synthesis,
      recognition: !!this.recognition
    };
  }

  getAvailableVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // Preload voices (call this after page load)
  preloadVoices() {
    if (this.synthesis.getVoices().length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        // Voices are now loaded
      });
    }
  }

  // Clean up
  destroy() {
    this.stopSpeaking();
    this.stopListening();
    this.onResult = null;
    this.onError = null;
    this.onEnd = null;
  }
}

// Create a singleton instance
const voiceService = new VoiceService();

export default voiceService;
