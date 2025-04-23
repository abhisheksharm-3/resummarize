import { Note } from "@/types/supabase";
import { getGeminiModel, isConfigured } from "./geminiClient";
import { SummarizationOptions } from "@/types/ai";

const SUMMARY_PROMPTS = {
  brief: "Summarize this note in 2-3 sentences:",
  detailed: "Provide a comprehensive summary of this note:",
  actionable: "Extract actionable items from this note:",
  todo: "Convert this note into a to-do list:",
  keypoints: "Extract the key points from this note:",
};

export class SummarizationService {
  async summarizeNote(note: Note, options: SummarizationOptions) {
    try {
      if (!isConfigured()) {
        throw new Error("Gemini API key not configured");
      }
      
      const model = getGeminiModel();
      const prompt = `${SUMMARY_PROMPTS[options.type]}\n\nTitle: ${note.title}\nContent: ${note.content}`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      return {
        summary: text,
        type: options.type
      };
    } catch (error) {
      console.error("Error summarizing note:", error);
      throw error;
    }
  }
  
  async summarizeMultipleNotes(notes: Note[], options: SummarizationOptions) {
    try {
      if (!isConfigured()) {
        throw new Error("Gemini API key not configured");
      }
      
      const model = getGeminiModel();
      const notesContent = notes.map(note => `Title: ${note.title}\nContent: ${note.content}`).join("\n\n---\n\n");
      const prompt = `${SUMMARY_PROMPTS[options.type]}\n\nMultiple notes content:\n${notesContent}`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      return {
        summary: text,
        type: options.type
      };
    } catch (error) {
      console.error("Error summarizing multiple notes:", error);
      throw error;
    }
  }
  
  async generateInsights(notes: Note[]) {
    try {
      if (!isConfigured()) {
        throw new Error("Gemini API key not configured");
      }
      
      const model = getGeminiModel();
      const notesContent = notes.map(note => `Title: ${note.title}\nContent: ${note.content}`).join("\n\n---\n\n");
      const prompt = `Analyze these notes and provide insights, patterns, and recommendations. 
      Include: 
      1. Common themes 
      2. Actionable items
      3. Priority suggestions
      4. Areas that need more detail or clarity
      \n\nNotes content:\n${notesContent}`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      return {
        insights: text
      };
    } catch (error) {
      console.error("Error generating insights:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const summarizationService = new SummarizationService();
