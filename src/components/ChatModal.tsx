// components/ChatModal.tsx
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

type ChatModalProps = {
  conversationId: string;
  onClose: () => void;
};

const ChatModal = ({ conversationId, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Simula carga de mensajes (puedes reemplazarlo con una API real)
    setMessages([
      'Hola, ¿cómo estás?',
      'Bien, ¿y tú?',
      '¡Todo bien por acá!',
    ]);
  }, [conversationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[85vh] bg-gray-900 text-white rounded-xl shadow-lg border border-purple-500 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-xl border-b border-gray-700">
        <h2 className="font-semibold text-sm">Chat</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md max-w-[80%] ${
              idx % 2 === 0 ? 'bg-purple-700 self-end ml-auto' : 'bg-gray-700 self-start mr-auto'
            }`}
          >
            {msg}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700 bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
