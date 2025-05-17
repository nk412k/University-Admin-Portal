import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  responseData?: {
    items?: Array<{
      header: string;
      description: string;
    }>;
  };
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI assistant. How can I help you today?",
    timestamp: new Date().toISOString(),
  },
];

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem("chatMessages");
      return savedMessages ? JSON.parse(savedMessages) : initialMessages;
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
      return initialMessages;
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const formatHeader = (header: string): string => {
    return header
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      console.log(inputValue);
      const response = await fetch(
        "https://hook.eu2.make.com/po38q16xagswh7fcpw29wvmi6irmgats",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ai: inputValue,
            asd: 0,
          }),
        }
      );

      const rawText = await response.text();
      console.log("Raw text:", rawText);

      const cleanedText = rawText
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "")
        .trim();

      const data = JSON.parse(cleanedText);
      console.log("Parsed data:", data);

      let responseItems = [];

      if (Array.isArray(data)) {
        responseItems = data;
      }

      const botMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        responseData: {
          items: responseItems,
        },
      };

      setMessages((prev) => [...prev, botMessage]);
      toast({
        title: "Success",
        description: "Response received!",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderBotMessage = (message: Message) => {
    if (message.responseData?.items && message.responseData.items.length > 0) {
      return (
        <div className="space-y-4">
          {message.responseData.items.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-primary/20 text-primary font-medium px-3 py-1.5 rounded-md mb-1 inline-block">
                <span className="font-bold">{formatHeader(item.header)}</span>
              </div>
              <p className="whitespace-pre-line mb-3 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-sm whitespace-pre-line">{message.content}</p>;
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className={`${
            isExpanded ? "w-[400px] h-[600px]" : "w-[350px] h-[500px]"
          } bg-background border border-border rounded-xl shadow-lg flex flex-col overflow-hidden transition-all duration-200 mb-2`}
        >
          <div className="p-3 border-b flex items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-primary/20">
                <AvatarImage src="/ai-assistant.png" alt="AI" />
                <AvatarFallback className="text-primary bg-primary/10">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold flex items-center">
                  AI Assistant
                  <Badge
                    variant="outline"
                    className="ml-2 bg-primary/10 text-primary text-xs"
                  >
                    Beta
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {isLoading ? "Typing..." : "Online"}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleToggleExpand}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleToggleOpen}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-primary/50 mb-2" />
                  <p className="text-lg font-medium">
                    Hello, I'm your AI Assistant!
                  </p>
                  <p>
                    Ask me anything about your curriculum, students, or academic
                    plans.
                  </p>
                  <p className="text-sm">
                    Try asking about "student attendance", "upcoming events", or
                    "curriculum progress"
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="mb-1 flex items-center">
                        {message.role === "assistant" && (
                          <Sparkles className="h-3 w-3 mr-1 text-primary" />
                        )}
                        <span className="text-xs font-medium">
                          {message.role === "user" ? "You" : "AI Assistant"}
                        </span>
                        <span className="text-xs ml-2 opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      {message.role === "user" ? (
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      ) : (
                        renderBotMessage(message)
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-xl p-3 bg-muted">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-3 border-t bg-background">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                placeholder="Ask me anything about your college..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] max-h-[120px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-[60px] flex-shrink-0"
                disabled={inputValue.trim() === "" || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Ask about students, attendance, curriculum, or academic events.
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleToggleOpen}
        size="icon"
        className={`h-12 w-12 rounded-full shadow-md ${
          isOpen ? "bg-muted" : "bg-primary"
        }`}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default AIAssistant;
