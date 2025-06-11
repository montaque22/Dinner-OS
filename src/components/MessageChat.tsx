import { useEffect, useRef, useState } from 'react';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import MarkdownPreview from "@uiw/react-markdown-preview";

export interface Message {
    text: string;
    user: {
        name: string;
        id: string;
    };
}

interface MessageChatProps {
    chat: Message[];
    onSubmit: (text: string) => void;
    isTyping: boolean;
}

export function MessageChat({ chat, onSubmit, isTyping }: MessageChatProps) {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() !== '') {
            onSubmit(message.trim());
            setMessage('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat, isTyping]);

    return (
        <div className="flex flex-col h-full">
            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chat.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.user.id !== 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`rounded-lg px-4 py-2 max-w-4xl text-sm shadow-sm ${msg.user.id !== 'agent' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            <span className={`block font-medium mb-1 text-xs ${msg.user.id !== 'agent' ? 'text-gray-300' : 'text-gray-500'}`}>
                                {msg.user.name}
                            </span>
                            <MarkdownPreview source={msg.text} style={{ background: "transparent", color: msg.user.id !== 'agent' ? "white" : "inherit" }} />
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-center space-x-2">
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="text-sm text-gray-400 ml-2">Typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar (Sticky Footer) */}
            <form
                onSubmit={handleSubmit}
                className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center"
            >
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type your message..."
                />
                <button
                    type="submit"
                    className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <PaperAirplaneIcon className="h-6 w-6" />
                </button>
            </form>
        </div>
    );
}
