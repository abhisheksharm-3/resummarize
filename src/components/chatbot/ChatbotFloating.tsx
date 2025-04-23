import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, X, SendHorizontal, Bot, Trash } from 'lucide-react';
import { useChatbot } from '@/hooks/useChatbot';
import { Note } from "@/types/supabase";
import { Loader2 } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';

interface ChatbotFloatingProps {
  notes?: Note[];
}

export function ChatbotFloating({ notes }: ChatbotFloatingProps) {
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
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleSend = () => {
    if (input.trim() && !isSending) {
      sendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getWelcomeMessage = () => {
    if (mode === "notes") {
      return notes && notes.length > 0 
        ? "Ask me anything about your notes or how I can help you organize your thoughts."
        : "I'm your personal assistant. How can I help you today?";
    } else {
      return "I'm here to listen and support you. How are you feeling today?";
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen ? (
        <Card className="w-80 md:w-96 shadow-lg border animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
            <Tabs
              value={mode}
              onValueChange={(value) => switchMode(value as "notes" | "therapist")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes" className="text-xs">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Notes Assistant
                </TabsTrigger>
                <TabsTrigger value="therapist" className="text-xs">
                  <Bot className="h-4 w-4 mr-2" />
                  Wellness Guide
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="icon" onClick={closeChat} className="h-8 w-8 ml-2 flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <ScrollArea className="h-80">
            <CardContent className="p-3 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-center text-muted-foreground p-4">
                  <p>{getWelcomeMessage()}</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[85%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      {message.timestamp && (
                        <div className="text-[10px] mt-1 opacity-70 text-right">
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isSending && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </CardContent>
          </ScrollArea>
          
          <CardFooter className="p-3 pt-2 border-t flex flex-col gap-2">
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
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear conversation</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            <div className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                placeholder={mode === "notes" ? "Ask about your notes..." : "Share what's on your mind..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isSending}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSend} 
                disabled={!input.trim() || isSending}
                className="rounded-full h-9 w-9 flex-shrink-0"
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleChat}
                className="rounded-full h-12 w-12 shadow-md animate-in fade-in slide-in-from-bottom-5 duration-300"
                size="icon"
                variant="default"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Open personal assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}