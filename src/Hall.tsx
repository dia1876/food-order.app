import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { menuItems } from './utils/menuItems'

type Order = {
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

function badgeClass(status: Order['status']) {
  switch (status) {
    case '未対応': return 'bg-red-100 text-red-700 ring-1 ring-red-200'
    case '調理中': return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
    case '配膳済み': return 'bg-green-100 text-green-700 ring-1 ring-green-200'
    default: return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
  }
}

export default function Hall() {
  const [orders, setOrders] = useState<Order[]>([])
  const [item, setItem] = useState('')
  const [qty, setQty] = useState(1)
  const [tableNumber, setTableNumber] = useState('')
  const [adding, setAdding] = useState(false)

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id,item,qty,status,table_number')
      .order('id', { ascending: false })
    if (error) {
      console.error('取得エラー:', error)
      return
    }
    setOrders(data ?? [])
  }

  useEffect(() => {
    fetchOrders()
    const ch = supabase
      .channel('orders-hall')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const row = payload.new as Order
        setOrders((prev) => [row, ...prev])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const row = payload.new as Order
        setOrders((prev) => prev.map(o => o.id === row.id ? row : o))
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'orders' }, (payload) => {
        const row = payload.old as Order
        setOrders((prev) => prev.filter(o => o.id !== row.id))
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const addOrder = async () => {
    const name = item.trim()
    const q = Number.isFinite(qty) && qty > 0 ? qty : 1
    if (!name) return alert('商品を選択してください')

    setAdding(true)
    const { error, data } = await supabase
      .from('orders')
      .insert({ item: name, qty: q, status: '未対応', table_number: tableNumber || null })
      .select('id,item,qty,status,table_number')
      .single()
    setAdding(false)

    if (error) {
      console.error('追加失敗:', error)
      return alert('追加失敗: ' + error.message)
    }

    if (data) setOrders((prev) => [data as Order, ...prev])

    setItem('')
    setQty(1)
    setTableNumber('')
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-center text-2xl font-extrabold text-cafe-text">ホール注文フォーム</h1>

        {/* フォーム */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          {/* 商品 */}
          <div className="flex flex-col">
            <label htmlFor="item" className="sr-only">商品</label>
            <select
              id="item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white text-gray-800 px-3 py-2 shadow-sm
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-cafe-base focus-visible:ring-offset-2"
            >
              <option value="">商品を選択</option>
              {menuItems.map((m) => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* 数量 */}
          <div className="flex flex-col">
            <label htmlFor="qty" className="sr-only">数量</label>
            <input
              id="qty"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number.isFinite(e.target.valueAsNumber) && e.target.valueAsNumber > 0 ? e.target.valueAsNumber : 1)}
              className="w-full rounded-md border border-gray-300 bg-white text-gray-800 px-3 py-2 text-center shadow-sm
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-cafe-base focus-visible:ring-offset-2"
            />
          </div>

          {/* テーブル */}
          <div className="flex flex-col">
            <label htmlFor="table" className="sr-only">テーブル</label>
            <select
              id="table"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white text-gray-800 px-3 py-2 shadow-sm
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-cafe-base focus-visible:ring-offset-2"
            >
              <option value="">テーブル選択</option>
              {TABLES.map((t) => (
                <option key={t} value={t}>テーブル {t}</option>
              ))}
            </select>
          </div>

          {/* 追加ボタン */}
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={addOrder}
              disabled={!item.trim() || adding}
              className={`inline-flex w-full items-center justify-center rounded-lg 
                          px-5 py-3 text-lg font-bold shadow-lg transition-all duration-200
                          ${adding || !item.trim()
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-cafe-base text-white hover:bg-cafe-hover hover:scale-[1.02] active:scale-95'
                          }
                          focus-visible:outline-none focus-visible:ring-4
                          focus-visible:ring-cafe-base focus-visible:ring-offset-2`}
            >
              {adding ? '追加中…' : '+ 追加'}
            </button>
          </div>
        </div>

        {/* 注文一覧 */}
        <div>
          <h2 className="text-center text-xl font-semibold">注文一覧（確認用）</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-center text-sm text-gray-500">まだ注文はありません。</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-200">
              {orders.map((o) => (
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








