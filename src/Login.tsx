import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleSelect = (role: string) => {
    if (role === 'hall') navigate('/hall')
    if (role === 'kitchen') navigate('/kitchen')
    if (role === 'counter') navigate('/counter')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ログイン（担当を選んでください）</h1>
      <button onClick={() => handleSelect('hall')}>ホール</button>
      <button onClick={() => handleSelect('kitchen')}>キッチン</button>
      <button onClick={() => handleSelect('counter')}>カウンター</button>
    </div>
  )
}
