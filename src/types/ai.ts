export type SummaryType = 
  | "brief" 
  | "detailed" 
  | "actionable" 
  | "todo" 
  | "keypoints";

export interface SummarizationOptions {
  type: SummaryType;
  maxLength?: number;
}