/**
 * PostCSS pipeline configuration for Tailwind and vendor prefixing.
 */
export default {
  plugins: {
    // Tailwind expands design tokens/utilities first; Autoprefixer follows for browser support.
    tailwindcss: {},
    autoprefixer: {},
  },
}
