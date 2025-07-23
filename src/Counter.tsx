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

export default function Counter() {
  const [orders, setOrders] = useState<Order[]>([])

  // オーダー取得してカウンター分だけ絞り込む
  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*')
    if (!error && data) {
      const filtered = data.filter((order: Order) => {
        const found = menuItems.find((m) => m.name === order.item)
        return found?.destinations.counter
      })
      setOrders(filtered)
    }
  }

  useEffect(() => {
    fetchOrders()

    const subscription = supabase
      .channel('orders-counter')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const updateStatus = async (id: number, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      )
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>カウンター用オーダー一覧</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id} style={{ marginBottom: '1rem' }}>
            <strong>{order.item}</strong> × {order.qty}（{order.status}） @テーブル {order.table_number}
            {order.status === '未対応' && (
              <button
                style={{ marginLeft: '1rem' }}
                onClick={() => updateStatus(order.id, '配膳済み')}
              >
                → 提供済みへ
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
