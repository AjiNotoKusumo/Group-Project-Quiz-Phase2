import { useState } from "react"
import { NavLink, useNavigate } from "react-router"
import { socket } from "../constant/socket"
import { useEffect } from "react"
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from "react";
import Toastify from 'toastify-js'

export default function Home() {
    const { theme, toggleTheme, currentTheme } = useContext(ThemeContext);
    const [name, setName] = useState("")
    const [roomCode, setRoomCode] = useState("")
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem("name", name)
        
        socket.emit("join-room", {roomCode, name})
    }

    useEffect(()=> {
        socket.connect()

        socket.on("joined-room", (roomData) => {
            navigate(`/waiting/${roomData.roomCode}`, {state: {activeRoom: roomData.activeRoom}})
        })

        socket.on("active-room-not-found", (message) => {
            console.log(message);
            Toastify({
                text: `${message}`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "bottom", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "#dc3545", 
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

        socket.on("room-full", (message) => {
            console.log(message);
            Toastify({
                text: `${message}`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "bottom", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "#dc3545", 
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

        return () => {
            socket.off("joined-room")
            socket.off("active-room-not-found")
            socket.off("room-full")
        }
    }, [navigate])

    return (
        <>
            <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className={`fixed top-6 right-6 px-6 py-3 rounded-full ${theme.accent} text-white font-semibold shadow-lg z-50 transition-all cursor-pointer hover:scale-105`}
            >
                {currentTheme === 'blue' ? '💙 Blue' : '💗 Pink'}
            </button>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl shadow-xl p-10 w-[420px] text-center"
            >
                <h1 className="text-4xl font-bold mb-2">🎉 Quizzy!</h1>
                <p className="text-gray-500 mb-6">Join a live quiz or host your own</p>
                <form onSubmit={handleSubmit}>
                <input
                className="w-full mb-3 p-3 rounded-xl border focus:outline-none"
                placeholder="Your nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <input
                className="w-full mb-4 p-3 rounded-xl border focus:outline-none"
                placeholder="Room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                />

                <button type="submit"
                className={`w-full py-3 mb-3 rounded-xl ${theme.primary} text-white font-semibold transition cursor-pointer`}
                >
                🚀 Join Quiz
                </button>

                <button
                type="button"
                onClick={() => navigate('/create')}
                className={`w-full py-3 rounded-xl ${theme.secondary} text-white font-semibold transition cursor-pointer`}
                >
                🎤 Host a Quiz
                </button>
                </form>
            </motion.div>
            </div>
        </>
    )
}