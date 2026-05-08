export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },

      colors: {
        black: "var(--color-common-100)",
        white: "var(--color-common-0)",

        /* ── Primitive ── */
        neutral: {
          5: "var(--color-neutral-5)",
          10: "var(--color-neutral-10)",
          15: "var(--color-neutral-15)",
          20: "var(--color-neutral-20)",
          25: "var(--color-neutral-25)",
          30: "var(--color-neutral-30)",
          40: "var(--color-neutral-40)",
          50: "var(--color-neutral-50)",
          70: "var(--color-neutral-70)",
          80: "var(--color-neutral-80)",
          90: "var(--color-neutral-90)",
        },

        blue: {
          10: "var(--color-blue-10)",
          500: "var(--color-blue-500)",
          600: "var(--color-blue-600)",
          700: "var(--color-blue-700)",
        },

        red: {
          50: "var(--color-red-50)",
          500: "var(--color-red-500)",
        },

        orange: {
          50: "var(--color-orange-50)",
          400: "var(--color-orange-400)",
          500: "var(--color-orange-500)",
        },

        yellow: {
          50: "var(--color-yellow-50)",
          500: "var(--color-yellow-500)",
        },

        mint: {
          50: "var(--color-mint-50)",
          500: "var(--color-mint-500)",
        },

        "light-blue": {
          500: "var(--color-light-blue-500)",
        },

        violet: {
          50: "var(--color-violet-50)",
          500: "var(--color-violet-500)",
        },

        pink: {
          50: "var(--color-pink-50)",
          500: "var(--color-pink-500)",
        },

        /* ── Semantic ── */
        static: {
          white: "var(--color-static-white)",
          black: "var(--color-static-black)",
        },

        bg: {
          color: "var(--color-bg-color)",
          normal: "var(--color-bg-normal)",
          elevate: "var(--color-bg-elevate)",
          dark: "var(--color-bg-dark)",
          "opacity-light40": "var(--color-bg-opacity-light40)",
          "opacity-light95": "var(--color-bg-opacity-light95)",
        },

        primary: {
          light: "var(--color-primary-light)",
          normal: "var(--color-primary-normal)",
          strong: "var(--color-primary-strong)",
          heavy: "var(--color-primary-heavy)",
        },

        text: {
          primary: "var(--color-text-primary)",
          normal: "var(--color-text-normal)",
          strong: "var(--color-text-strong)",
          sub: "var(--color-text-sub)",
          light: "var(--color-text-light)",
          disabled: "var(--color-text-disabled)",
        },

        fill: {
          dark70: "var(--color-fill-dark70)",
          dark80: "var(--color-fill-dark80)",
          light0: "var(--color-fill-light0)",
          light10: "var(--color-fill-light10)",
          normal25: "var(--color-fill-normal25)",
          primary: "var(--color-fill-primary)",
          grey: "var(--color-fill-grey)",
        },

        line: {
          normal: "var(--color-line-normal)",
          light: "var(--color-line-light)",
          sub: "var(--color-line-sub)",
          strong: "var(--color-line-strong)",
          disabled: "var(--color-line-disabled)",
        },

        border: {
          light: "var(--color-border-light)",
          normal: "var(--color-border-normal)",
          strong: "var(--color-border-strong)",
        },

        element: {
          normal: {
            red: "var(--color-element-normal-red)",
            orange: "var(--color-element-normal-orange)",
            yellow: "var(--color-element-normal-yellow)",
            mint: "var(--color-element-normal-mint)",
            blue: "var(--color-element-normal-blue)",
            violet: "var(--color-element-normal-violet)",
            pink: "var(--color-element-normal-pink)",
          },
          light: {
            red: "var(--color-element-light-red)",
            orange: "var(--color-element-light-orange)",
            yellow: "var(--color-element-light-yellow)",
            mint: "var(--color-element-light-mint)",
            blue: "var(--color-element-light-blue)",
            violet: "var(--color-element-light-violet)",
            pink: "var(--color-element-light-pink)",
          },
        },

        material: {
          dimmer: "var(--color-material-dimmer)",
        },

        status: {
          positive: "var(--color-status-positive)",
          negative: "var(--color-status-negative)",
          cautionary: "var(--color-status-cautionary)",
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
        "label-xl": ["15px", { lineHeight: "22px", fontWeight: "500" }],
        "label-lg": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "label-md": ["13px", { lineHeight: "18px", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
    },
  },
};
