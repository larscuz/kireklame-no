import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        lift: "0 14px 40px rgba(0,0,0,0.12)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      colors: {
        ink: {
          950: "#0B0D12",
          900: "#0F1420",
          800: "#141B2A"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
