/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'glass-panel',
    'glass-card',
    'neomorph-inset',
    'neomorph-raised',
    'btn-neural',
    'btn-glass',
    'input-neural',
    'voice-container',
    'neural-pulse',
    'gradient-neural',
    'text-shadow-neural',
    'neural-pattern',
    'backdrop-blur-glass',
  ],
  theme: {
    extend: {
      colors: {
        // Neural Glass Color System
        neural: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          purple: '#6366f1',
          blue: '#3b82f6',
          green: '#10b981',
          orange: '#f59e0b',
        },
        synapse: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dendrite: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        axon: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        glass: {
          50: 'rgba(255, 255, 255, 0.9)',
          100: 'rgba(255, 255, 255, 0.8)',
          200: 'rgba(255, 255, 255, 0.6)',
          300: 'rgba(255, 255, 255, 0.4)',
          400: 'rgba(255, 255, 255, 0.2)',
          500: 'rgba(255, 255, 255, 0.1)',
        }
      },
      animation: {
        'neural-pulse': 'neural-pulse 2s ease-in-out infinite',
        'float-gentle': 'float-gentle 3s ease-in-out infinite',
        'glow-soft': 'glow-soft 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        'neural-pulse': {
          '0%, 100%': { 
            opacity: '0.8',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.05)',
          },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'glow-soft': {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'neural-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\"%%3E%3Cg opacity=\"0.1\"%%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"1\" fill=\"%236366f1\"/%%3E%3Ccircle cx=\"50\" cy=\"20\" r=\"1\" fill=\"%233b82f6\"/%%3E%3Ccircle cx=\"30\" cy=\"40\" r=\"1\" fill=\"%2310b981\"/%%3E%3Cpath d=\"M10 10L30 40M50 20L30 40\" stroke=\"%236366f1\" stroke-width=\"0.5\" opacity=\"0.5\"/%%3E%3C/g%%3E%3C/svg%%3E')",
        'glass-grain': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\"%%3E%3Cfilter id=\"noiseFilter\"%%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" result=\"noise\"%%3E%3C/feTurbulence%%3E%3C/filter%%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%%3E%3C/svg%%3E')",
      }
    },
  },
  plugins: [],
}
