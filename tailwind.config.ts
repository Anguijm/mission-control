import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-orange": "var(--brand-orange)",
        "brand-blue": "var(--brand-blue)",
        "brand-green": "var(--brand-green)",
        "brand-red": "var(--brand-red)",
      },
      backgroundColor: {
        sidebar: "var(--bg-sidebar)",
        page: "var(--bg-page)",
        card: "var(--bg-card)",
        hover: "var(--bg-hover)",
        elevated: "var(--bg-elevated)",
      },
      textColor: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        disabled: "var(--text-disabled)",
      },
    },
  },
  plugins: [],
};

export default config;
