import { useState } from "react"
import { socket } from "../constant/socket"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import baseUrl from "../constant/baseUrl"

export default function Create() {
    const [roomName, setRoomName] = useState("")
    const [maxPlayer, setMaxPlayer] = useState("")
    const [hostName, setHostName] = useState("")
    const [category, setCategory] = useState(0)
    const [categories, setCategories] = useState([])
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

        return () => {
            socket.off("room-created")
        }
    }, [])

    return (
        <>
            <h1>create</h1>
            <form onSubmit={handeSubmit}>
                <input type="text" placeholder="room name" onChange={(e) => setRoomName(e.target.value)} value={roomName}/>
                <input type="text" placeholder="host name" onChange={(e) => setHostName(e.target.value)} value={hostName}/>
                <select onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value={0}>All Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <input type="number" placeholder="max player" onChange={(e) => setMaxPlayer(e.target.value)} value={maxPlayer} />
                <button type="submit">Start</button>
            </form>
        </>
    )
}