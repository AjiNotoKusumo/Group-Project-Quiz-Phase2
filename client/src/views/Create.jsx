import { useState } from "react"
import { socket } from "../constant/socket"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import baseUrl from "../constant/baseUrl"
import { useContext } from "react"
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import Toastify from 'toastify-js'

export default function Create() {
    const [roomName, setRoomName] = useState("")
    const [maxPlayer, setMaxPlayer] = useState("")
    const [hostName, setHostName] = useState("")
    const [category, setCategory] = useState(0)
    const [categories, setCategories] = useState([])
    const { theme, toggleTheme, currentTheme } = useContext(ThemeContext);
    const navigate = useNavigate()

    const fetchCategories = async () => {
        try {
            const {data} = await axios.get(`${baseUrl}/categories`)
            setCategories(data)
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    const handeSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem("name", hostName)
        socket.emit("create-room", {roomName, maxPlayer, hostName, category})
    }

    useEffect(() => {
        fetchCategories()

        socket.connect()

        socket.on("room-created", (roomData) => {
            console.log(roomData.activeRoom);
            
            navigate(`/waiting/${roomData.roomCode}`, {state: {activeRoom: roomData.activeRoom}})
        })

        socket.on("room-creation-failed", (message) => {
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
            socket.off("room-created")
            socket.off("room-creation-failed")
        }
    }, [])

    return (
        <>
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
        <form onSubmit={handeSubmit}>
        <label className="block mb-2 font-semibold">Game Title</label>

        <input
            type="text"
            className="w-full mb-4 p-3 rounded-xl border focus:outline-none"
            placeholder="Friday Night Quiz"
            onChange={(e) => setRoomName(e.target.value)} 
            value={roomName}
        />

        <label className="block mb-2 font-semibold">Host Name</label>

        <input
            type="text"
            className="w-full mb-4 p-3 rounded-xl border focus:outline-none"
            placeholder="Your Name ..."
            onChange={(e) => setHostName(e.target.value)} 
            value={hostName}
        />

        <label className="block mb-2 font-semibold">Select Quiz</label>
        <select
          className="w-full mb-6 p-3 rounded-xl border focus:outline-none"
          onChange={(e) => setCategory(e.target.value)} value={category}
        >
            <option value={0}>-- Choose Quiz --</option>
            {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
            ))}
        </select>
        
        <label className="block mb-2 font-semibold">Number of Players</label>

        <input
            type="number"
            className="w-full mb-4 p-3 rounded-xl border focus:outline-none"
            placeholder="Max Players ..."
            onChange={(e) => setMaxPlayer(e.target.value)} 
            value={maxPlayer}
        />

        <button
            type="submit"
            className={`w-full py-3 rounded-xl ${theme.primary} text-white font-semibold transition`}
        >
          🚀 Start Game Session
        </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">A room code will be generated automatically</p>
      </motion.div>
    </div>
        </>
    )
}