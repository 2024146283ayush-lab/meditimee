export function speak(text: string, language: 'en' | 'hi' = 'en') {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (voice) => voice.lang === (language === 'hi' ? 'hi-IN' : 'en-US')
  );

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function speakMedicineReminder(
  medicineName: string,
  dosage: string,
  language: 'en' | 'hi' = 'en'
) {
  const messages = {
    en: `It's time to take your medicine. Please take ${medicineName}, ${dosage}.`,
    hi: `आपकी दवाई लेने का समय हो गया है। कृपया ${medicineName} लें, ${dosage}।`,
  };

  speak(messages[language], language);
}

export function speakEmergencyAlert(language: 'en' | 'hi' = 'en') {
  const messages = {
    en: 'Emergency alert sent to your family members. Help is on the way.',
    hi: 'आपातकालीन अलर्ट आपके परिवार के सदस्यों को भेज दिया गया है। मदद आ रही है।',
  };

  speak(messages[language], language);
}

export function playNotificationSound() {
  if (typeof window === 'undefined') return;

  const audio = new Audio('/sounds/notification.mp3');
  audio.volume = 0.7;
  audio.play().catch(() => {});
}

export function playEmergencySound() {
  if (typeof window === 'undefined') return;

  const audio = new Audio('/sounds/emergency.mp3');
  audio.volume = 1;
  audio.play().catch(() => {});
}
