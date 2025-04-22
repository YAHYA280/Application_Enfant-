export interface Message {
  id: string;
  text: string;
  sender: "child" | "ai";
  timestamp: number;
  mediaType?: "text" | "image" | "audio" | "pdf";
  mediaUrl?: string;
  liked?: "like" | "dislike" | "none";
}
export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
  messages?: Message[];
}

export interface AIResponse {
  id: string;
  question: string;
  answer: string;
  illustration?: string;
  audioUrl?: string;
}

// Interface pour le contexte de gestion des chats
export interface ChatContextType {
  currentChat: Message[];
  chatHistory: ChatHistory[];
  addMessage: (message: Message) => void;
  startNewChat: () => void;
  loadChatHistory: (chatId: string) => void;
  updateChatHistory: (chat: ChatHistory) => void;
}
