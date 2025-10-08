// src/Kitchen.tsx
import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import { menuItems } from './utils/menuItems'

type Order = {
  id: number
  item: string
  qty: number
  status: '未対応' | '調理中' | '配膳済み'
  table_number?: string | null
  created_at?: string | null // あれば表示、無ければ非表示
}

// 絵文字アイコン（カテゴリで切替）
function itemIcon(name: string) {
  const m = menuItems.find(x => x.name === name)
  switch (m?.category) {
    case 'ドリンク': return '☕️'
    case 'デザート': return '🍰'
    case 'セット':   return '🧺'
    default:          return '🍳' // フードなど
  }
}

// 相対時間（created_at が無ければ空）
function timeAgo(iso?: string | null) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `${sec}秒前`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}分前`
  const h = Math.floor(min / 60)
  if (h < 48) return `${h}時間前`
  const d = Math.floor(h / 24)
  return `${d}日前`
}

// ステータスの次ステップ
function nextStatus(s: Order['status']) {
  if (s === '未対応') return '調理中' as const
  if (s === '調理中') return '配膳済み' as const
  return null
}

export default function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([])
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  // 取得（キッチン宛てのみ）
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id,item,qty,status,table_number,created_at')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
    if (error) return
    const onlyKitchen = (data ?? []).filter((o) => {
      const found = menuItems.find(m => m.name === o.item)
      return !!found?.destinations.kitchen
    })
    setOrders(onlyKitchen as Order[])
  }

  useEffect(() => {
    fetchOrders()
    const ch = supabase
      .channel('orders-kitchen')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const updateStatus = async (id: number, to: Exclude<Order['status'],'未対応'>) => {
    setUpdatingId(id)
    const { error } = await supabase.from('orders').update({ status: to }).eq('id', id)
    setUpdatingId(null)
    if (!error) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: to } : o))
    }
  }

  // 並び：未対応 → 調理中 → 配膳済み
  const sorted = useMemo(() => {
    const rank = { '未対応': 0, '調理中': 1, '配膳済み': 2 }
    return [...orders].sort((a,b) => rank[a.status] - rank[b.status])
  }, [orders])

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-gray-200">
        <div className="mb-4 rounded-t-xl bg-blue-500 px-4 py-3 text-xl font-extrabold text-white">
          キッチン
        </div>

        <ul className="space-y-3">
          {sorted.map(o => {
            const to = nextStatus(o.status)
            const disabled = !to || updatingId === o.id
            return (
              <li key={o.id} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-gray-800">
                      <span className="text-lg font-bold">テーブル {o.table_number || '—'}</span>
                      {o.created_at && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          ⏱ {timeAgo(o.created_at)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <span className="text-xl">{itemIcon(o.item)}</span>
                      <span className="font-medium">{o.item}</span>
                      <span className="text-gray-600">× {o.qty}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">状態：{o.status}</div>
                  </div>

                  {to && (
                    <button
                      onClick={() => updateStatus(o.id, to)}
                      disabled={disabled}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-green-600 transition
                        ${disabled
                          ? 'cursor-not-allowed border-gray-200 text-gray-300'
                          : 'border-green-300 hover:bg-green-50'}`}
                      title={`「${to}」へ`}
                      aria-label={`「${to}」へ`}
                    >
                      ✓
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        {sorted.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">現在オーダーはありません。</p>
        )}
      </div>
    </div>
  )
}
