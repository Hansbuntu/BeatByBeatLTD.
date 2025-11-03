import React from 'react'
import { NavLink } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function MobileHeader() {
	const { isAuthenticated, logout } = useAuth()
	const [open, setOpen] = React.useState(false)
	return (
		<div className="md:hidden">
			<div className="flex items-center gap-2">
				<ThemeToggle />
				<button onClick={() => setOpen(!open)} className="p-2 border-2 border-black dark:border-white rounded-lg bg-white dark:bg-black text-black dark:text-white">
					{open ? '✕' : '☰'}
				</button>
			</div>
			{open && (
				<div className="border-t-2 border-black dark:border-white px-4 py-3 bg-white dark:bg-black">
					<div className="mb-3"><SearchBar /></div>
					<nav className="flex flex-col gap-3">
						<NavLink to="/posts" onClick={()=>setOpen(false)} className="text-gray-700 dark:text-gray-300">Blog</NavLink>
						<NavLink to="/artists" onClick={()=>setOpen(false)} className="text-gray-700 dark:text-gray-300">Artists</NavLink>
						{isAuthenticated ? (
							<>
								<NavLink to="/admin" onClick={()=>setOpen(false)} className="text-gray-700 dark:text-gray-300">Admin</NavLink>
								<button onClick={()=>{ setOpen(false); logout(); }} className="text-left text-gray-700 dark:text-gray-300">Logout</button>
							</>
						) : (
							<NavLink to="/login" onClick={()=>setOpen(false)} className="text-gray-700 dark:text-gray-300">Login</NavLink>
						)}
					</nav>
				</div>
			)}
		</div>
	)
}


