/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/main/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#f13a01',
      },
    },
  },
  plugins: [],
};
