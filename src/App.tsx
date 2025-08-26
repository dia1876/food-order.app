import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Select from './Select'
import Hall from './Hall'
import Kitchen from './Kitchen'
import Counter from './Counter'
import './index.css'

function App() {
  return (
    <div className="bg-cafe-light text-cafe-text min-h-screen p-4">
      {/* ✅ テスト用に追加 */}
      <div className="p-6 bg-red-500 text-white rounded mb-6">
        Tailwind効いてる？（テスト用のボックス）
      </div>

      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select" element={<Select />} />
          <Route path="/hall" element={<Hall />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/counter" element={<Counter />} />
        </Routes>
      </Router>
    </div>
  )
}


export default App

