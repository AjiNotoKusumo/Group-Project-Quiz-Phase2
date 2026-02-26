import { useLocation, useNavigate, useParams } from "react-router"
import { socket } from "../constant/socket";
import Toastify from 'toastify-js'
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Play, User } from 'lucide-react';


export default function Waiting() {

    const {id} = useParams()
    const location = useLocation();
    const [activeRoom, setActiveRoom] = useState(location.state?.activeRoom || null)
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate()

    const copyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClick = () => {
        socket.emit("start-quiz", id)
    }

    useEffect(() => {
        socket.connect()
        if(!location.state?.activeRoom) {
            socket.emit("get-active-room", id)

            socket.on("active-room", (roomData) => {
                setActiveRoom(roomData)
            })

            socket.on("active-room-not-found", (message) => {
                navigate("/home", {state: {message}})
            })
        }

        socket.on("player-joined", (name) => {
            console.log(`${name} joined the room`);
            setActiveRoom(prev => {
                return {
                    ...prev,
                    players: [...prev.players, {name, score: 0}]
                }
            })

            Toastify({
                text: `${name} joined the room`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "bottom", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "#198754", 
                    color: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    minWidth: "200px",
                    height: "50px",     
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "500"
                },
            }).showToast();
        })

        socket.on("quiz-started", () => {
            navigate(`/quiz/${id}`)
        })

        return () => {
            socket.off("active-room")
            socket.off("active-room-not-found")
            socket.off("player-joined")
        }
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050511] text-white flex items-center justify-center">
      {/* Floating Names Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {activeRoom?.players.map((player, index) => (
          <FloatingName key={player.name} username={player.name} index={index} />
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
            {id}
          </span>
          <div className="absolute right-4">{copied ? <Check className="text-green-400" /> : <Copy />}</div>
        </button>

        <div className="flex items-center justify-center gap-2 text-slate-300 mb-6 bg-white/5 px-4 py-2 rounded-xl">
          <User size={18} /> Room <strong className="text-white">{activeRoom?.roomName}</strong>
        </div>

        <p className="text-slate-400 mb-6">
          <strong className="text-white text-xl">{activeRoom?.players?.length}</strong> players connected
        </p>

        {activeRoom?.hostName === localStorage.getItem("name") && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
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
    const PLAYER_COLORS = [
        'bg-cyan-500 shadow-cyan-500/50',
        'bg-fuchsia-500 shadow-fuchsia-500/50',
        'bg-yellow-400 shadow-yellow-400/50',
        'bg-green-500 shadow-green-500/50',
        'bg-rose-500 shadow-rose-500/50',
        'bg-violet-500 shadow-violet-500/50',
        'bg-orange-500 shadow-orange-500/50',
    ]

    const ref = useRef(null);
    const animationRef = useRef(null);

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

        if(el){
            el.style.transform = `translate(${x}px, ${y}px)`;
        }
        
        animationRef.current = requestAnimationFrame(step);
        };

        step();
        return () => {
            if(animationRef.current){
                cancelAnimationFrame(animationRef.current)
            }
        };
    }, [index, username]);

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