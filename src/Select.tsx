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
        navigate('/login')
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
    <div className="bg-cafe-light flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-3xl font-bold mb-8 text-cafe-text tracking-wide">
        担当を選んでください
      </h1>
      <div className="space-y-4 w-full max-w-xs">
        {[
          { label: 'ホール', value: 'hall' },
          { label: 'キッチン', value: 'kitchen' },
          { label: 'カウンター', value: 'counter' },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className="w-full bg-cafe-base hover:bg-cafe-hover text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-200 tracking-wide"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
