/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        lg: "1024px",
        xl: "1024px",
        "2xl": "1024px",
      },
    },
    extend: {
      fontFamily: {
        sourceSans: ["Source Sans Pro", "sans serif"],
        inter: ["Inter", "sans serif"],
      },
      colors: {
        lightBlue: "rgba(58,161,255,0.85)",
        darkBlue: "#006CD0",
        solidTint: "#8a8a8a",
        tint: "#5A5a5a",
        smoothTint: "#7a7a7a",
        gray: "#f8f8f8",
        on: "#0039CC",
        off: "rgba(0, 41, 148, 0.43)",
        heading: "#5b5b5b",
        primary: "#0536ff",
        secondary: "#2662ff",
        "solid-slate": "#324567",
        "smooth-slate": "#5a719d",
        "smoother-slate": "#7889a4",
        "light-gray": "#e6eeff",
      },
      keyframes: {
        stretch: {
          "0%,20%,100%": { width: "16px", transform: "scale(1)" },
          "10%": { transform: "scale(1.3)", width: "12px" },
        },
        stretch2: {
          "0%,10%,30%,100%": { width: "16px", transform: "scale(1)" },
          "20%": { transform: "scale(1.3)", width: "12px" },
        },
        stretch3: {
          "0%,20%,40%,100%": { width: "16px", transform: "scale(1)" },
          "30%": { transform: "scale(1.3)", width: "12px" },
        },
      },
      animation: {
        stretch: "stretch 1s ease-in-out infinite",
        stretch2: "stretch2 1s ease-in-out infinite",
        stretch3: "stretch3 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
