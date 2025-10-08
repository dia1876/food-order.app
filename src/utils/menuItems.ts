// src/utils/menuItems.ts

export type MenuItem = {
  id: string
  name: string
  price: number
  category: string
  destinations: { kitchen: boolean; counter: boolean }
}

export const menuItems: MenuItem[] = [
  // ☕️ ドリンク
  { id: 'blend-coffee', name: 'ブレンドコーヒー', price: 600, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'american-coffee', name: 'アメリカンコーヒー', price: 600, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'ice-coffee', name: 'アイスコーヒー', price: 600, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'cafe-au-lait', name: 'カフェオーレ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'vienna-coffee', name: 'ウインナーコーヒー', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'cappuccino', name: 'カフェカプチーノ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'original-tea', name: 'オリジナルブレンドティ（セイロンベース）', price: 600, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'ice-tea', name: 'オリジナルアイスティ（アールグレイベース）', price: 600, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'tea-au-lait', name: 'ティーオーレ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'vienna-tea', name: 'ウインナーティ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'darjeeling', name: 'ダージリンティ（セカンドフラッシュ系）', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'assam', name: 'アッサムティ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'cinnamon-tea', name: 'シナモンティ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'apple-tea', name: 'アップルティ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'mint-tea', name: 'ペパーミントティ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'chamomile', name: 'カモミールティ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'hibiscus', name: 'ハイビスカスティ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'rosehip', name: 'ローズヒップティ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'tomato-juice', name: 'トマトジュース', price: 600, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'mix-juice', name: 'ミックスジュース', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'banana-juice', name: 'バナナジュース', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'grapefruit-juice', name: 'グレープフルーツジュース', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'orange-juice', name: 'オレンジジュース', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'melon-juice', name: 'メロンジュース', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'ginger-ale', name: 'ジンジャエール', price: 600, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'cola', name: 'コーラ', price: 600, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'cocoa', name: 'ココア', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },
  { id: 'almond-au-lait', name: 'アーモンドオーレ', price: 700, category: 'ドリンク', destinations: { kitchen: false, counter: true } },

  // 🍰 デザート
  { id: 'ice-cream', name: 'アイスクリーム', price: 650, category: 'デザート', destinations: { kitchen: false, counter: true } },
  { id: 'pudding', name: '自家製レトロプリン（単品）', price: 600, category: 'デザート', destinations: { kitchen: false, counter: true } },
  { id: 'fruit-parfait', name: 'フルーツパフェ', price: 1150, category: 'デザート', destinations: { kitchen: false, counter: true } },
  { id: 'choco-parfait', name: 'チョコレートパフェ', price: 1000, category: 'デザート', destinations: { kitchen: false, counter: true } },
  { id: 'french-toast', name: 'フレンチブリュレトースト（単品）', price: 850, category: 'デザート', destinations: { kitchen: false, counter: true } },

  // 🍞 フード
  { id: 'omurice', name: 'オムライス（セット）', price: 1550, category: 'フード', destinations: { kitchen: true, counter: false } },
  { id: 'beef-cutlet-sand', name: 'ビーフカツサンド＆ミニサラダ', price: 1300, category: 'フード', destinations: { kitchen: true, counter: false } },
  { id: 'steak', name: 'サーロインステーキ200g（単品）', price: 1700, category: 'フード', destinations: { kitchen: true, counter: false } },
  { id: 'hamburg', name: '煮込みハンバーグ（セット）', price: 1950, category: 'フード', destinations: { kitchen: true, counter: false } },

  // 🍽 セット
  { id: 'tea-set-scone', name: 'ティーセット（スコーン＋コーヒー or ティー or ハーブ）', price: 1000, category: 'セット', destinations: { kitchen: true, counter: true } },
  { id: 'tea-set-cake', name: 'ティーセット（ケーキ＋コーヒー or ティー or ハーブ）', price: 1050, category: 'セット', destinations: { kitchen: true, counter: true } },
]


