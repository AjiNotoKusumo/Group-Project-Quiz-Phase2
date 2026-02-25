import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center">
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
          className="w-full py-3 mb-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
        >
          🚀 Join Quiz
        </button>

        <button
          onClick={() => navigate('/host')}
          className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
        >
          🎤 Host a Quiz
        </button>
      </motion.div>
    </div>
  );
}
