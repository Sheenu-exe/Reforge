'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, CalendarDays, Clock, Bot, User, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";  // Updated import path
import MainLayout from '../components/mainLayout';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from '@/components/ui/button';
import { getAuth } from 'firebase/auth';

const ChatScheduleAssistant = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your scheduling assistant. Tell me about your day and I'll help you plan it. You can mention your tasks, meetings, and preferences."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const auth = getAuth();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        Act as an AI scheduling assistant. Based on the following input, suggest a schedule.
        Format the schedule with each line starting with the current time, like this:
        9:00 AM - Wake up and get ready
        10:00 AM - Team meeting
        Make your response natural and friendly, and ask follow-up questions if needed.
        Previous context: ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
        
        User's message: ${userMessage}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const assistantMessage = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Could you please try rephrasing your request?"
      }]);
    } finally {
      setIsLoading(false);
    }
  };


  const formatScheduleText = (text, message) => {
    // Split text into lines and filter out empty ones
    const lines = text.split('\n').filter(line => line.trim());

    // Check if this looks like a schedule (contains times)
    const hasTimeFormat = lines.some(line =>
      line.match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i)
    );

    if (hasTimeFormat) {
      return (
        <div className="space-y-4">
          {/* Introduction text if it exists */}
          {lines[0] && !lines[0].match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i) && (
            <p className="text-sm">{lines[0]}</p>
          )}

          {/* Schedule items */}
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            {lines.map((line, index) => {
              // Check if line starts with a time
              const timeMatch = line.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM))/i);

              if (timeMatch) {
                // Extract activity (everything after the hyphen)
                const [startTime, ...rest] = line.split('-');
                const activity = rest.join('-').trim();

                return (
                  <div key={index} className="flex items-center space-x-4 py-1.5 hover:bg-white/5 rounded px-2 group">
                    <div className="flex-shrink-0 w-24 font-medium text-violet-300">
                      {startTime.trim()}
                    </div>
                    <div className="flex-grow text-white/90">{activity}</div>
                  </div>
                );
              } else if (line.trim()) {
                // Non-schedule text line
                return (
                  <p key={index} className="text-sm">
                    {line.trim()}
                  </p>
                );
              }

              return null;
            })}
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <Button
              onClick={() => saveSchedule(message)}
              className="bg-violet-500 hover:bg-violet-600 text-white"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Schedule
            </Button>
          </div>

          {/* Concluding text if it exists */}
          {lines[lines.length - 1] &&
            !lines[lines.length - 1].match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i) &&
            lines.length > 1 && (
              <p className="text-sm mt-2">{lines[lines.length - 1]}</p>
            )}
        </div>
      );
    }

    // Return regular text if it's not a schedule
    return text;
  };

  const parseScheduleItems = (text) => {
    const lines = text.split('\n');
    const scheduleItems = [];

    lines.forEach(line => {
      const timeMatch = line.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      if (timeMatch) {
        const [startTime, ...rest] = line.split('-');
        const activity = rest.join('-').trim();
        scheduleItems.push({
          time: startTime.trim(),
          activity: activity
        });
      }
    });

    return scheduleItems;
  };

  const saveSchedule = async (message) => {
    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save schedules",
        });
        return;
      }

      const scheduleItems = parseScheduleItems(message.content);

      if (scheduleItems.length === 0) {
        toast({
          title: "No Schedule Found",
          description: "No schedule items were found to save",
        });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
        },
        body: JSON.stringify({
          title: 'Daily Schedule',
          scheduleItems: scheduleItems,
          notes: message.content.split('\n')[0]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save schedule');
      }

      await response.json();

      toast({
        title: "Schedule Saved",
        description: `Saved on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Failed to Save",
        description: "Could not save your schedule. Please try again.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="h-[90vh] bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 blur-3xl" />
          <div className="relative">
            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bot className="w-8 h-8 text-violet-500" />
                  <h1 className="text-2xl font-bold text-white">Schedule Assistant</h1>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <CalendarDays className="w-5 h-5" />
                  <span className="text-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
              <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'
                        }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-violet-300" />
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${message.role === 'assistant'
                          ? 'bg-white/5 text-white'
                          : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                        }`}
                      >
                        {typeof message.content === 'string' ? formatScheduleText(message.content, message) : message.content}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-violet-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-violet-300" />
                      </div>
                      <div className="bg-white/5 rounded-2xl px-4 py-3">
                        <Loader2 className="w-5 h-5 text-violet-300 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-white/10 p-4">
                  <form onSubmit={handleSubmit} className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tell me about your day..."
                      className="w-full bg-white/5 text-white rounded-xl px-4 py-3 pr-12
                               placeholder:text-white/40 focus:outline-none focus:ring-2 
                               focus:ring-violet-500/50"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r 
                               from-violet-500 to-fuchsia-500 rounded-lg text-white
                               hover:opacity-90 transition-opacity disabled:opacity-50 
                               disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatScheduleAssistant;