import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./views/home"
import Create from "./views/create"
import Waiting from "./views/Waiting"
import QuizPage from "./views/QuizPage"
import LeaderboardPage from "./views/Leaderboard"
import LandingPage from "./views/LandingPage"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/create" element={<Create/>} />
          <Route path="/waiting/:id" element={<Waiting/>} />
          <Route path="/quiz/:id" element={<QuizPage/>} />
          <Route path="/leaderboard/:id" element={<LeaderboardPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
