import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(#eb4d4b,10px,transparent 10px)",
      },
      keyframes: {
        "pop-blob": {
          "0%": { transform: "scale(1)" },
          "33%": { transform: "scale(1.2)" },
          "66%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
      },
      colors: {
        filter: {
          "blur-20": "blur(20px)",
          "blur-25": "blur(25px)",
        },
      },
      animation: {
        "pop-blob": "pop-blob 5s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
