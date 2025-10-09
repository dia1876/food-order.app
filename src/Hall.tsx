import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import { menuItems } from './utils/menuItems'

type OrderRow = {
  id: number
  item: string
  qty: number
  status: '未対応' | '調理中' | '配膳済み'
  table_number?: string | null
}

const TABLES = [
  'A','B','C','D','E','F',
  '1','2','3','4',
  '11','12','13','14','15','16','17',
  '18S','18N','18W','18E',
]

// バッジ色（一覧側で使用）
function badgeClass(status: OrderRow['status']) {
  switch (status) {
    case '未対応': return 'bg-red-100 text-red-700 ring-1 ring-red-200'
    case '調理中': return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
    case '配膳済み': return 'bg-green-100 text-green-700 ring-1 ring-green-200'
    default: return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
  }
}

// カードで選んだ未送信の注文（カート）
type PendingItem = { id: string; name: string; qty: number }

export default function Hall() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [tableNumber, setTableNumber] = useState('')
  const [adding, setAdding] = useState(false)

  // ====== カテゴリ・タブ ======
  const categories = useMemo(() => {
    const set = new Set<string>()
    menuItems.forEach(m => m.category && set.add(m.category))
    return ['ドリンク', 'フード', 'デザート', 'セット', ...Array.from(set).filter(c => !['ドリンク','フード','デザート','セット'].includes(c))]
      .filter((v, i, a) => a.indexOf(v) === i) // 重複除去
  }, [])

  const [activeCat, setActiveCat] = useState<string>(categories[0] || 'ドリンク')

  const filteredMenu = useMemo(() => {
    return menuItems.filter(m => m.category === activeCat)
  }, [activeCat])

  // ====== カート（未送信の選択） ======
  const [cart, setCart] = useState<PendingItem[]>([])

  const addToCart = (id: string, name: string) => {
    setCart(prev => {
      const hit = prev.find(p => p.id === id)
      if (hit) {
        return prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p)
      }
      return [...prev, { id, name, qty: 1 }]
    })
  }
  const decFromCart = (id: string) => {
    setCart(prev =>
      prev.flatMap(p => {
        if (p.id !== id) return [p]
        const q = p.qty - 1
        return q > 0 ? [{ ...p, qty: q }] : []
      })
    )
  }
  const clearCart = () => setCart([])

  // ====== 既存の注文取得（下部の確認用一覧） ======
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id,item,qty,status,table_number')
      .order('id', { ascending: false })
    if (!error) setOrders(data ?? [])
  }

  useEffect(() => {
    fetchOrders()
    const ch = supabase
      .channel('orders-hall')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const row = payload.new as OrderRow
        setOrders(prev => [row, ...prev])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const row = payload.new as OrderRow
        setOrders(prev => prev.map(o => o.id === row.id ? row : o))
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'orders' }, (payload) => {
        const row = payload.old as OrderRow
        setOrders(prev => prev.filter(o => o.id !== row.id))
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  // ====== まとめて送信 ======
  const submitCart = async () => {
    if (!tableNumber) return alert('テーブル番号を選んでください')
    if (cart.length === 0) return

    setAdding(true)
    const payload = cart.map(c => ({
      item: c.name,
      qty: c.qty,
      status: '未対応' as const,
      table_number: tableNumber,
    }))

    const { error } = await supabase.from('orders').insert(payload)
    setAdding(false)
    if (error) {
      console.error(error)
      return alert('送信に失敗しました: ' + error.message)
    }
    clearCart()
    alert('オーダーを登録しました')
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-center text-2xl font-extrabold text-cafe-text">ホールオーダー</h1>

        {/* テーブル番号 */}
        <div className="flex flex-col">
          <label htmlFor="table" className="mb-1 text-sm font-medium text-gray-700">テーブル番号</label>
          <select
            id="table"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-base focus-visible:ring-offset-2"
          >
            <option value="">選択してください</option>
            {TABLES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* タブ */}
        <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
          {categories.map(cat => {
            const active = activeCat === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={active
                  ? 'flex-1 rounded-md bg-white px-4 py-2 text-center font-semibold text-cafe-text shadow'
                  : 'flex-1 rounded-md px-4 py-2 text-center text-gray-600 hover:bg-white'}
                aria-pressed={active}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* メニューカード（2列） */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredMenu.map(m => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl">☕️</span>
                <div className="truncate">
                  <p className="truncate font-medium text-gray-900">{m.name}</p>
                  {typeof m.price === 'number' && (
                    <p className="text-xs text-gray-500">¥{m.price.toLocaleString()}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => addToCart(m.id, m.name)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cafe-base text-cafe-text hover:bg-cafe-base hover:text-white transition"
                title="追加"
              >
                ＋
              </button>
            </div>
          ))}
        </div>

        {/* カート表示 */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">今回のオーダー</h2>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-sm text-gray-500 hover:underline">クリア</button>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">まだ追加されていません。</p>
          ) : (
            <ul className="space-y-2">
              {cart.map(c => (
                <li key={c.id} className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow">
                  <span className="truncate">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="h-7 w-7 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                      onClick={() => decFromCart(c.id)}
                      aria-label="数量を減らす"
                    >−</button>
                    <span className="w-6 text-center">{c.qty}</span>
                    <button
                      className="h-7 w-7 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                      onClick={() => addToCart(c.id, c.name)}
                      aria-label="数量を増やす"
                    >＋</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

{/* 下部の確定ボックス（Hall.tsx のオーダー確定部） */}
<div className="sticky bottom-0 left-0 right-0 mt-3 bg-white/90 backdrop-blur px-3 py-3">
  <button
    type="button"
    onClick={submitCart}
    disabled={adding || cart.length === 0 || !tableNumber}
    className={`w-full rounded-xl px-5 py-3 text-lg font-bold shadow transition
      focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cafe-base focus-visible:ring-offset-2
      ${
        adding || cart.length === 0 || !tableNumber
          ? '!bg-white !text-gray-900 !border !border-gray-300 cursor-not-allowed'
          : '!bg-cafe-base !text-white !border !border-transparent hover:!bg-cafe-hover active:scale-[0.98]'
      }`}
  >
    {adding ? '送信中…' : '+ オーダー確定'}
  </button>
</div>




        {/* 送信済み一覧（確認用） */}
        <div>
          <h3 className="mt-6 text-center text-lg font-semibold">送信済み一覧（確認用）</h3>
          {orders.length === 0 ? (
            <p className="mt-2 text-center text-sm text-gray-500">まだ注文はありません。</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-200">
              {orders.map(o => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <span className="font-bold text-cafe-text">テーブル {o.table_number || '未指定'}：</span>{' '}
                    <span className="font-semibold">{o.item || '[商品名なし]'}</span>{' '}
                    × {o.qty}
                  </div>
                  <span className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-medium ${badgeClass(o.status)}`}>
                    {o.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}









