import { ChatMessage } from "./chat";

/**
 * Options for specifying the type of summarization to perform
 */
export interface SummarizationOptions {
  /** The type of summary to generate */
  type: SummaryType;
}

/**
 * Available summary types that can be requested from the AI
 * - brief: Short, concise summary
 * - detailed: Comprehensive, in-depth summary
 * - actionable: Summary focused on actions that can be taken
 * - todo: Summary in the form of a todo list
 * - keypoints: Summary highlighting the main points
 */
export type SummaryType = "brief" | "actionable" | "todo" | "keypoints";

/**
 * Options for AI summarization queries, typically used with data fetching libraries
 */
export interface SummaryQueryOptions {
  /** Time in milliseconds that data should be considered fresh (for caching) */
  staleTime?: number;
  
  /** Whether to retry failed requests and how many times */
  retry?: boolean | number;
  
  /** Delay between retry attempts in milliseconds */
  retryDelay?: number;
  
  /** Whether the query is enabled */
  enabled?: boolean;
}

/**
 * Response type for chat operations
 */
export interface ChatResponse {
  /** Whether the operation was successful */
  success: boolean;
  
  /** The resulting chat message if operation was successful */
  message?: ChatMessage;
  
  /** Error message if operation failed */
  error?: string;
}