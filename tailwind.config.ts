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
        "base-color": "#1A1A1D" /* Deep charcoal */,
        "primary-color": "#2C2C30" /* Lighter charcoal */,
        "secondary-color": "#F15946" /* Coral accent */,
        "text-primary": "#FFFFFF" /* White text */,
      },
    },
  },
  plugins: [],
};
export default config;
