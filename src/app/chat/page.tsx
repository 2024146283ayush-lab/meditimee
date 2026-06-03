"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore, useAppStore, useSettingsStore } from "@/store";
import { t } from "@/lib/translations";
import { speak } from "@/lib/voice";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const healthTips = {
  en: [
    "Take your medicines at the same time each day for better results.",
    "Drink plenty of water throughout the day to help your body absorb medicines.",
    "Always complete the full course of antibiotics even if you feel better.",
    "Keep a regular sleep schedule to support your overall health.",
    "Eat a balanced diet rich in fruits and vegetables.",
    "Exercise regularly, even a 30-minute walk can make a difference.",
    "Keep track of your blood pressure and blood sugar levels.",
    "Never share your prescription medicines with others.",
  ],
  hi: [
    "बेहतर परिणामों के लिए हर दिन एक ही समय पर दवाइयाँ लें।",
    "अपने शरीर को दवाइयों को अवशोषित करने में मदद करने के लिए दिन भर खूब पानी पिएं।",
    "अगर आप बेटर महसूस करते हैं तो भी एंटीबायोटिक्स का पूरा कोर्स हमेशा पूरा करें।",
    "अपने समग्र स्वास्थ्य का समर्थन करने के लिए नियमित नींद का कार्यक्रम बनाए रखें।",
    "फलों और सब्जियों से भरपूर संतुलित आहार खाएं।",
    "नियमित रूप से व्यायाम करें, यहां तक कि 30 मिनट की सैर भी फर्क पैदा कर सकती है।",
    "अपने ब्लड प्रेशर और ब्लड शुगर के स्तर को ट्रैक करें।",
    "कभी भी अपनी प्रिस्क्रिप्शन दवाइयाँ दूसरों के साथ साझा न करें।",
  ],
};

function generateAIResponse(userMessage: string, language: "en" | "hi"): string {
  const lowerMessage = userMessage.toLowerCase();

  const responses = {
    en: {
      greeting: "Hello! I'm your AI health assistant. How can I help you today?",
      medicine: "For medicine-related queries, please make sure to:\n1. Take medicines at the scheduled times\n2. Follow dosage instructions carefully\n3. Complete the full course\n4. Store medicines properly",
      dosage: "Dosage instructions should be followed exactly as prescribed. If you have questions about your dosage, please consult your doctor.",
      side_effects: "If you experience any side effects from your medication, contact your healthcare provider immediately. Common side effects may include nausea, headache, or dizziness.",
      schedule: "You can view and manage your medicine schedule in the Medicines section. Would you like me to help you set up a reminder?",
      emergency: "For emergencies, please use the Emergency SOS feature or call emergency services immediately. Your safety is our priority.",
      general: `Here's a health tip: ${healthTips.en[Math.floor(Math.random() * healthTips.en.length)]}`,
    },
    hi: {
      greeting: "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      medicine: "दवाइयों से संबंधित प्रश्नों के लिए, कृपया सुनिश्चित करें:\n1. निर्धारित समय पर दवाइयाँ लें\n2. खुराक के निर्देशों का सावधानी से पालन करें\n3. पूरा कोर्स पूरा करें\n4. दवाइयों को ठीक से संग्रहित करें",
      dosage: "खुराक के निर्देशों का ठीक वैसे ही पालन करना चाहिए जैसे निर्धारित किया गया है। अपनी खुराक के बारे में प्रश्न हों तो कृपया अपने डॉक्टर से परामर्श करें।",
      side_effects: "अगर आपको अपनी दवा से कोई साइड इफेक्ट होता है, तो तुरंत अपने स्वास्थ्य सेवा प्रदाता से संपर्क करें।",
      schedule: "आप दवाइयाँ अनुभाग में अपना दवा शेड्यूल देख और प्रबंधित कर सकते हैं। क्या आप चाहेंगे कि मैं आपको रिमाइंडर सेट करने में मदद करूँ?",
      emergency: "आपातकाल के लिए, कृपया आपातकाल SOS सुविधा का उपयोग करें या तुरंत आपातकालीन सेवाओं को कॉल करें।",
      general: `यहाँ एक स्वास्थ्य सुझाव है: ${healthTips.hi[Math.floor(Math.random() * healthTips.hi.length)]}`,
    },
  };

  const langResponses = responses[language];

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("नमस्ते")) {
    return langResponses.greeting;
  }
  if (lowerMessage.includes("medicine") || lowerMessage.includes("दवा") || lowerMessage.includes("drug")) {
    return langResponses.medicine;
  }
  if (lowerMessage.includes("dosage") || lowerMessage.includes("खुराक") || lowerMessage.includes("how much")) {
    return langResponses.dosage;
  }
  if (lowerMessage.includes("side effect") || lowerMessage.includes("reaction") || lowerMessage.includes("साइड इफेक्ट")) {
    return langResponses.side_effects;
  }
  if (lowerMessage.includes("schedule") || lowerMessage.includes("reminder") || lowerMessage.includes("शेड्यूल")) {
    return langResponses.schedule;
  }
  if (lowerMessage.includes("emergency") || lowerMessage.includes("help") || lowerMessage.includes("आपातकाल")) {
    return langResponses.emergency;
  }

  return langResponses.general;
}

export default function ChatPage() {
  const { language } = useSettingsStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: generateAIResponse("hello", language),
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(input, language);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSpeak = (text: string) => {
    speak(text, language);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="bg-card rounded-t-2xl border border-card-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{t("chat.title", language)}</h2>
            <p className="text-sm text-secondary">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-card border-x border-card-border p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-background border border-card-border rounded-bl-md"
              }`}
            >
              <p className={`whitespace-pre-line ${message.role === "user" ? "text-white" : "text-foreground"}`}>
                {message.content}
              </p>
              <div className={`flex items-center justify-between mt-2 ${message.role === "user" ? "text-white/70" : "text-muted"}`}>
                <span className="text-xs">
                  {message.timestamp.toLocaleTimeString(language === "hi" ? "hi-IN" : "en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.role === "assistant" && (
                  <button
                    onClick={() => handleSpeak(message.content)}
                    className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-background border border-card-border p-4 rounded-2xl rounded-bl-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-card rounded-b-2xl border border-card-border p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("chat.placeholder", language)}
            className="flex-1 px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
