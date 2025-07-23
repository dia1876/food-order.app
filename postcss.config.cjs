// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ ← tailwindcss じゃなくこれ！
    autoprefixer: {},
  },
}

