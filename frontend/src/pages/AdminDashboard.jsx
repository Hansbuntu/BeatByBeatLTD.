import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api.js'
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card.jsx'

export default function AdminDashboard() {
	const [stats, setStats] = useState({ posts: 0, artists: 0, featured: 0 })
	const [notice, setNotice] = useState('')
	const [err, setErr] = useState('')

	useEffect(() => {
		;(async () => {
			try {
				const [postsRes, artistsRes, featuredRes] = await Promise.all([
					apiGet('/api/posts?limit=1'),
					apiGet('/api/artists'),
					apiGet('/api/posts?featured=true&limit=1'),
				])
				setStats({
					posts: postsRes.total || 0,
					artists: Array.isArray(artistsRes) ? artistsRes.length : 0,
					featured: featuredRes.total || 0,
				})
			} catch {}
		})()
	}, [])

	return (
		<div className="max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Admin Dashboard</h1>
			{notice && <div className="mb-4 text-green-700">{notice}</div>}
			{err && <div className="mb-4 text-red-600">{err}</div>}
			
			<div className="grid md:grid-cols-3 gap-6 mb-8">
				<Card>
					<CardContent className="p-6">
						<div className="text-3xl font-bold text-black dark:text-white">{stats.posts}</div>
						<div className="text-black dark:text-white opacity-70 mt-1">Total Posts</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="text-3xl font-bold text-black dark:text-white">{stats.artists}</div>
						<div className="text-black dark:text-white opacity-70 mt-1">Artists</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="text-3xl font-bold text-black dark:text-white">{stats.featured}</div>
						<div className="text-black dark:text-white opacity-70 mt-1">Featured Posts</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<Link to="/admin/posts" className="block w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg border-2 border-black dark:border-white hover:opacity-90 transition text-center font-medium">
								Manage Posts
							</Link>
							<Link to="/admin/artists" className="block w-full px-4 py-3 border-2 border-black dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-center font-medium text-black dark:text-white">
								Manage Artists
							</Link>
							<Link to="/admin/products" className="block w-full px-4 py-3 border-2 border-black dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-center font-medium text-black dark:text-white">
								Manage Products
							</Link>
							<Link to="/admin/orders" className="block w-full px-4 py-3 border-2 border-black dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-center font-medium text-black dark:text-white">
								View Orders
							</Link>
							<button
								onClick={async ()=>{
									try {
										const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
										await fetch(`${base}/api/admin/seed-demo`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
										setNotice('Demo content seeded. Refresh pages to view.')
										setErr('')
									} catch (e) {
										setErr('Failed to seed demo')
									}
								}}
								className="block w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg border-2 border-black dark:border-white hover:opacity-90 transition text-center font-bold"
							>
								Seed Demo Data
							</button>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Navigation</CardTitle>
					</CardHeader>
					<CardContent>
						<nav className="space-y-2">
							<Link to="/admin/posts" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition text-black dark:text-white">📝 Posts Management</Link>
							<Link to="/admin/artists" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition text-black dark:text-white">👤 Artists Management</Link>
						</nav>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

