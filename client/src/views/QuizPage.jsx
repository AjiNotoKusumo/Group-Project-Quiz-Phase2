import { useState, useContext } from "react"
import { useEffect } from "react"
import { socket } from "../constant/socket"
import { useNavigate, useParams } from "react-router"
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import Toastify from 'toastify-js'

export default function QuizPage() {
    const [messageSent, setMessageSent] = useState("")
    const [messages, setMessages] = useState([])
    const {id} = useParams()
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [totalScore, setTotalScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(15);
    const { theme, toggleTheme, currentTheme } = useContext(ThemeContext);
    const [hint, setHint] = useState("")
    const [hintLeft, setHintLeft] = useState(2)
    const [loading,setLoading] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const navigate = useNavigate()

    const handleSendMessage = (e) => {
        e.preventDefault()
        socket.emit("message-new", {message: messageSent, roomCode: id, name: localStorage.getItem("name")})
        setMessageSent("")
    }

    const sendEmoji = (emoji) => {
        socket.emit("message-new", {message: emoji, roomCode: id, name: localStorage.getItem("name")})
    }

    const handleHint = async (e) => {
        e.preventDefault()
        try {

            if(hintLeft <= 0) {
                Toastify({
                    text: `You're on your own`,
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
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
                return
            }

            setHintLeft(prev => prev - 1)

            Toastify({
                text: hint ? hint : 'No hints available',
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
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

        } catch (error) {
            console.log("Error generating hint:", error);
        }
    }

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer)
        socket.emit("submit-answer", {
            roomCode: id, 
            playerName: localStorage.getItem("name"), 
            answer: answer
        })
    }

    useEffect(() => {
        
        socket.emit("get-quiz-data", id)

        socket.on("loading", (isLoading) => {
            setLoading(isLoading)
        })

        socket.on("quiz-data", (quizData) => {
            console.log(quizData);
            setCurrentQuestion(quizData)
            setLoading(false)
        })

        socket.on("hint-data", (hintData) => {
            setHint(hintData)
        })


        socket.on("show-answer", (answerData) => {
            console.log(answerData);
        })

        socket.on("answer-result", (resultData) => {
            console.log(resultData);
            setTotalScore(resultData.totalScore)
        })

        socket.on("timer-update", (time) => {
            setTimeLeft(time)
        });

        socket.on("next-question", (nextQuestion) => {
            setCurrentQuestion(nextQuestion)
            setSelectedAnswer(null)
        })

        socket.on("message-received", (messageData) => {
            setMessages(prev => [...prev, messageData])
        })

        socket.on("quiz-finished", (finalData) => {
            navigate(`/leaderboard/${id}`)
        })

        return () => {
            socket.off("message-received")
            socket.off("quiz-data")
            socket.off("timer-update")
            socket.off("next-question")
            socket.off("answer-result")
            socket.off("show-answer")
            socket.off("quiz-finished")
        }
    }, [])

    return (
        <>
            <div className={`min-h-screen ${theme.background} flex flex-col items-center justify-center p-6`}>
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className={`fixed top-6 right-6 px-6 py-3 rounded-full ${theme.accent} text-white font-semibold shadow-lg z-50 transition-all hover:scale-105`}
            >
                {currentTheme === 'blue' ? '💙 Blue' : '💗 Pink'}
            </button>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl w-full grid md:grid-cols-3 gap-6"
            >
                {/* QUIZ SECTION */}
                <div className="md:col-span-2 flex flex-col h-full justify-between">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4"></div>
                            <h2 className="text-xl font-semibold text-gray-700">Loading Quiz...</h2>
                        </div>
                    ) : (
                        <>
                    <div className="flex justify-between mb-4">
                        <span className={`${theme.textLight} font-bold`}>⏱ {timeLeft}s</span>
                        <span className="font-semibold">Score: {totalScore}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-6">{currentQuestion.text}</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {currentQuestion?.choices?.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-2xl border transition font-semibold cursor-pointer
                        ${selectedAnswer === opt 
                            ? `${theme.primary} text-white scale-105` 
                            : `${theme.border} hover:${theme.highlight} hover:scale-105 hover:bg-gray-100`
                        }
                        ${selectedAnswer && selectedAnswer !== opt ? 'opacity-50' : ''}
                    `}
                        >
                            {opt}
                        </button>
                        ))}
                    </div>

                    <button
                        onClick={handleHint}
                        className={`mt-8 w-full py-3 rounded-xl ${theme.primary} text-white font-semibold cursor-pointer`}
                    >
                        Hint
                    </button>
                    </>
                    )}
                </div>
                {/* CHAT SECTION */}
                <div className="flex flex-col bg-slate-50 rounded-2xl p-4 border h-[450px]">
                <h3 className="font-bold mb-3 text-slate-700">💬 Live Chat</h3>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1 h-80">
                    {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`text-sm px-3 py-2 rounded-xl max-w-[90%]
                        ${msg.from == localStorage.name ? `${theme.highlight} ml-auto text-right` : 'bg-white'}
                        `}
                    >
                        <span className="block font-semibold text-xs text-slate-500">{msg.from == localStorage.name ? "You" : msg.from}</span>
                        {msg.message}
                    </div>
                    ))}
                </div>

                {/* Emoji reactions */}
                <div className="flex gap-2 mb-2 flex-shrink-0">
                    {['🔥', '😂', '😱', '👏', '🇯🇵'].map((e) => (
                    <button key={e} onClick={() => sendEmoji(e)} className="cursor-pointer text-xl hover:scale-125 transition">
                        {e}
                    </button>
                    ))}
                </div>

                {/* Input */}
                
                    <form onSubmit={handleSendMessage} className="flex gap-2 flex-shrink-0 w-full">
                    <input
                    value={messageSent}
                    onChange={(e) => setMessageSent(e.target.value)} 
                    placeholder="Type a message..."
                    className={`flex-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${theme.ring} min-w-0`}
                    />
                    <button type="submit" className={`px-4 py-2 rounded-xl ${theme.primary} text-white font-semibold cursor-pointer`}>
                    Send
                    </button>
                    </form>
                
                </div>
            </motion.div>
            </div>
        </>
    )
}