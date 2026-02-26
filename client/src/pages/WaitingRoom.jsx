import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Play, User } from 'lucide-react';

/* ================= MOCK DATA ================= */
const MOCK_DATA = {
  name: 'QuizMaster_99',
  roomCode: 'X7K-P9L',
  players: [
    { id: '1', username: 'QuizMaster_99' },
    { id: '2', username: 'SpeedyGonzales' },
    { id: '3', username: 'Brainiac_Boo' },
    { id: '4', username: 'JustHere4Snacks' },
    { id: '5', username: 'CaptainObvious' },
    { id: '6', username: 'The_Underdog' },
    { id: '7', username: 'TriviaNewtonJohn' },
    { id: '8', username: 'AGuyNamedJeff' },
    { id: '9', username: 'LunaLovegood' },
  ],
};

const PLAYER_COLORS = [
  'bg-cyan-500 shadow-cyan-500/50',
  'bg-fuchsia-500 shadow-fuchsia-500/50',
  'bg-yellow-400 shadow-yellow-400/50',
  'bg-green-500 shadow-green-500/50',
  'bg-rose-500 shadow-rose-500/50',
  'bg-violet-500 shadow-violet-500/50',
  'bg-orange-500 shadow-orange-500/50',
];

/* ================= MAIN PAGE ================= */
export default function WaitingRoomPage() {
  const { name, roomCode, players } = MOCK_DATA;
  const [copied, setCopied] = useState(false);
  const isHost = players[0]?.username === name;

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050511] text-white flex items-center justify-center">
      {/* Floating Names Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {players.map((player, index) => (
          <FloatingName key={player.id} username={player.username} index={index} />
        ))}
      </div>

      {/* Center Info Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-20 p-8 rounded-3xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl max-w-md w-full mx-4 text-center"
      >
        <div className="mb-6 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-semibold flex items-center justify-center gap-2">
          <Sparkles size={14} /> Waiting for players...
        </div>

        <h2 className="text-slate-400 text-sm uppercase mb-2">Room Code</h2>

        <button
          onClick={copyCode}
          className="relative flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl mb-6 w-full"
        >
          <span className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
            {roomCode}
          </span>
          <div className="absolute right-4">{copied ? <Check className="text-green-400" /> : <Copy />}</div>
        </button>

        <div className="flex items-center justify-center gap-2 text-slate-300 mb-6 bg-white/5 px-4 py-2 rounded-xl">
          <User size={18} /> Joined as <strong className="text-white">{name}</strong>
        </div>

        <p className="text-slate-400 mb-6">
          <strong className="text-white text-xl">{players.length}</strong> players connected
        </p>

        {isHost && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xl shadow-lg"
          >
            <Play className="inline mr-2" /> Start Quiz
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

/* ================= DVD-STYLE FLOATING NAME ================= */
function FloatingName({ username, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Safe zone around center card
    const SAFE = {
      left: vw / 2 - 260,
      right: vw / 2 + 260,
      top: vh / 2 - 300,
      bottom: vh / 2 + 300,
    };

    // Unique starting positions per player
    let x = Math.random() * (vw - 200);
    let y = Math.random() * (vh - 80);

    let dx = (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 1.2);
    let dy = (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 1.2);

    const width = 160;
    const height = 48;

    function inSafeZone(nx, ny) {
      return nx + width > SAFE.left && nx < SAFE.right && ny + height > SAFE.top && ny < SAFE.bottom;
    }

    let rafId;
    const step = () => {
      let nx = x + dx;
      let ny = y + dy;

      // Wall bounce
      if (nx <= 0 || nx + width >= vw) dx *= -1;
      if (ny <= 0 || ny + height >= vh) dy *= -1;

      // Center card bounce
      if (inSafeZone(nx, ny)) {
        dx *= -1;
        dy *= -1;
      }

      x += dx;
      y += dy;

      el.style.transform = `translate(${x}px, ${y}px)`;
      rafId = requestAnimationFrame(step);
    };

    step();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const colorClass = PLAYER_COLORS[index % PLAYER_COLORS.length];

  return (
    <div
      ref={ref}
      className={`fixed z-10 px-5 py-2 rounded-full ${colorClass} text-white font-bold shadow-lg whitespace-nowrap`}
    >
      {username}
    </div>
  );
}
