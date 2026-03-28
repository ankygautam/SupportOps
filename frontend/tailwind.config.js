/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 12px 32px rgba(15, 23, 42, 0.08)",
        soft: "0 6px 18px rgba(15, 23, 42, 0.06)",
      },
      colors: {
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "dashboard-grid":
          "radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 24%), radial-gradient(circle at bottom left, rgba(15, 23, 42, 0.06), transparent 20%)",
      },
    },
  },
  plugins: [],
};
