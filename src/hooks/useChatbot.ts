import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Note } from "@/types/supabase";
import { chatbotService, ChatMessage, ChatMode } from '@/services/ai/chatbotService';
import { useLocalStorage } from './useLocalStorage';

export const useChatbot = (notes?: Note[]) => {
  const [storedMessages, setStoredMessages] = useLocalStorage<ChatMessage[]>('chatbot-messages', []);
  const [storedMode, setStoredMode] = useLocalStorage<ChatMode>('chatbot-mode', 'notes');
  const [isOpen, setIsOpen] = useLocalStorage('chatbot-open', false);
  
  const [messages, setMessages] = useState<ChatMessage[]>(storedMessages);
  const [mode, setMode] = useState<ChatMode>(storedMode);
  
  const queryClient = useQueryClient();

  // Sync state with localStorage
  useEffect(() => {
    setStoredMessages(messages);
  }, [messages, setStoredMessages]);

  useEffect(() => {
    setStoredMode(mode);
  }, [mode, setStoredMode]);

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (content: string) => {
      const userMessage: ChatMessage = { 
        role: "user", 
        content,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      const response = await chatbotService.sendMessage(
        content, 
        mode, 
        [...messages, userMessage], 
        notes
      );
      
      return response;
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

  const toggleChat = () => setIsOpen(!isOpen);
  const closeChat = () => setIsOpen(false);
  const openChat = () => setIsOpen(true);
  
  const clearChat = () => setMessages([]);
  
  const switchMode = (newMode: ChatMode) => {
    setMode(newMode);
    // Don't clear chat automatically to preserve context
  };

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
    clearChat
  };
};