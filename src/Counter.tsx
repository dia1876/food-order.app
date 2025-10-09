// src/Counter.tsx
import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import { menuItems } from './utils/menuItems'

type Order = {
  id: number
  item: string
  qty: number
  status: '未対応' | '調理中' | '配膳済み'
  table_number?: string | null
  created_at?: string | null
}

const STATUS_FLOW: Order['status'][] = ['未対応', '調理中', '配膳済み']
const nextStatus = (s: Order['status']) => {
  const i = STATUS_FLOW.indexOf(s)
  return STATUS_FLOW[i + 1] ?? null
}
const prevStatus = (s: Order['status']) => {
  const i = STATUS_FLOW.indexOf(s)
  return STATUS_FLOW[i - 1] ?? null
}

function iconByCategory(name: string) {
  const m = menuItems.find(x => x.name === name)
  switch (m?.category) {
    case 'ドリンク': return '☕️'
    case 'デザート': return '🍰'
    case 'セット':   return '🧺'
    default:          return '🥤'
  }
}
function timeAgo(iso?: string | null) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}秒前`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}分前`
  const h = Math.floor(m / 60)
  if (h < 48) return `${h}時間前`
  const d = Math.floor(h / 24)
  return `${d}日前`
}

export default function Counter() {
  const [orders, setOrders] = useState<Order[]>([])
  const [busyId, setBusyId] = useState<number | null>(null)

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id,item,qty,status,table_number,created_at')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
    if (error) return
    const list = (data ?? []).filter(o => {
      const found = menuItems.find(m => m.name === o.item)
      return !!found?.destinations.counter
    })
    setOrders(list as Order[])
  }

  useEffect(() => {
    fetchOrders()
    const ch = supabase
      .channel('orders-counter')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const setStatus = async (id: number, to: Order['status']) => {
    setBusyId(id)
    const { error } = await supabase.from('orders').update({ status: to }).eq('id', id)
    setBusyId(null)
    if (!error) setOrders(prev => prev.map(o => o.id === id ? { ...o, status: to } : o))
  }

  const sorted = useMemo(() => {
    const rank = { '未対応': 0, '調理中': 1, '配膳済み': 2 }
    return [...orders].sort((a,b) => rank[a.status] - rank[b.status])
  }, [orders])

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-gray-200">
        <div className="mb-4 rounded-t-xl bg-blue-500 px-4 py-3 text-xl font-extrabold text-white">
          カウンター
        </div>

        <ul className="space-y-3">
          {sorted.map(o => {
            const done = o.status === '配膳済み'
            const prv = prevStatus(o.status) // ← 戻せる
            const nxt = done ? null : '配膳済み' as const // カウンターは基本「配膳済み」方向に進める
            const loading = busyId === o.id

            return (
              <li key={o.id} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-gray-800">
                      <span className="text-lg font-bold">テーブル {o.table_number || '—'}</span>
                      {o.created_at && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">⏱ {timeAgo(o.created_at)}</span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <span className="text-xl">{iconByCategory(o.item)}</span>
                      <span className="font-medium">{o.item}</span>
                      <span className="text-gray-600">× {o.qty}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">状態：{o.status}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 戻す（配膳済み→調理中、調理中→未対応） */}
                    {prv && (
                      <button
                        onClick={() => setStatus(o.id, prv)}
                        disabled={loading}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border transition
                          ${loading ? 'cursor-not-allowed border-gray-200 text-gray-300' : 'border-amber-300 text-amber-600 hover:bg-amber-50'}`}
                        title={`「${prv}」へ戻す`}
                        aria-label={`「${prv}」へ戻す`}
                      >
                        ←
                      </button>
                    )}

                    {/* 配膳済みに進める */}
                    {nxt && (
                      <button
                        onClick={() => setStatus(o.id, nxt)}
                        disabled={loading}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border transition
                          ${loading ? 'cursor-not-allowed border-gray-200 text-gray-300' : 'border-green-300 text-green-600 hover:bg-green-50'}`}
                        title="配膳済みにする"
                        aria-label="配膳済みにする"
                      >
                        ✓
                      </button>
                    )}
                  </div>
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
