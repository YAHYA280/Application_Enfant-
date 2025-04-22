export interface MessageAssistantAi {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
  mediaType?: "text" | "image" | "audio" | "document";
  mediaUrl?: string;
  status?: "sending" | "sent" | "failed"
  isAttachment?: boolean;
  metadata?: {
    questionId?: string;
    exerciseId?: string;
    keywords?: string[];
  };
  liked?: "like" | "dislike" | "none";
}

export interface AttachmentData {
  images: string[];
  audioRecording?: string;
  documents?: string[];
}
