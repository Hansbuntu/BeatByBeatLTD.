import { useEffect, useState } from 'react'

export function useTheme() {
	const [theme, setTheme] = useState(() => {
		if (typeof window === 'undefined') return 'light'
		const saved = localStorage.getItem('theme')
		if (saved === 'dark' || saved === 'light') return saved
		const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
		return prefersDark ? 'dark' : 'light'
	})

	useEffect(() => {
		const root = document.documentElement
		if (theme === 'dark') {
			root.classList.add('dark')
		} else {
			root.classList.remove('dark')
		}
		localStorage.setItem('theme', theme)
	}, [theme])

	function toggleTheme() {
		setTheme(prev => prev === 'dark' ? 'light' : 'dark')
	}

	return { theme, toggleTheme }
}


