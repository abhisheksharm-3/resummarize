export interface SummarizationOptions {
  type: "brief" | "detailed" | "actionable" | "todo" | "keypoints";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type ChatMode = "notes" | "therapist";
