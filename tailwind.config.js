/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          base: '#C18E60',   // メインブラウン（ボタンや強調）
          hover: '#a36f43',  // hover時の濃いブラウン
          text: '#5C4033',   // 文字用：深いブラウン
          light: '#FAF6F0',  // 明るい背景（ベージュ）
          muted: '#DCC5AD',  // 補助背景：カード/ボックス
          dark: '#3C2A21',   // ダークブラウン：画面全体の背景
        },
        cream: {
          50: '#FDF8F3',
          100: '#F8EAD8',
          200: '#F1D4B8',
        },
      },
    },
  },
  plugins: [],
}



// tailwind.config.js を自動生成するためのコード