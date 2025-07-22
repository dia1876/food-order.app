import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function Select() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login') // ← 未ログインなら戻す
      }
    }

    checkAuth()
  }, [navigate])

  const handleSelect = (role: string) => {
    if (role === 'hall') navigate('/hall')
    if (role === 'kitchen') navigate('/kitchen')
    if (role === 'counter') navigate('/counter')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">担当を選んでください</h1>
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => handleSelect('hall')}
          className="w-full bg-cafe-base hover:bg-cafe-hover text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
        >
          ホール
        </button>
        <button
          onClick={() => handleSelect('kitchen')}
          className="w-full bg-cafe-base hover:bg-cafe-hover text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
        >
          キッチン
        </button>
        <button
          onClick={() => handleSelect('counter')}
          className="w-full bg-cafe-base hover:bg-cafe-hover text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
        >
          カウンター
        </button>
      </div>
    </div>
  )
}
