import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleSelect = (role: string) => {
    if (role === 'hall') navigate('/hall')
    if (role === 'kitchen') navigate('/kitchen')
    if (role === 'counter') navigate('/counter')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cafe-light text-cafe-text px-4">
  <h1 className="text-3xl font-bold mb-8">ログイン（担当を選んでください）</h1>

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



