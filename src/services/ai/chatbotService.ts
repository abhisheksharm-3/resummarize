'use server';

import { Note } from "@/types/supabase";
import { getGeminiModel, isConfigured } from "./geminiClient";
import { CHAT_PROMPTS } from "@/lib/constants/prompts";
import { ChatMessage, ChatMode } from "@/types/chat";
import { ChatResponse } from "@/types/ai";



/**
 * Sends a message to the AI chatbot and returns its response
 * 
 * @param message - User message text
 * @param mode - Chat mode (notes or therapist)
 * @param history - Previous conversation history
 * @param notes - Optional user notes to provide as context
 * @returns ChatResponse containing the AI's message or error details
 */
export async function sendMessage(
  message: string, 
  mode: ChatMode, 
  history: ChatMessage[], 
  notes?: Note[]
): Promise<ChatResponse> {
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
    
    // Prepare notes context if applicable
    const notesContext = prepareNotesContext(mode, notes);
    
    // Initialize chat
    const chat = model.startChat({
      history: formattedHistory
    });
    
    // Prepare the full message with appropriate context
    const fullMessage = prepareFullMessage(message, modelPrompt, notesContext, history);
    
    // Send message to AI model
    const result = await chat.sendMessage(fullMessage);
    const response = result.response.text();
    
    // Return formatted response
    return {
      success: true,
      message: {
        role: "model",
        content: response,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Prepares notes context string based on mode and available notes
 * 
 * @param mode - Chat mode
 * @param notes - User notes
 * @returns Formatted notes context string or empty string
 */
function prepareNotesContext(mode: ChatMode, notes?: Note[]): string {
  if (mode !== "notes" || !notes || notes.length === 0) {
    return "";
  }
  
  // Limit the number of notes to prevent exceeding API limits
  const limitedNotes = notes.slice(0, 3);
  return limitedNotes.map(note => 
    `Note titled "${note.title}":\n${note.content.substring(0, 500)}${note.content.length > 500 ? '...' : ''}`
  ).join("\n\n");
}

/**
 * Prepares the full message for the AI with appropriate context
 * 
 * @param message - Original user message
 * @param modelPrompt - Prompt template for the selected mode
 * @param notesContext - Formatted notes context
 * @param history - Conversation history
 * @returns Complete message with context
 */
function prepareFullMessage(
  message: string, 
  modelPrompt: string, 
  notesContext: string,
  history: ChatMessage[]
): string {
  // If this is the first or second message, add the role description and notes context
  if (history.length === 0 || (history.length === 1 && history[0].role === "user")) {
    return `${modelPrompt}\n\n${notesContext ? `Context from my notes:\n${notesContext}\n\n` : ''}User message: ${message}`;
  } 
  
  // Add notes context to subsequent messages if notes are provided
  if (notesContext) {
    return `Context from notes:\n${notesContext}\n\nUser message: ${message}`;
  }
  
  // Otherwise just return the original message
  return message;
}

/**
 * Validates if the chat service is properly configured
 * 
 * @returns Whether the chat service is ready to use
 */
export async function isChatServiceConfigured(): Promise<boolean> {
  return isConfigured();
}