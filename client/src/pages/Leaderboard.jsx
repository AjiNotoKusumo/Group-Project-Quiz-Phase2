import { useNavigate } from 'react-router';

export default function LeaderboardPage() {
  const navigate = useNavigate();

  const players = [
    { name: 'Alice', score: 1200 },
    { name: 'You 🎉', score: 950 },
    { name: 'Bob', score: 700 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-10 w-[480px]"
      >
        <h1 className="text-3xl font-bold text-center mb-6">🏆 Leaderboard</h1>

        <ul className="space-y-4">
          {players.map((p, i) => (
            <li
              key={p.name}
              className={`flex justify-between p-4 rounded-xl ${i === 0 ? 'bg-yellow-100' : 'bg-gray-100'}`}
            >
              <span className="font-semibold">
                {i + 1}. {p.name}
              </span>
              <span className="font-bold">{p.score}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate('/')}
          className="mt-8 w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold"
        >
          Play Again
        </button>
      </motion.div>
    </div>
  );
}
