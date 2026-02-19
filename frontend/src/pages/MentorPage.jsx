import { useState, useRef, useEffect } from 'react';
import { Send, BrainCircuit, User, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../api';
import { LoadingDots } from '../components/UIComponents';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
    "Review my resume and suggest improvements",
    "What career paths match my skills?",
    "Help me prepare for interviews",
    "Suggest projects to build my portfolio",
    "What skills should I learn next?",
    "How should I negotiate my salary?",
];

export default function MentorPage() {
    const { resumeId } = useApp();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-greet on first load
    useEffect(() => {
        if (messages.length === 0) {
            handleSend('hello');
        }
    }, []);

    const handleSend = async (text) => {
        const msg = text || input.trim();
        if (!msg || sending) return;

        const userMsg = { role: 'user', content: msg };
        if (text !== 'hello') {
            setMessages(prev => [...prev, userMsg]);
        }
        setInput('');
        setSending(true);

        try {
            const res = await sendChatMessage(msg, resumeId);
            setMessages(prev => [
                ...(text === 'hello' ? prev : prev),
                ...(text === 'hello' ? [] : []),
                { role: 'assistant', content: res.response }
            ]);
        } catch {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '⚠️ Sorry, I encountered an error. Please make sure the backend server is running and try again.' }
            ]);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div>
            <div className="page-header animate-in" style={{ marginBottom: '16px' }}>
                <h1>AI Career Mentor</h1>
                <p>Get real-time personalized career guidance from your AI mentor</p>
            </div>

            <div className="chat-container animate-in stagger-1">
                <div className="chat-header">
                    <div style={{
                        width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}>
                        <BrainCircuit size={20} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '2px' }}>CareerMentor AI</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div className="chat-header-dot" />
                            <span style={{ fontSize: '0.72rem', color: 'var(--accent-success)' }}>Online</span>
                        </div>
                    </div>
                    {resumeId && (
                        <div style={{ marginLeft: 'auto' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Sparkles size={12} /> Resume Context Active
                            </span>
                        </div>
                    )}
                </div>

                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-message ${msg.role}`}>
                            {msg.role === 'assistant' ? (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            ) : (
                                msg.content
                            )}
                        </div>
                    ))}
                    {sending && (
                        <div className="chat-message assistant">
                            <LoadingDots />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions */}
                {messages.length <= 1 && (
                    <div className="quick-suggestions">
                        {SUGGESTIONS.map((s, i) => (
                            <button key={i} className="quick-suggestion" onClick={() => handleSend(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                <div className="chat-input-area">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me about careers, skills, interviews, salary..."
                        rows={1}
                        disabled={sending}
                    />
                    <button
                        className="chat-send-btn"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || sending}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
