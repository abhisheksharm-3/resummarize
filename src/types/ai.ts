import { ChatMessage } from "./chat";

export interface SummarizationOptions {
  type: "brief" | "detailed" | "actionable" | "todo" | "keypoints";
}



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





/**
 * Response type for chat operations
 */
export interface ChatResponse {
  success: boolean;
  message?: ChatMessage;
  error?: string;
}