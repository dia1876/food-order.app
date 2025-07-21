import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Hall from './Hall'
import Kitchen from './Kitchen'
import Counter from './Counter'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/hall" element={<Hall />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/counter" element={<Counter />} />
      </Routes>
    </Router>
  )
}
