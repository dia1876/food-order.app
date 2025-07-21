import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { menuItems } from './utils/menuItems'

type Order = {
  id: number
  item: string
  qty: number
  status: '未対応' | '調理中' | '配膳済み'
  table_number?: string
}

export default function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*')
      if (!error && data) {
        // kitchenに対応するitemだけフィルタ
        const filtered = data.filter((order: Order) => {
          const found = menuItems.find(m => m.name === order.item)
          return found?.destinations.kitchen
        })
        setOrders(filtered)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>👨‍🍳 キッチン用オーダー一覧</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <strong>{order.item}</strong> × {order.qty}（{order.status}）@テーブル {order.table_number}
          </li>
        ))}
      </ul>
    </div>
  )
}
