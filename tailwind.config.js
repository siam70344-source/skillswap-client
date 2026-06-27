/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary':   '#0d1117',
        'bg-secondary': '#161b22',
        'bg-tertiary':  '#21262d',
        'border-def':   '#30363d',
        'border-sub':   '#21262d',
        'txt-primary':  '#e6edf3',
        'txt-secondary':'#8b949e',
        'txt-muted':    '#6e7681',
        'acc-blue':     '#58a6ff',
        'acc-blue-btn': '#1f6feb',
        'acc-green':    '#3fb950',
        'acc-purple':   '#bc8cff',
        'acc-amber':    '#e3b341',
      },
    },
  },
  plugins: [],
}