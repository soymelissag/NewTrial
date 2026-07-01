/** Parkette — Tailwind theme extension (v3)  ·  "June Colors" scheme
 *  Brand character: Abuela, recolored to the June palette.
 *  For v4, mirror these into @theme. Fonts: Fredoka + Nunito Sans. */
module.exports = {
  theme: {
    extend: {
      colors: {
        paper:  "#FDF8EC",
        masa:   "#F5E8D5",
        ink:    { DEFAULT: "#6B342A", deep: "#4E2319", muted: "#936A4E", faint: "#C3AE92" },
        hairline: "#EBDFC8",
        pink:   { DEFAULT: "#F8B1B9", deep: "#EF8FA0" }, // her lips
        sky:    { DEFAULT: "#9CCBED", deep: "#6FA8D4" },
        orange: { DEFAULT: "#F9A24A", deep: "#F1831E" }, // her halo
        yellow: { DEFAULT: "#F4C816", deep: "#E0B00A" },
        olive:  { DEFAULT: "#B1B735", deep: "#8F9520" }, // her dress
      },
      fontFamily: {
        display: ['"Fredoka"', "ui-rounded", "system-ui", "sans-serif"],
        text:    ['"Nunito Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        eyebrow: ["0.75rem", { letterSpacing: "0.22em", lineHeight: "1" }],
        hero: ["clamp(3.6rem, 2rem + 8vw, 8rem)",        { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        h1:   ["clamp(2.8rem, 1.8rem + 4.6vw, 4.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h2:   ["clamp(2rem, 1.4rem + 2.6vw, 3rem)",      { lineHeight: "1.1" }],
        h3:   ["clamp(1.4rem, 1.1rem + 1.2vw, 1.9rem)",  { lineHeight: "1.15" }],
      },
      borderRadius: { sm: "14px", DEFAULT: "20px", lg: "30px", xl: "44px", blob: "42% 58% 62% 38% / 46% 42% 58% 54%" },
      boxShadow: {
        sticker: "4px 4px 0 #6B342A", "sticker-lg": "6px 6px 0 #6B342A",
        "sticker-orange": "5px 5px 0 #F9A24A", soft: "0 10px 30px rgba(107,52,42,0.14)",
      },
      transitionTimingFunction: { bounce: "cubic-bezier(0.34,1.56,0.64,1)" },
    },
  },
};
