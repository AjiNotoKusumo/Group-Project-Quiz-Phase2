import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Trophy, Users, ArrowRight } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router';

/* ================= DATA ================= */
const images = [
  'https://img.freepik.com/free-vector/sport-text-banner-poster-design_1308-132744.jpg',
  'https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg',
  'https://www.vanas.ca/images/blog/vfx-visual-effects-vanas.jpg',
  'https://www.japanitalybridge.com/wordpress/wp-content/uploads/2024/06/2024-06-20-anime-mercato-globale-02.jpg',
  'https://thumbs.dreamstime.com/b/set-geography-symbols-equipments-web-banners-vintage-outline-sketch-web-banners-doodle-style-education-concept-back-to-136641038.jpg',
  'https://oktamam.com/wp-content/uploads/2023/07/history.jpg',
  'https://media.istockphoto.com/id/1407219958/vector/a-group-of-people-in-different-traditional-clothes-are-respectfully-celebrating-indonesias.jpg',
];

/* ================= LANDING PAGE ================= */
export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, currentTheme, toggleTheme } = useContext(ThemeContext);

  // Define glow colors based on theme
  const glowColor1 = currentTheme === 'blue' ? 'cyan-600/30' : 'pink-600/30';
  const glowColor2 = currentTheme === 'blue' ? 'indigo-600/30' : 'fuchsia-600/30';
  const badgeBorder = currentTheme === 'blue' ? 'border-cyan-500/30' : 'border-pink-500/30';
  const badgeBg = currentTheme === 'blue' ? 'bg-cyan-500/10' : 'bg-pink-500/10';
  const badgeText = currentTheme === 'blue' ? 'text-cyan-300' : 'text-pink-300';
  const badgeShadow =
    currentTheme === 'blue' ? 'shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'shadow-[0_0_15px_rgba(236,72,153,0.2)]';
  const gradientText =
    currentTheme === 'blue' ? 'from-cyan-400 via-blue-500 to-indigo-500' : 'from-pink-400 via-rose-500 to-fuchsia-500';
  const buttonShadow =
    currentTheme === 'blue'
      ? 'shadow-[0_0_50px_rgba(255,255,255,0.35)] hover:shadow-[0_0_80px_rgba(6,182,212,0.6)]'
      : 'shadow-[0_0_50px_rgba(255,255,255,0.35)] hover:shadow-[0_0_80px_rgba(236,72,153,0.6)]';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050511] text-white font-sans selection:bg-cyan-500 selection:text-white">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 px-6 py-3 rounded-full ${currentTheme === 'blue' ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-pink-500 hover:bg-pink-600'} text-white font-semibold shadow-lg z-50 transition-all hover:scale-105`}
      >
        {currentTheme === 'blue' ? '💙 Blue' : '💗 Pink'}
      </button>
      {/* AMBIENT GLOWS */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className={`absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-${glowColor1} rounded-full blur-[120px] pointer-events-none`}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        className={`absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-${glowColor2} rounded-full blur-[120px] pointer-events-none`}
      />

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className={`mb-6 px-4 py-1.5 rounded-full border ${badgeBorder} ${badgeBg} ${badgeText} text-sm font-semibold uppercase tracking-wide ${badgeShadow}`}
        >
          Welcome to the Arena
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl md:text-9xl font-black tracking-tighter"
        >
          QUIZZY
          <span className={`block mt-3 text-transparent bg-clip-text bg-gradient-to-r ${gradientText} drop-shadow-lg`}>
            Realtime Knowledge.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 max-w-2xl text-lg md:text-xl text-slate-400 font-light"
        >
          A live quiz experience built on speed, tension, and collective excitement. No reloads. No delays. Just
          adrenaline.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/home')}
          className={`group mt-12 px-12 py-5 rounded-full bg-white text-indigo-950 font-extrabold text-xl ${buttonShadow} transition-all duration-300`}
        >
          Enter Experience
          <ArrowRight className="inline ml-3 group-hover:translate-x-2 transition-transform duration-300" />
        </motion.button>
      </section>

      {/* INFINITE PREVIEW STRIP */}
      <section className="relative mt-32 overflow-hidden w-full pb-10">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050511] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050511] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6 w-max px-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 28, repeat: Infinity }}
        >
          {images.concat(images).map((src, i) => (
            <div
              key={i}
              className="relative group w-80 h-52 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img
                src={src}
                alt="preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Feature icon={<Zap className="text-yellow-400" />} title="Instant" desc="Real-time answers. Zero waiting." />
        <Feature icon={<Trophy className="text-orange-400" />} title="Competitive" desc="Every second counts." />
        <Feature icon={<Users className="text-emerald-400" />} title="Collective" desc="Feel the crowd energy." />
        <Feature icon={<Sparkles className="text-cyan-400" />} title="Magical" desc="Fluid UI & motion delight." />
      </section>

      {/* FOOTER */}
      <footer className="relative w-full pb-10 text-center text-slate-500 text-sm font-medium tracking-wide">
        Crafted with passion <span className="text-cyan-500 px-2">·</span> Powered by Socket.IO
      </footer>
    </div>
  );
}

/* ================= SHARED COMPONENTS ================= */
function Feature({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-8 shadow-2xl hover:bg-white/[0.06] hover:border-cyan-500/30 transition-colors duration-300"
    >
      <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/5 shadow-inner">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-slate-100">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
