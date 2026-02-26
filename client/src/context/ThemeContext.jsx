import { createContext, useState } from 'react';

// Create the context
export const ThemeContext = createContext();

// Theme definitions
const themes = {
  blue: {
    name: 'blue',
    // Gradients combining skyblue, ocean blue, jeans blue, navy, turquoise
    background: 'bg-gradient-to-br from-sky-200 via-cyan-300 to-blue-500',
    backgroundDark: 'bg-gradient-to-br from-blue-600 via-cyan-700 to-blue-900',
    card: 'bg-white',
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-cyan-500 hover:bg-cyan-600',
    accent: 'bg-sky-400 hover:bg-sky-500',
    text: 'text-blue-900',
    textLight: 'text-blue-600',
    border: 'border-blue-300',
    highlight: 'bg-blue-100',
    ring: 'focus:ring-blue-300',
    gradient: 'from-sky-400 via-blue-500 to-blue-700',
  },
  pink: {
    name: 'pink',
    // Gradients combining light pink, rose gold, magenta, bubble gum
    background: 'bg-gradient-to-br from-pink-200 via-rose-300 to-fuchsia-400',
    backgroundDark: 'bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600',
    card: 'bg-white',
    primary: 'bg-pink-500 hover:bg-pink-600',
    secondary: 'bg-rose-500 hover:bg-rose-600',
    accent: 'bg-fuchsia-500 hover:bg-fuchsia-600',
    text: 'text-pink-900',
    textLight: 'text-pink-600',
    border: 'border-pink-300',
    highlight: 'bg-pink-100',
    ring: 'focus:ring-pink-300',
    gradient: 'from-pink-300 via-rose-400 to-fuchsia-500',
  },
};

// ThemeProvider component
export default function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('blue');

  const theme = themes[currentTheme];

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'blue' ? 'pink' : 'blue'));
  };

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
  );
}
