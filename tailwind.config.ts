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
      colors: {
        // "base-color": "#0b0b0b",
        "base-color": "#18181B",
        // "primary-color": "#151515",
        "primary-color": "#27272A",
        "secondary-color": "#cecfce",
      },
    },
  },
  plugins: [],
};
export default config;
