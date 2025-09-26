import { useNavigate } from 'react-router-dom'

export default function Select() {
  const navigate = useNavigate()

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
  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold
             py-3 px-6 rounded-lg shadow-lg transition-transform duration-200
             hover:scale-[1.02] active:scale-95"
>
  {label}
</button>
        ))}
      </div>
    </div>
  )
}
