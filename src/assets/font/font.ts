export const responsiveSizes = {
  text: {
    small: "clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)", // 12px – 14px
    medium: "clamp(1rem, 0.9rem + 0.3vw, 1.125rem)", // 16px – 18px
    subtitle: "clamp(1.5rem, 1.3rem + 0.5vw, 2rem)", // 24px – 32px
    title: "clamp(2rem, 1.5rem + 1.5vw, 3rem)", // 32px – 48px
  },

  spacing: {
    extraSmall: "clamp(0.25rem, 0.2rem + 0.2vw, 0.5rem)", // 4px – 8px
    small: "clamp(0.5rem, 0.4rem + 0.3vw, 0.75rem)", // 8px – 12px
    medium: "clamp(1rem, 0.8rem + 0.5vw, 1.5rem)", // 16px – 24px
    large: "clamp(1.5rem, 1.2rem + 0.8vw, 2rem)", // 24px – 32px
    extraLarge: "clamp(2rem, 1.5rem + 1vw, 3rem)", // 32px – 48px
  },
};