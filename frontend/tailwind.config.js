/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#080D16",
        navy: {
          DEFAULT: "#101827",
          dark: "#0B111D",
          light: "#172338"
        },
        graphite: "#171F2D",
        accent: {
          blue: "#568BFF",
          cyan: "#64D9E8",
          emerald: "#35C99A",
          amber: "#F59E0B",
          coral: "#F87171"
        },
        neutral: {
          offwhite: "#F1F4F8",
          muted: "#8B96A8",
          border: "rgba(255, 255, 255, 0.08)"
        }
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 25px -5px rgba(86, 139, 255, 0.25)",
        emeraldGlow: "0 0 25px -5px rgba(53, 201, 154, 0.25)"
      }
    },
  },
  plugins: [],
}

