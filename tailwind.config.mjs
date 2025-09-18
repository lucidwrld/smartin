/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },

    extend: {
      boxShadow: {
        "custom-shadow": "0px 4px 4px 0px #00000017",
      },
      fontSize: {
        "70px": "10px",
        "16px": "16px",
        "15px": "15px",
        "14px": "14px",
        "12px": "12px",
        "10px": "10px",
        "18px": "18px",
        "40px": "40px",
        "13px": "13px",
        "20px": "20px",
        "28px": "28px",
        "24px": "24px",
        "30px": "30px",
        "32px": "32px",
        "35px": "35px",
      },
      backgroundImage: {
        gradientMain: "linear-gradient(180deg, #AE69D8 0%, #FF8336 100%)",
        signin: "linear-gradient(105.43deg, #7308C3 -0.34%, #37045D 117.4%)",
      },
      colors: {
        whiteColor: "#FFFFFF",
        confiBlack: "#181918",
        brandBlack: "#000000",
        brandOrange: "#FE8235",
        brandPurple: "#8D0BF0",
        backgroundPurple: "#37045D",
        lightPurple: "#B24EFE",
        grey3: "#e8e8e8",
        success: "#0F973D",
        redColor: "#F10707",
        backgroundOrange: "#FFF2E9",
        lightGrey: "#D0D5DD",
        mainLightGrey: "#F1F1F1",
        dashboardBackground: "#F6F6F6",
        textGrey: "#645D5D",
        textGrey2: "#757575",
        textGrey3: "#393938",
        textGrey4: "#999796",
      },
    },
  },
  daisyui: {
    base: false,
    themes: ["light"],
  },
  plugins: [require("tailwind-scrollbar-hide"), require("daisyui")],
};
