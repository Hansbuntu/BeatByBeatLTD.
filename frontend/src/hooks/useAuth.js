import { useState, useEffect } from 'react'

export function useAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		const token = localStorage.getItem('token')
		setIsAuthenticated(!!token)
	}, [])

	function logout() {
		localStorage.removeItem('token')
		setIsAuthenticated(false)
		window.location.href = '/login'
	}

	return { isAuthenticated, logout }
}
