import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleDummyLogin = () => {
    // 認証なしでそのまま遷移
    navigate('/select')
  }

  return (
    <div className="min-h-screen bg-cafe-light flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-2xl font-extrabold text-center text-cafe-text mb-6">
          メールでログイン（ダミー）
        </h1>

        <input
          type="email"
          placeholder="you@example.com（入力しなくてもOK）"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm
                     text-black placeholder-gray-400
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-cafe-base focus-visible:ring-offset-2"
        />

        <button
          type="button"
          onClick={handleDummyLogin}
          className="inline-flex w-full items-center justify-center rounded-lg
                     bg-cafe-base px-5 py-3 text-white text-lg font-bold shadow-lg
                     hover:bg-cafe-hover hover:scale-[1.01] active:scale-95
                     focus-visible:outline-none focus-visible:ring-4
                     focus-visible:ring-cafe-base focus-visible:ring-offset-2
                     transition-all duration-200"
        >
          ログインせずに進む
        </button>
      </div>
    </div>
  )
}
