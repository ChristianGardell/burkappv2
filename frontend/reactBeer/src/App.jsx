// App.jsx
import { Routes, Route, Link } from 'react-router-dom'
import Home from './Home'
import Admin from './Admin'

function App() {
  return (
    <div>
      <div className = "topbar ">
        <p>
          "thuis is test"
        </p>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App