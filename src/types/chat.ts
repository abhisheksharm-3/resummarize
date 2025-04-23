/**
 * Type definition for chat message roles
 */
export type ChatRole = "user" | "model";

/**
 * Type definition for chat messages
 */
export interface ChatMessage {
  /**
   * The content of the message
   */
  content: string;
  
  /**
   * The role of the message sender
   */
  role: ChatRole;
  
  /**
   * Optional timestamp for when the message was sent
   */
  timestamp?: string;
  

}

/**
 * Chat mode options for the chatbot
 */
export type ChatMode = "notes" | "therapist";