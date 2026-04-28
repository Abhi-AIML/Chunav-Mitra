import { useState, useCallback } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { CanvasPanel } from './components/CanvasPanel';
import { Header } from './components/Header';
import { sendChatMessage } from './services/api';
import type { ChatMessage, CanvasState, ToolCall } from './types';

const WIDGET_MAP: Record<string, string> = {
  render_election_timeline: 'timeline',
  render_booth_simulator: 'booth_simulator',
  render_constituency_map: 'constituency_map',
  render_evm_explainer: 'evm_explainer',
  push_to_calendar: 'calendar_push',
  myth_buster: 'myth_buster',
  find_polling_booth: 'booth_finder',
};

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: "🙏 नमस्ते! I'm **Chunav Mitra** — your friendly Election Companion!\n\nI can teach you everything about Indian elections. Try asking me:\n- \"How does voting work at a polling booth?\"\n- \"Show me the election timeline\"\n- \"How does the EVM machine work?\"\n- \"Is it true that EVMs can be hacked?\"\n- \"Find my nearest polling booth\"\n\nWhat would you like to learn today?",
      timestamp: Date.now(),
    },
  ]);
  const [canvas, setCanvas] = useState<CanvasState>({ widget: null, data: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text);

      // Process tool calls to update canvas
      if (response.tool_calls && response.tool_calls.length > 0) {
        const call: ToolCall = response.tool_calls[0];
        const widgetName = WIDGET_MAP[call.name];
        if (widgetName) {
          setCanvas({ widget: widgetName as CanvasState['widget'], data: call.args });
        }
      }

      const botMsg: ChatMessage = {
        role: 'bot',
        text: response.text || "I've updated the visual on the right panel! Take a look. 👉",
        tool_calls: response.tool_calls,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        role: 'bot',
        text: "⚠️ Oops! I couldn't connect to the server. Please make sure the backend is running on port 5000.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-900">
      <div className="particle-bg" />
      <Header />
      <main className="flex-1 flex gap-0 overflow-hidden relative z-10">
        {/* Left Panel — Chat */}
        <div className="w-[440px] min-w-[380px] flex flex-col border-r border-white/[0.06]">
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
        {/* Right Panel — Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <CanvasPanel canvas={canvas} />
        </div>
      </main>
    </div>
  );
}

export default App;
