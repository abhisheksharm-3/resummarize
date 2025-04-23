export interface SummarizationOptions {
  type: "brief" | "detailed" | "actionable" | "todo" | "keypoints";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type ChatMode = "notes" | "therapist";

export type SummaryType = "brief" | "actionable" | "todo" | "keypoints";
export /**
* Options for AI summarization queries
*/
interface SummaryQueryOptions {
 staleTime?: number;
 retry?: boolean | number;
 retryDelay?: number;
 enabled?: boolean;
}