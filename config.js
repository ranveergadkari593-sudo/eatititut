tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        charcoal: {
          950: '#050608',
          900: '#0b0d10',
          800: '#11141a',
          700: '#1b1f27'
        },
        slategold: {
          100: '#f2efe8',
          300: '#c9c2b2',
          500: '#8f8676'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.55)'
      }
    }
  }
}
