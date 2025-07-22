import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        navigate('/select') // ← ログイン済ならすぐリダイレクト
      }
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          navigate('/select') // ← ログイン完了後もリダイレクト
        }
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [navigate])

  const handleSendMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage('ログイン失敗: ' + error.message)
    } else {
      setMessage('📩 メールを確認してください')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">メールでログイン</h1>
      <input
        type="email"
        placeholder="you@example.com"
        className="mb-4 p-2 border rounded w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleSendMagicLink}
        className="mb-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Magic Link送信
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  )
}
