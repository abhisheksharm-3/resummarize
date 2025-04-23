import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Note } from "@/types/supabase";
import { chatbotService, ChatMessage, ChatMode } from '@/services/ai/chatbotService';
import { useLocalStorage } from './useLocalStorage';
import { UseChatbotOptions, UseChatbotReturn } from '@/types/chat';

/**
 * Custom hook for managing chatbot interactions
 * 
 * @param notes - Optional array of notes to provide context to the chatbot
 * @param options - Configuration options
 * @returns Chatbot state and control functions
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
  
  // Refs to track if we need to sync with localStorage
  const messagesRef = useRef(messages);
  const modeRef = useRef(mode);
  
  // React Query utilities
  const queryClient = useQueryClient();

  // Only sync to localStorage when needed, not on every render
  useEffect(() => {
    if (JSON.stringify(messagesRef.current) !== JSON.stringify(messages)) {
      const trimmedMessages = messages.slice(-maxHistoryLength);
      setStoredMessages(trimmedMessages);
      messagesRef.current = messages;
    }
  }, [messages, setStoredMessages, maxHistoryLength]);

  useEffect(() => {
    if (modeRef.current !== mode) {
      setStoredMode(mode);
      modeRef.current = mode;
    }
  }, [mode, setStoredMode]);

  // Message sending mutation
  const { mutate: sendMessageMutation, isPending: isSending } = useMutation({
    mutationFn: async (content: string) => {
      setLastError(null);
      
      const userMessage: ChatMessage = { 
        role: "user", 
        content,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      try {
        const response = await chatbotService.sendMessage(
          content, 
          mode, 
          [...messages, userMessage], 
          notes
        );
        
        return response;
      } catch (error) {
        setLastError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    onSuccess: (response) => {
      setMessages(prev => [...prev, response]);
      queryClient.invalidateQueries({ queryKey: ['chatbot'] });
    },
    onError: () => {
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

  // Use callbacks to prevent recreating functions on every render
  const sendMessage = useCallback((content: string) => {
    if (content.trim()) {
      sendMessageMutation(content);
    }
  }, [sendMessageMutation]);

  const toggleChat = useCallback(() => setIsOpen(prev => !prev), [setIsOpen]);
  const closeChat = useCallback(() => setIsOpen(false), [setIsOpen]);
  const openChat = useCallback(() => setIsOpen(true), [setIsOpen]);
  const clearChat = useCallback(() => setMessages([]), []);
  
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