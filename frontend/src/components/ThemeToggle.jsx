import { useTheme } from '../hooks/useTheme.js'

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme()
	return (
		<button
			onClick={toggleTheme}
			className="px-3 py-1.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm font-medium"
			title="Toggle theme"
		>
			{theme === 'dark' ? '☀️' : '🌙'}
		</button>
	)
}


