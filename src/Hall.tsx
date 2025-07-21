import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type Order = {
  id: number
  item: string
  qty: number
  status: '未対応' | '調理中' | '配膳済み'
  table_number?: string
}

function Hall() {
  const [orders, setOrders] = useState<Order[]>([])
  const [item, setItem] = useState('')
  const [qty, setQty] = useState(1)
  const [tableNumber, setTableNumber] = useState('')

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*')
    if (error) {
      console.error('取得エラー:', error)
    } else {
      setOrders(data)
    }
  }

  useEffect(() => {
    fetchOrders()
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
      table_number: tableNumber,
    })
    if (!error) {
      setItem('')
      setQty(1)
      fetchOrders()
    } else {
      console.error('追加失敗:', error)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ホール注文フォーム</h1>

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
      <select
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
      >
        <option value="">テーブル選択</option>
        {[
          'A', 'B', 'C', 'D', 'E', 'F',
          '1', '2', '3', '4',
          '11', '12', '13', '14', '15', '16', '17',
          '18S', '18N', '18W', '18E',
        ].map((table) => (
          <option key={table} value={table}>
            テーブル {table}
          </option>
        ))}
      </select>

      <button onClick={addOrder}>追加</button>

      <h2>注文一覧（確認用）</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <strong>テーブル {order.table_number || '未指定'}</strong>:
            <strong>{order.item || '[商品名なし]'}</strong> × {order.qty}（{order.status}）
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Hall
