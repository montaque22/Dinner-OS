// App.tsx
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Favorites from './pages/Favorites'
import "./App.css"
import RecipePage from "./pages/RecipePage";
function App() {
  return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/recipe/:name" element={<RecipePage />} />

                <Route path="*" element={<Home/>} />
            </Routes>
        </Router>
  )
}

export default App
