import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./views/home"
import Create from "./views/create"
import Waiting from "./views/Waiting"
import QuizPage from "./views/QuizPage"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create" element={<Create/>} />
          <Route path="/waiting/:id" element={<Waiting/>} />
          <Route path="/quiz/:id" element={<QuizPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
