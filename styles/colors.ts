// Color Tokens for LovingPaws App
export const colors = {
  // Main Brand Colors
  main: {
    deepBlueGray: '#2B3440',    // Main: Deep Blue-Gray
    softPeriwinkle: '#C8D3E8',  // Soft Periwinkle
    warmOffWhite: '#F8F6F3',    // Warm Off-White
    dustyBlue: '#8FA5C0',       // Dusty Blue
    gentleLavenderGray: '#D6D0DB', // Gentle Lavender-Gray
    warning: '#FF0000', // Red
  },

  // Primary Colors (based on Deep Blue-Gray)
  primary: {
    50: '#F8F6F3',   // Warm Off-White
    100: '#F0F2F5',
    200: '#E2E8F0',
    300: '#C8D3E8',  // Soft Periwinkle
    400: '#8FA5C0',  // Dusty Blue
    500: '#6B7A8F',
    600: '#5A6B7F',
    700: '#4A5A6F',
    800: '#3A495F',
    900: '#2B3440',  // Deep Blue-Gray
  },

  // Secondary Colors (based on Soft Periwinkle)
  secondary: {
    50: '#F8F6F3',   // Warm Off-White
    100: '#F0F2F5',
    200: '#E8EDF5',
    300: '#D6D0DB',  // Gentle Lavender-Gray
    400: '#C8D3E8',  // Soft Periwinkle
    500: '#B8C5D8',
    600: '#A8B7C8',
    700: '#98A9B8',
    800: '#889BA8',
    900: '#788D98',
  },

  // Accent Colors (based on your palette)
  accent: {
    periwinkle: {
      50: '#F8F6F3',   // Warm Off-White
      100: '#F0F2F5',
      200: '#E8EDF5',
      300: '#D6D0DB',  // Gentle Lavender-Gray
      400: '#C8D3E8',  // Soft Periwinkle
      500: '#B8C5D8',
      600: '#A8B7C8',
      700: '#98A9B8',
      800: '#889BA8',
      900: '#788D98',
    },
    dusty: {
      50: '#F8F6F3',   // Warm Off-White
      100: '#F0F2F5',
      200: '#E8EDF5',
      300: '#C8D3E8',  // Soft Periwinkle
      400: '#8FA5C0',  // Dusty Blue
      500: '#7A8FA8',
      600: '#657990',
      700: '#506378',
      800: '#3B4D60',
      900: '#2B3440',  // Deep Blue-Gray
    },
    lavender: {
      50: '#F8F6F3',   // Warm Off-White
      100: '#F5F3F7',
      200: '#EDEAF2',
      300: '#D6D0DB',  // Gentle Lavender-Gray
      400: '#C8C0D0',
      500: '#BAB0C5',
      600: '#ACA0BA',
      700: '#9E90AF',
      800: '#9080A4',
      900: '#827099',
    },
    yellow: '#FCD34D',  // For star ratings
  },

  // Neutral Colors (based on your palette)
  neutral: {
    50: '#F8F6F3',   // Warm Off-White
    100: '#F0F2F5',
    200: '#E8EDF5',
    300: '#D6D0DB',  // Gentle Lavender-Gray
    400: '#C8D3E8',  // Soft Periwinkle
    500: '#8FA5C0',  // Dusty Blue
    600: '#6B7A8F',
    700: '#5A6B7F',
    800: '#4A5A6F',
    900: '#2B3440',  // Deep Blue-Gray
  },

  // Semantic Colors (adapted to your palette)
  semantic: {
    success: '#8FA5C0',  // Dusty Blue
    warning: '#C8D3E8',  // Soft Periwinkle
    error: '#D6D0DB',    // Gentle Lavender-Gray (softer error)
    info: '#2B3440',     // Deep Blue-Gray
  },

  // Background Colors
  background: {
    primary: '#F8F6F3',   // Warm Off-White
    secondary: '#FFFFFF', // White
    tertiary: '#D6D0DB', // Gentle Lavender-Gray
    quaternary: '#8FA5C0', // Dusty Blue
  },
  // Text Colors
  text: {
    primary: '#2B3440',   // Deep Blue-Gray
    secondary: '#8FA5C0', // Dusty Blue
    tertiary: '#C8D3E8',  // Soft Periwinkle
    inverse: '#F8F6F3',   // Warm Off-White
  },

  // Border Colors
  border: {
    light: '#F0F2F5',
    medium: '#D6D0DB',    // Gentle Lavender-Gray
    dark: '#2B3440',     // Deep Blue-Gray
  },

  // Shadow Colors (adapted to your palette)
  shadow: {
    light: 'rgba(43, 52, 64, 0.05)',   // Deep Blue-Gray with opacity
    medium: 'rgba(43, 52, 64, 0.1)',
    dark: 'rgba(43, 52, 64, 0.2)',
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(248, 246, 243, 0.2)',  // Warm Off-White with opacity
    medium: 'rgba(248, 246, 243, 0.3)',
    dark: 'rgba(43, 52, 64, 0.5)',      // Deep Blue-Gray with opacity
  },
} as const;

// Type exports for better TypeScript support
export type ColorToken = typeof colors; 