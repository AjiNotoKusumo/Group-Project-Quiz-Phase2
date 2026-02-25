import { useState } from "react"
import { useEffect } from "react"
import { socket } from "../constant/socket"
import { useParams } from "react-router"
import Toastify from 'toastify-js'

export default function QuizPage() {
    const [messageSent, setMessageSent] = useState("")
    const {id} = useParams()
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [timeLeft, setTimeLeft] = useState(15);

    const handleSendMessage = (e) => {
        e.preventDefault()
        socket.emit("message-new", {message: messageSent, roomCode: id, name: localStorage.getItem("name")})
        setMessageSent("")
    }

    const handleAnswer = (answer) => {
        socket.emit("submit-answer", {
            roomCode: id, 
            playerName: localStorage.getItem("name"), 
            answer: answer
        })
    }

    useEffect(() => {
        socket.connect()
        
        socket.emit("get-quiz-data", id)

        socket.on("quiz-data", (quizData) => {
            console.log(quizData);
            setCurrentQuestion(quizData)
        })

        socket.on("show-answer", (answerData) => {
            console.log(answerData);
        })

        socket.on("answer-result", (resultData) => {
            console.log(resultData);
        })

        socket.on("timer-update", (time) => {
            setTimeLeft(time)
        });

        socket.on("next-question", (nextQuestion) => {
            setCurrentQuestion(nextQuestion)
        })

        socket.on("message-received", (messageData) => {
            console.log(messageData);
        })

        return () => {
            socket.off("message-received")
            socket.off("quiz-data")
            socket.off("timer-update")
            socket.off("next-question")
        }
    }, [])

    return (
        <>
            <h1>Quiz Page</h1>
            <form onSubmit={handleSendMessage}>
                <input type="text" placeholder="message" onChange={(e) => setMessageSent(e.target.value)} value={messageSent} />
                <button type="submit">Send</button>
            </form>

            <div>
                <h2>Time Left: {timeLeft}s</h2>
                {currentQuestion ? (
                    <div>
                        <h3>{currentQuestion.text}</h3>
                        {currentQuestion?.choices?.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt)}>{opt}</button>
                        ))} 
                    </div>
                ) : <p>Loading Questions...</p>}
            </div>
        </>
    )
}