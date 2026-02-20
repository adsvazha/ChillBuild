import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader, ArrowRight } from 'lucide-react';
import { AIService, AIConfig } from '../services/aiService';
import { Component } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  onComponentsGenerated: (components: Component[]) => void;
  onProceedToCanvas: () => void;
  aiConfig: AIConfig;
}

export default function AIChat({ onComponentsGenerated, onProceedToCanvas, aiConfig }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI design assistant. Describe the website you want to create, and I\'ll generate it for you. You can be as detailed or as simple as you like.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      const aiService = new AIService(aiConfig);
      const response = await aiService.generateComponents(userMessage.content);

      if (response.error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I encountered an error: ${response.error}. Please try again with a different description.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else if (response.components.length > 0) {
        onComponentsGenerated(response.components);
        setHasGenerated(true);

        const successMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Great! I've generated your design with ${response.components.length} components. You can now proceed to the canvas to customize it further, or ask me to make changes.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        const emptyMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I couldn\'t generate any components from that description. Could you try describing your website in more detail?',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, emptyMessage]);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Something went wrong: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <Sparkles size={24} />
          <h2>AI Design Assistant</h2>
        </div>
        {hasGenerated && (
          <button className="proceed-button" onClick={onProceedToCanvas}>
            <ArrowRight size={20} />
            Proceed to Canvas
          </button>
        )}
      </div>

      <div className="ai-chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'assistant' ? <Sparkles size={20} /> : <div className="user-avatar">You</div>}
            </div>
            <div className="message-content">
              <p>{message.content}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="chat-message assistant">
            <div className="message-avatar">
              <Sparkles size={20} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <Loader size={16} className="spinner" />
                <span>Generating your design...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your website..."
          disabled={isGenerating}
        />
        <button type="submit" disabled={!input.trim() || isGenerating}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
