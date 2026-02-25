import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router"
import { socket } from "../constant/socket";
import { useState } from "react";

export default function Waiting() {
    const {id} = useParams()
    const location = useLocation();
    const [activeRoom, setActiveRoom] = useState(location.state?.activeRoom || null)
    const navigate = useNavigate()

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
                navigate("/", {state: {message}})
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
        <>
            <h1>Waiting Room: {activeRoom?.roomName}</h1>
            <h1>Room Code: {id}</h1>
            <ul>
                {activeRoom?.players.map((player, index) => (
                    <li key={index}>{player.name}</li>
                ))}
            </ul>

            <button className="cursor-pointer" onClick={handleClick}>Start Quiz</button>
        </>
    )
}