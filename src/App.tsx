import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase' // ←これも必要

type order = {
  id: number
  item: string
  qty: number
  status: '未対応' | '調理中' | '配膳済み'
  table_number?: string // テーブル番号はオプションにする
} 

function App() {
  const [orders, setOrders] = useState<order[]>([])
  const [item, setItem] = useState('')
  const [qty, setQty] = useState(1)
  const [tableNumber, setTableNumber] = useState('')
  const fetchOrders = async () => {
  const { data, error } = await supabase.from('orders').select('*')
  if (error) {
    console.error('取得エラー:', error)
  } else {
    console.log('取得データ:', data)
    setOrders(data)
  }
}
  useEffect(() => {
    fetchOrders()
    console.log('Fetching orders...')
  }, [])

 const addOrder = async () => {
  if (!item.trim()) {
    alert('商品名を入力してください')
    return
  }
  const { error } = await supabase.from('orders').insert({
    item,
    qty,
    status: '未対応',
    tableNumber: tableNumber,
  })
  if (!error) {
    console.log('追加成功:', item, qty)
    setItem('')
    setQty(1)
    fetchOrders()
  } else {
    console.error('追加失敗:', error)
  }
}


  // ✅ ここを外に出す！
  const updateStatus = async (id: number, currentStatus: string) => {
    const statusCycle = ['未対応', '調理中', '配膳済み']
    const nextIndex = (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length
    const nextStatus = statusCycle[nextIndex]

    const { error } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', id)

    if (!error) fetchOrders()
  }

  const deleteOrder = async (id: number) => {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (!error) fetchOrders()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>注文フォーム</h1>
      <input
        type="text"
        placeholder="商品名"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <input
        type="number"
        placeholder="数量"
        value={qty}
        min="1"
        onChange={(e) => setQty(Number(e.target.value))}
      />
      <select value={tableNumber} onChange={(e) => setTableNumber(e.target.value)}>
  <option value="">テーブル選択</option>
  {[
    'A', 'B', 'C', 'D', 'E', 'F',
    '1', '2', '3', '4',
    '11', '12', '13', '14', '15', '16', '17',
    '18S', '18N', '18W', '18E'
  ].map((table) => (
    <option key={table} value={table}>
      テーブル {table}
    </option>
  ))}
</select>

      <button onClick={addOrder}>追加</button>

      <h2>注文一覧</h2>
      <ul>
  {orders.map((order) => (
    <li key={order.id}>
      <strong>テーブル {order.table_number || '未指定'}</strong>:
      <strong>{order.item || '[商品名なし]'}</strong> × {order.qty}（{order.status}）
      <button onClick={() => updateStatus(order.id, order.status)}>▶次へ</button>
      <button onClick={() => deleteOrder(order.id)}>🗑削除</button>
    </li>
  ))}
</ul>
    </div>
  )
}

export default App


