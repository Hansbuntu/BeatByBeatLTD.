import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function MobileMenu({ isOpen, onClose }) {
	const { isAuthenticated, logout } = useAuth()

	if (!isOpen) return null

	return (
		<>
			<div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
			<div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 lg:hidden transform transition-transform duration-300">
				<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
					<h2 className="font-bold text-lg">Menu</h2>
					<button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
						✕
					</button>
				</div>
				<nav className="flex flex-col p-4 space-y-2">
					<Link to="/posts" onClick={onClose} className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
						Blog
					</Link>
					<Link to="/artists" onClick={onClose} className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
						Artists
					</Link>
					{isAuthenticated ? (
						<>
							<Link to="/admin" onClick={onClose} className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
								Admin
							</Link>
							<button onClick={() => { logout(); onClose() }} className="px-4 py-2 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
								Logout
							</button>
						</>
					) : (
						<Link to="/login" onClick={onClose} className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
							Login
						</Link>
					)}
				</nav>
			</div>
		</>
	)
}
