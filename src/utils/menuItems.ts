// src/utils/menuItems.ts
export type MenuItem = {
  id: string
  name: string
  price?: number
  destinations: { kitchen: boolean; counter: boolean }
}

export const menuItems: MenuItem[] = [
  { id: 'omurice', name: 'オムライス', price: 900, destinations: { kitchen: true, counter: false } },
  { id: 'coffee',  name: 'コーヒー',   price: 400, destinations: { kitchen: false, counter: true } },
  { id: 'tea',     name: '紅茶',       price: 400, destinations: { kitchen: false, counter: true } },
]
// 追加のメニュー例
// { id: 'pancakes', name: 'パンケーキ', price: 700, destinations: { kitchen: true, counter: false } },
// { id: 'salad',    name: 'サラダ',     price: 500, destinations: { kitchen: true, counter: false } },
// { id: 'juice',    name: 'ジュース',   price: 300, destinations: { kitchen: false, counter: true } }, 