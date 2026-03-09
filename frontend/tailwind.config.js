/**
 * Tailwind theme configuration for tokens, animations, and design primitives.
 */
/** @type {import('tailwindcss').Config} */
export default {
  // Scan the HTML shell plus all frontend source files for utility usage.
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.25rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      // Typography and token scales intentionally support the premium gaming aesthetic.
      fontFamily: {
        sans: ["Space Grotesk", "Rajdhani", "Segoe UI", "system-ui", "sans-serif"],
        display: ["Rajdhani", "Space Grotesk", "Segoe UI", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#060913",
          100: "#0b1324",
          200: "#15213a",
          300: "#1d2f4f",
          400: "#27406d",
          500: "#35589a",
          600: "#6f8fcc",
          700: "#a8c0ef",
          800: "#2e7bff",
          900: "#e7f0ff",
        },
        accent: {
          50: "#05110b",
          100: "#0c1f17",
          200: "#133226",
          300: "#1b4c3a",
          400: "#256a4f",
          500: "#2f8c66",
          600: "#5ef08a",
          700: "#1df2ff",
          800: "#cf66ff",
          900: "#f0e8ff",
        },
      },
      boxShadow: {
        card: "0 20px 50px -30px rgba(10, 18, 38, 0.9), 0 8px 20px -14px rgba(0, 0, 0, 0.8)",
        glow: "0 0 0 1px rgba(29, 242, 255, 0.4), 0 0 28px rgba(46, 123, 255, 0.45)",
        raised:
          "0 34px 70px -36px rgba(0, 0, 0, 0.86), 0 0 24px rgba(46, 123, 255, 0.28), 0 0 18px rgba(207, 102, 255, 0.2)",
        neon: "0 0 0 1px rgba(46, 123, 255, 0.5), 0 0 26px rgba(29, 242, 255, 0.4)",
      },
      // Shared background and motion tokens reduce repeated arbitrary values in components.
      backgroundImage: {
        "grain-gradient":
          "radial-gradient(130% 110% at -12% -10%, rgba(46,123,255,0.24) 0%, rgba(6,9,19,0.92) 42%, rgba(5,11,22,0.98) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease",
        "slide-up": "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scaleIn 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 1.6s linear infinite",
        "float-slow": "floatSlow 12s ease-in-out infinite",
        "pulse-neon": "pulseNeon 2.3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(18px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-10px) translateX(6px)" },
        },
        pulseNeon: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(46, 123, 255, 0.3), 0 0 0 0 rgba(29, 242, 255, 0.2)",
          },
          "50%": {
            boxShadow:
              "0 0 0 6px rgba(46, 123, 255, 0), 0 0 0 12px rgba(29, 242, 255, 0), 0 0 26px rgba(46, 123, 255, 0.38)",
          },
        },
      },
    },
  },
  plugins: [],
};
