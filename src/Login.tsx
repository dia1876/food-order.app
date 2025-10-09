import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false) // ← ボタン無効化フラグ
  const isDisabled = loading // 必要なら条件を足してOK（例: !email など）

  const handleDummyLogin = async () => {
    try {
      setLoading(true)
      // ダミー: そのまま遷移
      navigate('/select')
    } finally {
      setLoading(false)
    }
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
          disabled={isDisabled}
          className={`w-full rounded-lg px-4 py-3 font-bold shadow transition
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cafe-base focus-visible:ring-offset-2
            ${isDisabled
              // 無効時は白地＋濃い文字（opacityは使わない）
              ? 'bg-white text-gray-900 border border-gray-300 cursor-not-allowed'
              // 有効時はカフェ色＋白文字
              : 'bg-cafe-base text-white border border-transparent hover:bg-cafe-hover active:scale-[0.98]'
            }`}
        >
          {isDisabled ? '処理中…' : 'ゲストログイン'}
        </button>
      </div>
    </div>
  )
}
