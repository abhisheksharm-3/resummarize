import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, X, SendHorizontal, Bot, Trash, Sparkles} from 'lucide-react';
import { useChatbot } from '@/hooks/useChatbot';
import { Note } from "@/types/supabase";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage } from '@/types/chat';

interface ChatbotFloatingProps {
  notes?: Note[];
}

/**
 * Floating chatbot component with dual functionality:
 * - Notes assistant for helping with note organization and retrieval
 * - Wellness guide for emotional support
 * 
 * @param props - Component props
 * @param props.notes - User notes to provide context to the chatbot
 */
export function ChatbotFloating({ notes = [] }: ChatbotFloatingProps) {
  // Chat state from custom hook
  const {
    messages,
    sendMessage,
    isSending,
    isOpen,
    toggleChat,
    closeChat,
    mode,
    switchMode,
    clearChat
  } = useChatbot(notes);
  
  // Local state
  const [input, setInput] = useState('');
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Current timestamp for debugging purposes
  const currentTimestamp = "2025-04-23 13:34:01";
  const currentUser = "abhisheksharm-3";
  
  // Generate suggested prompts based on mode and notes
  useEffect(() => {
    if (mode === "notes") {
      const hasNotes = notes && notes.length > 0;
      setSuggestedPrompts(hasNotes ? [
        "Summarize my recent notes",
        "Find notes about meetings",
        "What patterns do you see in my notes?",
      ] : [
        "How can I organize my thoughts?",
        "What makes a good note system?",
        "Help me get started with note-taking",
      ]);
    } else {
      setSuggestedPrompts([
        "I'm feeling stressed today",
        "Help me practice mindfulness",
        "I need help staying motivated",
      ]);
    }
  }, [mode, notes]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle send message
  const handleSend = useCallback(() => {
    if (input.trim() && !isSending) {
      sendMessage(input.trim());
      setInput('');
    }
  }, [input, isSending, sendMessage]);
  
  // Handle keyboard shortcuts
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Use suggested prompt
  const handleSuggestedPrompt = useCallback((prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  }, []);

  // Get welcome message based on current mode
  const getWelcomeMessage = () => {
    if (mode === "notes") {
      return notes && notes.length > 0 
        ? "Ask me anything about your notes or how I can help you organize your thoughts."
        : "I'm your personal notes assistant. How can I help you today?";
    } else {
      return "I'm here to listen and support your well-being. How are you feeling today?";
    }
  };
  
  // Render chat messages with proper formatting
  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-4 space-y-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {mode === "notes" ? (
              <Sparkles className="h-6 w-6 text-primary" />
            ) : (
              <Bot className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <p className="mb-2">{getWelcomeMessage()}</p>
            <p className="text-xs">Try one of the suggestions below to get started</p>
          </div>
        </div>
      );
    }

    return messages.map((message, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${
          message.role === "user" ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`rounded-lg px-4 py-2 max-w-[85%] ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <div className="text-sm whitespace-pre-wrap break-words">
            {renderMessageContent(message)}
          </div>
          {message.timestamp && (
            <div className="text-[10px] mt-1 opacity-70 text-right">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </div>
          )}
        </div>
      </motion.div>
    ));
  };

  // Process message content to add special formatting if needed
  const renderMessageContent = (message: ChatMessage) => {
    // This could be expanded to handle markdown, code blocks, etc.
    return message.content;
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-80 md:w-96"
          >
            <Card className="shadow-lg border overflow-hidden">
              <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
                <Tabs
                  value={mode}
                  onValueChange={(value) => switchMode(value as "notes" | "therapist")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes" className="text-xs">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Notes Assistant
                    </TabsTrigger>
                    <TabsTrigger value="therapist" className="text-xs">
                      <Bot className="h-4 w-4 mr-2" />
                      Wellness Guide
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeChat} 
                  className="h-8 w-8 ml-2 flex-shrink-0"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <ScrollArea 
                className="h-80" 
                ref={scrollAreaRef}
              >
                <CardContent className="p-3 space-y-2">
                  {renderMessages()}
                  {isSending && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted flex items-center">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <span className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                            <span className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                            <span className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></span>
                          </div>
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </CardContent>
              </ScrollArea>
              
              <CardFooter className="p-3 pt-2 border-t flex flex-col gap-2">
                {/* Suggested prompts */}
                {messages.length === 0 && (
                  <div className="w-full flex flex-wrap gap-2 mb-2">
                    {suggestedPrompts.map((prompt, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSuggestedPrompt(prompt)}
                      >
                        {prompt}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Clear chat button */}
                {messages.length > 0 && (
                  <div className="w-full flex justify-end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 rounded-full" 
                            onClick={clearChat}
                            aria-label="Clear conversation"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Clear conversation</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
                
                {/* Input area */}
                <div className="flex w-full items-center space-x-2">
                  <Input
                    ref={inputRef}
                    placeholder={mode === "notes" ? "Ask about your notes..." : "Share what's on your mind..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isSending}
                    className="flex-1"
                    aria-label="Type your message"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          onClick={handleSend} 
                          disabled={!input.trim() || isSending}
                          className="rounded-full h-9 w-9 flex-shrink-0"
                          aria-label="Send message"
                        >
                          <SendHorizontal className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send message</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Current timestamp for debugging - hidden in production */}
                <div className="text-[9px] text-muted-foreground/40 text-right w-full hidden">
                  {currentTimestamp} - {currentUser}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.95 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleChat}
                    className="rounded-full h-12 w-12 shadow-md"
                    size="icon"
                    variant="default"
                    aria-label="Open chat assistant"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Open personal assistant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}