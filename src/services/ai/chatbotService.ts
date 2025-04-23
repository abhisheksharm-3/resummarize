import { Note } from "@/types/supabase";
import { getGeminiModel, isConfigured } from "./geminiClient";
import { CHAT_PROMPTS } from "@/lib/constants/prompts";

export type ChatMode = "notes" | "therapist";

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export class ChatbotService {
  async sendMessage(message: string, mode: ChatMode, history: ChatMessage[], notes?: Note[]) {
    try {
      if (!isConfigured()) {
        throw new Error("Gemini API key not configured");
      }
      
      const model = getGeminiModel();
      
      // Convert history to format Gemini expects
      const formattedHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      // Get the appropriate prompt based on chat mode
      const modelPrompt = CHAT_PROMPTS[mode];
      let notesContext = "";
      
      if (mode === "notes" && notes && notes.length > 0) {
        // Limit the number of notes to prevent exceeding API limits
        const limitedNotes = notes.slice(0, 3);
        notesContext = limitedNotes.map(note => 
          `Note titled "${note.title}":\n${note.content.substring(0, 500)}${note.content.length > 500 ? '...' : ''}`
        ).join("\n\n");
      }

      // Initialize chat without system instruction
      const chat = model.startChat({
        history: formattedHistory
      });
      
      // Add context to the message if needed
      let fullMessage = message;
      
      // If this is the first message, add the role description and notes context
      if (history.length === 0 || (history.length === 1 && history[0].role === "user")) {
        fullMessage = `${modelPrompt}\n\n${notesContext ? `Context from my notes:\n${notesContext}\n\n` : ''}User message: ${message}`;
      } else if (mode === "notes" && notesContext) {
        // Add notes context to subsequent messages if needed
        fullMessage = `Context from notes:\n${notesContext}\n\nUser message: ${message}`;
      }
      
      const result = await chat.sendMessage(fullMessage);
      const response = result.response.text();
      
      return {
        role: "model" as const,
        content: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const chatbotService = new ChatbotService();