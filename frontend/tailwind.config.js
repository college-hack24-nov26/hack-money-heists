/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New Premium SaaS Minimalist Palette
        brand: {
          violet: "#8B5CF6",
          deep: "#6D45CF",
          soft: "#EDE7FF",
        },
        bg: {
          primary: "#FFFFFF",
          secondary: "#F7F7FA",
          soft: "#ECECF1",
        },
        text: {
          primary: "#17171F",
          secondary: "#292936",
          body: "#41414D",
          supporting: "#626270",
          nav: "#252532",
          muted: "#727280",
        },
        arthiq: {
          heading1: "#17171F",
          heading2: "#292936",
          body: "#41414D",
          supporting: "#626270",
          nav: "#252532",
          muted: "#727280",
          darkHeading1: "#FFFFFF",
          darkHeading2: "#E5E5EB",
          darkBody: "#C6C6D0",
          darkSupporting: "#A1A1AE",
        },
        surface: {
          dark: "#11131B",
          glass: "rgba(17,19,27,0.78)",
          card: "#FFFFFF",
        },
        fin: {
          success: "#16A879",
          warning: "#E5A33D",
          critical: "#E46D72",
        },
        border: {
          DEFAULT: "#E5E5EB",
          light: "#E5E5EB",
          subtle: "#F0F0F5",
        },
        // Legacy colors retained for dashboard widgets
        midnight: "#080D16",
        navy: {
          DEFAULT: "#101827",
          dark: "#0B111D",
          light: "#172338"
        },
        graphite: "#171F2D",
        accent: {
          blue: "#8B5CF6",
          cyan: "#6D45CF",
          emerald: "#16A879",
          amber: "#E5A33D",
          coral: "#E46D72"
        },
        neutral: {
          offwhite: "#000000",
          muted: "#0A0A0C",
          border: "#E5E5EB"
        }
      },
      fontFamily: {
        sans: ["Inter", "Geist Sans", "Plus Jakarta Sans", "Manrope", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        card: "0 2px 10px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        cardHover: "0 12px 30px -10px rgba(109, 69, 207, 0.12), 0 4px 12px 0 rgba(0, 0, 0, 0.03)",
        violetGlow: "0 0 30px -5px rgba(139, 92, 246, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float-subtle": "floatSubtle 6s ease-in-out infinite",
        "float-reverse": "floatReverse 7s ease-in-out infinite",
        "pulse-gentle": "pulseGentle 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSubtle: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(8px)" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
