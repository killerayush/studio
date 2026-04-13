'use client';

import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Sparkles, User } from 'lucide-react';
import { styleChat, type Message } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const previousMessages = messages; // Store state before update
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the state before the current message as history
      const result = await styleChat({ message: input, history: previousMessages });
      const assistantMessage: Message = { role: 'assistant', content: result.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Coach Error',
        description: 'Could not get a response. Please try again.',
      });
      // On error, revert to the state before the user's message was added
      setMessages(previousMessages);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add an initial greeting from the assistant
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Hey there! I'm VYXEN, your personal AI Style Coach and assistant. Ask me anything about fashion, or any other topic!",
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-card/50 glass rounded-[2rem] shadow-2xl border-white/5">
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-6 h-6 text-background" />
                    </div>
                    <div>
                        <h1 className="text-xl font-headline font-bold">AI Style Coach</h1>
                        <p className="text-sm text-muted-foreground">Your personal fashion expert is ready to chat.</p>
                    </div>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={cn("flex items-start gap-4", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            {msg.role === 'assistant' && (
                                 <Avatar className="w-8 h-8 border-2 border-primary/50">
                                    <div className="w-full h-full bg-primary flex items-center justify-center">
                                       <Sparkles className="w-5 h-5 text-background" />
                                    </div>
                                </Avatar>
                            )}
                             <div className={cn("max-w-md p-4 rounded-2xl", msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted/50 rounded-bl-none')}>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                             {msg.role === 'user' && (
                                <Avatar className="w-8 h-8 border-2 border-muted-foreground/50">
                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        <User className="w-4 h-4"/>
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4 justify-start">
                             <Avatar className="w-8 h-8 border-2 border-primary/50">
                                <div className="w-full h-full bg-primary flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-background" />
                                </div>
                            </Avatar>
                            <div className="max-w-md p-4 rounded-2xl bg-muted/50 rounded-bl-none flex items-center">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-6 border-t border-white/10">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for style advice..."
                            className="h-12 bg-black/20 border-muted text-base rounded-xl"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" className="h-12 w-12 rounded-xl" disabled={isLoading}>
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
