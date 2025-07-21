// tailwind.config.js に以下を手動で記述
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
// tailwind.config.js を自動生成するためのコード