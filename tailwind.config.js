export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },

      colors: {
        black: "var(--color-black)",
        white: "var(--color-white)",

        static: {
          white: "var(--color-static-white)",
        },

        neutral: {
          5: "var(--color-neutral-5)",
          10: "var(--color-neutral-10)",
          20: "var(--color-neutral-20)",
          30: "var(--color-neutral-30)",
          50: "var(--color-neutral-50)",
          70: "var(--color-neutral-70)",
          90: "var(--color-neutral-90)",
        },

        blue: {
          500: "var(--color-blue-500)",
          600: "var(--color-blue-600)",
        },

        bg: {
          normal: "var(--color-bg-normal)",
          elevate: "var(--color-bg-elevate)",
        },

        text: {
          normal: "var(--color-text-normal)",
          strong: "var(--color-text-strong)",
        },

        border: {
          normal: "var(--color-border-normal)",
          light: "var(--color-border-light)",
        },
      },

      fontSize: {
        /* Display */
        "display-lg": ["56px", { lineHeight: "78px", fontWeight: "700" }],
        "display-sm": ["40px", { lineHeight: "60px", fontWeight: "700" }],

        /* Heading */
        "heading-xl": ["36px", { lineHeight: "46px", fontWeight: "600" }],
        "heading-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "heading-md": ["24px", { lineHeight: "30px", fontWeight: "600" }],
        "heading-sm": ["16px", { lineHeight: "22px", fontWeight: "600" }],

        /* Body */
        "body-lg": ["18px", { lineHeight: "26px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "25px", fontWeight: "400" }],
        "body-sm": ["15px", { lineHeight: "24px", fontWeight: "400" }],

        /* Label */
        "label-md": ["13px", { lineHeight: "18px", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
    },
  },
};
