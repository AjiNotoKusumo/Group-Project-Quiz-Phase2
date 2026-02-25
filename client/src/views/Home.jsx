import { useState } from "react"
import { NavLink, useNavigate } from "react-router"
import { socket } from "../constant/socket"
import { useEffect } from "react"

export default function Home() {
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
        })

        socket.on("room-full", (message) => {
            console.log(message);
        })

        return () => {
            socket.off("joined-room")
            socket.off("active-room-not-found")
            socket.off("room-full")
        }
    }, [])

    return (
        <>
            <h1>Home</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="name" onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="room code" onChange={(e) => setRoomCode(e.target.value)} value={roomCode} />
                <button type="submit">Join</button>
                <NavLink to="/create">create</NavLink>
            </form>
        </>
    )
}