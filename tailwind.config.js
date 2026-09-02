/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './src/components/code/**/*.{ts,tsx}',
    './src/layouts/WbCode*.astro',
    './src/pages/code/**/*.astro',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        space: {
          bg: '#050508',
          'bg-secondary': '#0A0A12',
          'bg-tertiary': '#0E0E18',
          accent: '#6C63FF',
          'accent-secondary': '#4A90FF',
          text: '#F0F0F5',
          'text-secondary': '#8A8AA0',
          'text-muted': '#505068',
          success: '#38E8B0',
          warning: '#FFB347',
        },
      },
      fontFamily: {
        display: ['Syncopate', 'sans-serif'],
        body: ['Space Grotesk Variable', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'glow': '0 0 30px rgba(108, 99, 255, 0.2)',
        'glow-lg': '0 0 40px rgba(108, 99, 255, 0.15)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(var(--orbit-radius, 100px)) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(var(--orbit-radius, 100px)) rotate(-360deg)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "pulse-line": {
          "0%, 100%": { opacity: "0.3", transform: "scaleY(1)" },
          "50%": { opacity: "0.8", transform: "scaleY(1.2)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float": "float 6s ease-in-out infinite",
        "orbit": "orbit 30s linear infinite",
        "blink": "blink 1s step-end infinite",
        "pulse-line": "pulse-line 2s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
