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
/**
 * Configuration options for the chatbot hook
 */
export interface UseChatbotOptions {
  /**
   * Maximum number of messages to keep in history
   * @default 100
   */
  maxHistoryLength?: number;
  
  /**
   * Whether to preserve chat history when switching modes
   * @default true
   */
  preserveHistoryOnModeSwitch?: boolean;
  
  /**
   * Whether to open the chat automatically on first load
   * @default false
   */
  openOnMount?: boolean;
}

/**
 * Return type for the useChatbot hook
 */
export interface UseChatbotReturn {
  /**
   * All chat messages in the current conversation
   */
  messages: ChatMessage[];
  
  /**
   * Function to send a new message to the chatbot
   */
  sendMessage: (content: string) => void;
  
  /**
   * Whether a message is currently being sent/processed
   */
  isSending: boolean;
  
  /**
   * Whether the chat UI is open
   */
  isOpen: boolean;
  
  /**
   * Toggle the chat open/closed state
   */
  toggleChat: () => void;
  
  /**
   * Close the chat
   */
  closeChat: () => void;
  
  /**
   * Open the chat
   */
  openChat: () => void;
  
  /**
   * Current chatbot mode (notes or therapist)
   */
  mode: ChatMode;
  
  /**
   * Switch between chatbot modes
   */
  switchMode: (newMode: ChatMode) => void;
  
  /**
   * Clear all chat history
   */
  clearChat: () => void;
  
  /**
   * Last error that occurred during chat interaction
   */
  lastError: Error | null;
}

