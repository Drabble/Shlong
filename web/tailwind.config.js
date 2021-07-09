module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minHeight: {
        12: "3rem",
      },
      minWidth: {
        12: "3rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
