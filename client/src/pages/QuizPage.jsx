import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function QuizPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, currentTheme } = useContext(ThemeContext);

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { user: 'Alex', text: 'Tokyo easy 😎' },
    { user: 'Maya', text: 'Wait is it Kyoto?? 🤔' },
    { user: 'Rafi', text: 'GO JAPAN 🇯🇵🔥' },
  ]);

  function sendMessage() {
    if (!chatInput.trim()) return;

    setMessages((prev) => [...prev, { user: 'You', text: chatInput }]);
    setChatInput('');
  }

  function sendEmoji(emoji) {
    setMessages((prev) => [...prev, { user: 'You', text: emoji }]);
  }

  return (
    <div className={`min-h-screen ${theme.background} flex flex-col items-center justify-center p-6`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 px-6 py-3 rounded-full ${theme.accent} text-white font-semibold shadow-lg z-50 transition-all hover:scale-105`}
      >
        {currentTheme === 'blue' ? '💙 Blue' : '💗 Pink'}
      </button>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl w-full grid md:grid-cols-3 gap-6"
      >
        {/* QUIZ SECTION */}
        <div className="md:col-span-2">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Question 1 / 5</span>
            <span className={`${theme.textLight} font-bold`}>⏱ 12s</span>
          </div>

          <h2 className="text-2xl font-bold mb-6">What is the capital of Japan?</h2>

          <div className="grid grid-cols-2 gap-4">
            {['Tokyo', 'Kyoto', 'Osaka', 'Nagoya'].map((opt) => (
              <button
                key={opt}
                className={`p-4 rounded-2xl border ${theme.border} hover:${theme.highlight} transition font-semibold`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/leaderboard')}
            className={`mt-8 w-full py-3 rounded-xl ${theme.primary} text-white font-semibold`}
          >
            Submit Answer
          </button>
        </div>

        {/* CHAT SECTION */}
        <div className="flex flex-col bg-slate-50 rounded-2xl p-4 border">
          <h3 className="font-bold mb-3 text-slate-700">💬 Live Chat</h3>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-2 rounded-xl max-w-[90%]
                  ${msg.user === 'You' ? `${theme.highlight} ml-auto text-right` : 'bg-white'}
                `}
              >
                <span className="block font-semibold text-xs text-slate-500">{msg.user}</span>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Emoji reactions */}
          <div className="flex gap-2 mb-2">
            {['🔥', '😂', '😱', '👏', '🇯🇵'].map((e) => (
              <button key={e} onClick={() => sendEmoji(e)} className="text-xl hover:scale-125 transition">
                {e}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className={`flex-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${theme.ring}`}
            />
            <button onClick={sendMessage} className={`px-4 rounded-xl ${theme.primary} text-white font-semibold`}>
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
