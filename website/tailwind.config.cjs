/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      number: ["Chivo", "monospace"],
      title: ["Poppins", "Inter", "sans-serif"],
      sans: ["Karla", "Inter", "sans-serif"],
      os: ["system-ui", "Inter", "sans-serif"],
    },
    extend: {
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
            // perspective: "1000px",
            // transform: "rotateX(90deg) translateZ(50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            // perspective: "1000px",
          },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 0.7s ease-out",
        "loading-dot-1": "pulse 0.75s linear infinite 0s",
        "loading-dot-2": "pulse 0.75s linear infinite 0.25s",
        "loading-dot-3": "pulse 0.75s linear infinite 0.5s",
      },
      screens: {
        "3xs": "435px",
        "2xs": "535px",
        xs: "600px",
      },
      colors: {
        accent: {
          a: "#FFE175",
          b: "#FBBF24",
          c: "#755910",
        },
        mono: {
          a: "#FFFFFF",
          b: "#C3C3C3",
          c: "#8d8d8d",
          text: "#C3C3C3",
          "text-dark": "#464646",
          "border-lighter": "#282727",
          border: "#201F1F",
        },
        "section-bg-purple-lighter": "#22222C",
        "section-bg-purple": "#181821",
        "header-image-overlay": "#3D2946",
        "gradient-text": {
          from: "#889BFF",
          to: "#fa9006",
          via: "#CA55DD",
        },
        "gradient-more-section": {
          from: "#341234",
          to: "#123244",
        },
        "gradient-purple": {
          from: "#17365A",
          to: "#482F5C",
        },
        "gradient-cyan": {
          from: "#17365A",
          to: "#2F5C44",
        },
      },
    },
  },
  plugins: [],
};
