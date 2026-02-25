import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, currentTheme } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 px-6 py-3 rounded-full ${theme.accent} text-white font-semibold shadow-lg z-50 transition-all hover:scale-105`}
      >
        {currentTheme === 'blue' ? '💙 Blue' : '💗 Pink'}
      </button>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-10 w-[420px] text-center"
      >
        <h1 className="text-4xl font-bold mb-2">🎉 Quiz Party!</h1>
        <p className="text-gray-500 mb-6">Join a live quiz or host your own</p>

        <input
          className="w-full mb-3 p-3 rounded-xl border focus:outline-none"
          placeholder="Your nickname"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full mb-4 p-3 rounded-xl border focus:outline-none"
          placeholder="Room code"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button
          onClick={() => navigate('/quiz')}
          className={`w-full py-3 mb-3 rounded-xl ${theme.primary} text-white font-semibold transition`}
        >
          🚀 Join Quiz
        </button>

        <button
          onClick={() => navigate('/host')}
          className={`w-full py-3 rounded-xl ${theme.secondary} text-white font-semibold transition`}
        >
          🎤 Host a Quiz
        </button>
      </motion.div>
    </div>
  );
}
