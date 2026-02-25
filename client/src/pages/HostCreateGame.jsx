import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

export default function HostCreateGame() {
  const navigate = useNavigate();
  const { theme, toggleTheme, currentTheme } = useContext(ThemeContext);
  const [title, setTitle] = useState('');
  const [quizId, setQuizId] = useState('');

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
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-10 w-[480px]"
      >
        <h1 className="text-3xl font-bold mb-2 text-center">🎤 Host a Quiz</h1>
        <p className="text-gray-500 text-center mb-6">Create a live game session</p>

        <label className="block mb-2 font-semibold">Game Title</label>
        <input
          className="w-full mb-4 p-3 rounded-xl border focus:outline-none"
          placeholder="Friday Night Quiz"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Select Quiz</label>
        <select
          className="w-full mb-6 p-3 rounded-xl border focus:outline-none"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
        >
          <option value="">-- Choose Quiz --</option>
          <option value="1">General Knowledge</option>
          <option value="2">Programming Basics</option>
          <option value="3">Movies & Pop Culture</option>
        </select>

        <button
          onClick={() => navigate('/quiz')}
          className={`w-full py-3 rounded-xl ${theme.primary} text-white font-semibold transition`}
        >
          🚀 Start Game Session
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">A room code will be generated automatically</p>
      </motion.div>
    </div>
  );
}
