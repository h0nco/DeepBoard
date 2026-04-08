import { useThemeStore } from '../store/themeStore';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { mode, setMode, actualTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [actualTheme]);

  const cycleMode = () => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  return (
    <button
      onClick={cycleMode}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={`Тема: ${mode === 'light' ? 'Светлая' : mode === 'dark' ? 'Тёмная' : 'Как в системе'}`}
    >
      {mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '🖥️'}
    </button>
  );
}