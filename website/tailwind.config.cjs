/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      number: ["Chivo", "monospace"],
      title: ["Poppins", "Inter", "sans-serif"],
      sans: ["Karla", "Inter", "sans-serif"],
    },
    extend: {
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
          text: "#C3C3C3",
          "text-dark": "#464646",
          border: "#201F1F",
        },
        "header-image-overlay": "#3D2946",
        "gradient-purple": {
          from: "#889BFF",
          to: "#fa4520",
          via: "#CA55DD",
        },
      },
    },
  },
  plugins: [],
};
