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

  // オーダーを取得してフィルタする関数
  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*')
    if (!error && data) {
      const filtered = data.filter((order: Order) => {
        const found = menuItems.find((m) => m.name === order.item)
        return found?.destinations.kitchen
      })
      setOrders(filtered)
    }
  }

  useEffect(() => {
    fetchOrders()

    // リアルタイム反映
    const subscription = supabase
      .channel('orders-kitchen')
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

  // ステータス更新
  const updateStatus = async (id: number, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      // ローカル状態も更新
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      )
    }
  }

  // ステータスに応じた次ステップ
  const getNextStatus = (status: Order['status']) => {
    if (status === '未対応') return '調理中'
    if (status === '調理中') return '配膳済み'
    return null
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>👨‍🍳 キッチン用オーダー一覧</h1>
      <ul>
        {orders.map((order) => {
          const nextStatus = getNextStatus(order.status)
          return (
            <li key={order.id} style={{ marginBottom: '1rem' }}>
              <strong>{order.item}</strong> × {order.qty}（{order.status}） @テーブル {order.table_number}
              {nextStatus && (
                <button
                  style={{ marginLeft: '1rem' }}
                  onClick={() => updateStatus(order.id, nextStatus)}
                >
                  → {nextStatus}へ
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
