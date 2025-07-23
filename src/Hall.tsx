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
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold text-center text-cafe-text">ホール注文フォーム</h1>

      <div className="flex flex-wrap gap-2 justify-center">
        <input
          type="text"
          placeholder="商品名"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="border px-3 py-2 rounded w-32"
        />
        <input
          type="number"
          placeholder="数量"
          value={qty}
          min="1"
          onChange={(e) => setQty(Number(e.target.value))}
          className="border px-3 py-2 rounded w-20"
        />
        <select
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="border px-3 py-2 rounded"
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
        <button
          onClick={addOrder}
          className="bg-cafe-base hover:bg-cafe-hover text-white font-medium px-4 py-2 rounded"
        >
          追加
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-center">注文一覧（確認用）</h2>
        <ul className="mt-4 space-y-2">
          {orders.map((order) => (
            <li key={order.id} className="border-b pb-2 text-sm">
              <span className="font-bold text-cafe-text">テーブル {order.table_number || '未指定'}:</span>{' '}
              <span className="font-semibold">{order.item || '[商品名なし]'}</span> × {order.qty}（{order.status}）
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Hall
