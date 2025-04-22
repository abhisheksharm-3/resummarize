/**
 * AI prompts for different summarization tasks
 * Centralizing prompts makes it easier to refine and improve them over time
 */

export const SummarizationPrompts = {
  // Single note summarization prompt
  singleNote: (content: string) => `
    Summarize the following note in a concise paragraph highlighting the key points:
    
    ${content}
    
    Keep the summary under 150 characters. Don't include phrases like "This note discusses" or "The text is about".
    Just provide the direct summary.
  `,
  
  // Multiple notes summarization prompt
  multipleNotes: (content: string) => `
    Analyze the following collection of notes and provide a comprehensive summary that:
    
    1. Identifies common themes and topics
    2. Extracts key information and insights
    3. Presents the main ideas in a well-structured format
    
    Notes:
    ${content}
    
    Provide a summary of 3-5 sentences. Be direct and concise.
  `,
};