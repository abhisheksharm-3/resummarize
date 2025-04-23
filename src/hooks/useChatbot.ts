'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Note } from "@/types/supabase";

import { ChatMessage, ChatMode, UseChatbotOptions, UseChatbotReturn } from '@/types/chat';
import { sendMessage as sendMessageToServer } from '@/services/ai/chatbotService';
import { useLocalStorage } from '@/hooks/useLocalStorage';

/**
 * Custom hook for managing chatbot interactions with the AI service
 * 
 * @param notes - Optional array of notes to provide context to the chatbot
 * @param options - Configuration options for chatbot behavior
 * @returns Object containing chatbot state and control functions
 */
export function useChatbot(
  notes?: Note[],
  options: UseChatbotOptions = {}
): UseChatbotReturn {
  // Apply default options
  const {
    maxHistoryLength = 100,
    preserveHistoryOnModeSwitch = true,
    openOnMount = false,
  } = options;
  
  // Local storage for persistence
  const [storedMessages, setStoredMessages] = useLocalStorage<ChatMessage[]>('chatbot-messages', []);
  const [storedMode, setStoredMode] = useLocalStorage<ChatMode>('chatbot-mode', 'notes');
  const [isOpen, setIsOpen] = useLocalStorage('chatbot-open', openOnMount);
  
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>(storedMessages);
  const [mode, setMode] = useState<ChatMode>(storedMode);
  const [lastError, setLastError] = useState<Error | null>(null);
  
  // Refs to track if we need to sync with localStorage - prevents unnecessary updates
  const messagesRef = useRef(messages);
  const modeRef = useRef(mode);
  
  // React Query utilities for cache management
  const queryClient = useQueryClient();

  // Sync to localStorage only when messages actually change
  useEffect(() => {
    if (JSON.stringify(messagesRef.current) !== JSON.stringify(messages)) {
      const trimmedMessages = messages.slice(-maxHistoryLength);
      setStoredMessages(trimmedMessages);
      messagesRef.current = messages;
    }
  }, [messages, setStoredMessages, maxHistoryLength]);

  // Sync mode changes to localStorage
  useEffect(() => {
    if (modeRef.current !== mode) {
      setStoredMode(mode);
      modeRef.current = mode;
    }
  }, [mode, setStoredMode]);

  /**
   * Send message mutation using React Query
   * Optimistically updates UI and handles errors
   */
  const { mutate: sendMessageMutation, isPending: isSending } = useMutation({
    mutationFn: async (content: string): Promise<ChatMessage> => {
      // Reset any previous errors
      setLastError(null);
      
      // Create user message
      const userMessage: ChatMessage = { 
        role: "user", 
        content,
        timestamp: new Date().toISOString()
      };
      
      // Optimistically add user message
      setMessages(prev => [...prev, userMessage]);
      
      try {
        // Call the server action
        const response = await sendMessageToServer(
          content, 
          mode, 
          [...messages, userMessage], 
          notes
        );
        
        // Handle the ChatResponse type
        if (response.success && response.message) {
          return response.message;
        } else {
          throw new Error(response.error || 'Failed to get response from AI');
        }
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setLastError(errorObj);
        throw errorObj;
      }
    },
    onSuccess: (responseMessage) => {
      // Add the AI's response to the messages
      setMessages(prev => [...prev, responseMessage]);
      queryClient.invalidateQueries({ queryKey: ['chatbot'] });
    },
    onError: (error) => {
      // Handle unexpected errors
      console.error('Error in chatbot:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: "model", 
          content: "I'm sorry, I encountered an error. Please try again.", 
          timestamp: new Date().toISOString() 
        }
      ]);
    }
  });

  /**
   * Send a message to the chatbot
   * @param content - Message text to send
   */
  const sendMessage = useCallback((content: string) => {
    if (content.trim()) {
      sendMessageMutation(content);
    }
  }, [sendMessageMutation]);

  /**
   * Toggle chat visibility
   */
  const toggleChat = useCallback(() => setIsOpen(prev => !prev), [setIsOpen]);
  
  /**
   * Close the chat interface
   */
  const closeChat = useCallback(() => setIsOpen(false), [setIsOpen]);
  
  /**
   * Open the chat interface
   */
  const openChat = useCallback(() => setIsOpen(true), [setIsOpen]);
  
  /**
   * Clear all chat messages
   */
  const clearChat = useCallback(() => setMessages([]), []);
  
  /**
   * Switch between chat modes
   * @param newMode - Chat mode to switch to
   */
  const switchMode = useCallback((newMode: ChatMode) => {
    setMode(newMode);
    
    if (!preserveHistoryOnModeSwitch) {
      clearChat();
    }
  }, [preserveHistoryOnModeSwitch, clearChat]);

  return {
    messages,
    sendMessage,
    isSending,
    isOpen,
    toggleChat,
    closeChat,
    openChat,
    mode,
    switchMode,
    clearChat,
    lastError
  };
}