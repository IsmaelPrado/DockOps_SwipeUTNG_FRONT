// components/ChatModal.tsx
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { Message } from '../types/messages';
import { createMessage, getMessagesByMatchId } from '../services/api';

type ChatModalProps = {
  conversationId: number;
  onClose: () => void;
};

const ChatModal = ({ conversationId, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Decodificar token para obtener el ID del usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      setUserId(payload.id);
    } catch (err) {
      console.error('Error decodificando token:', err);
    }
  }, []);

  // Obtener mensajes por matchId
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const messagesFromApi = await getMessagesByMatchId(token, conversationId);
        console.log('Mensajes obtenidos:', messagesFromApi);
        setMessages(messagesFromApi);
      } catch (err) {
        console.error('Error cargando mensajes:', err);
      }
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
  if (!newMessage.trim() || userId === null) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    // 1. Crear mensaje en backend
    await createMessage(token, conversationId, newMessage);

    // 2. Limpiar input
    setNewMessage('');

    // 3. Volver a cargar mensajes actualizados desde backend
    const updatedMessages = await getMessagesByMatchId(token, conversationId);
    setMessages(updatedMessages);

  } catch (error) {
    console.error('Error al enviar mensaje:', error);
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
        {messages.map((msg) => {
          const isOwnMessage = msg.sender_id === userId;
          const time = new Date(msg.timestamp).toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={msg.id}
              className={`p-2 rounded-md max-w-[80%] flex flex-col ${
                isOwnMessage
                  ? 'bg-purple-700 self-end ml-auto text-right'
                  : 'bg-gray-700 self-start mr-auto text-left'
              }`}
            >
              <span className="text-xs font-semibold text-white">{msg.sender?.name || 'Desconocido'}</span>
              <span className="text-sm text-white">{msg.text}</span>
              <span className="text-xs text-gray-300 mt-1">{time}</span>
            </div>
          );
        })}

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
