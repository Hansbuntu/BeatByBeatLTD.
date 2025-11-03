import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiPost, apiUpload, apiGet } from '../lib/api.js'
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card.jsx'
import PostEditModal from '../components/PostEditModal.jsx'

export default function AdminPosts() {
	const [posts, setPosts] = useState([])
	const [artists, setArtists] = useState([])
	const [editingPost, setEditingPost] = useState(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState('custom')
	const [showCreateModal, setShowCreateModal] = useState(false)

	async function loadPosts() {
		try {
			const { items } = await apiGet('/api/posts?limit=100')
			setPosts(items)
		} catch {}
	}

	async function loadArtists() {
		try {
			const data = await apiGet('/api/artists')
			setArtists(Array.isArray(data) ? data : [])
		} catch {}
	}

	useEffect(() => {
		loadPosts()
		loadArtists()
	}, [])

	async function handleSave(body) {
		try {
			const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
			const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
			if (editingPost?._id) {
				const res = await fetch(`${base}/api/posts/${editingPost._id}`, { method: 'PUT', headers, body: JSON.stringify(body) })
				if (!res.ok) throw new Error(`Failed to update: ${res.status}`)
			} else {
				await apiPost('/api/posts', body)
			}
			await loadPosts()
			setEditingPost(null)
			setShowCreateModal(false)
		} catch (e) {
			alert('Save failed: ' + e.message)
		}
	}

	async function handleDelete(id) {
		if (!confirm('Delete this post?')) return
		const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
		await fetch(`${base}/api/posts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
		loadPosts()
	}

	const filtered = posts.filter(p => 
		p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const sorted = [...filtered].sort((a, b) => {
		if (sortBy === 'custom') return (a.order || 0) - (b.order || 0)
		if (sortBy === 'newest') return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
		if (sortBy === 'oldest') return new Date(a.publishedAt || a.createdAt) - new Date(b.publishedAt || b.createdAt)
		if (sortBy === 'title') return a.title.localeCompare(b.title)
		return 0
	})

	async function handleReorder(postId, direction) {
		const currentIndex = sorted.findIndex(p => p._id === postId)
		if (direction === 'up' && currentIndex === 0) return
		if (direction === 'down' && currentIndex === sorted.length - 1) return
		const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
		const updates = [
			{ id: sorted[currentIndex]._id, order: targetIndex },
			{ id: sorted[targetIndex]._id, order: currentIndex },
		]
		const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
		await fetch(`${base}/api/posts/reorder`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
			body: JSON.stringify({ updates }),
		})
		loadPosts()
	}

	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-black dark:text-white">Posts Management</h1>
				<button onClick={() => { setEditingPost({}); setShowCreateModal(true) }} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg border-2 border-black dark:border-white hover:opacity-90 transition font-medium">
					+ Create Post
				</button>
			</div>

			<Card className="mb-6">
				<CardContent className="p-4">
					<div className="grid md:grid-cols-2 gap-4">
						<input
							type="text"
							placeholder="Search posts..."
							className="w-full border rounded-lg px-3 py-2"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<select className="border rounded-lg px-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
							<option value="custom">Custom Order</option>
							<option value="newest">Newest First</option>
							<option value="oldest">Oldest First</option>
							<option value="title">Title A-Z</option>
						</select>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Posts ({sorted.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{sorted.length === 0 ? (
						<p className="text-black dark:text-white opacity-70">No posts found.</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="text-left border-b border-black dark:border-white">
										{sortBy === 'custom' && <th className="py-2 w-20 text-black dark:text-white">Order</th>}
										<th className="py-2 text-black dark:text-white">Title</th>
										<th className="text-black dark:text-white">Date</th>
										<th className="text-black dark:text-white">Featured</th>
										<th className="text-black dark:text-white">Tags</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{sorted.map((p, idx) => (
										<tr key={p._id} className="border-b border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">
											{sortBy === 'custom' && (
												<td className="py-2">
													<div className="flex flex-col gap-1">
														<button
															onClick={() => handleReorder(p._id, 'up')}
															disabled={idx === 0}
															className="px-2 py-1 border-2 border-black dark:border-white rounded text-xs disabled:opacity-30 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
															title="Move up"
														>
															↑
														</button>
														<button
															onClick={() => handleReorder(p._id, 'down')}
															disabled={idx === sorted.length - 1}
															className="px-2 py-1 border-2 border-black dark:border-white rounded text-xs disabled:opacity-30 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
															title="Move down"
														>
															↓
														</button>
													</div>
												</td>
											)}
											<td className="py-2 text-black dark:text-white">
												<div className="font-medium">{p.title}</div>
												{p.coverImageUrl && <img src={p.coverImageUrl} alt="" className="w-16 h-16 object-cover rounded mt-1" />}
											</td>
											<td className="text-black dark:text-white">{new Date(p.publishedAt || p.createdAt).toLocaleDateString()}</td>
											<td className="text-black dark:text-white">{p.featured ? '⭐' : '-'}</td>
											<td><div className="flex flex-wrap gap-1">{p.tags?.slice(0, 2).map(t => <span key={t} className="px-1 bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white text-xs rounded">{t}</span>)}</div></td>
											<td className="text-right space-x-2">
												<button className="px-2 py-1 border-2 border-black dark:border-white rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xs text-black dark:text-white" onClick={() => { setEditingPost(p); setShowCreateModal(false) }}>
													Edit
												</button>
												<Link to={`/posts/${p.slug}`} target="_blank" className="px-2 py-1 border-2 border-black dark:border-white rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xs text-black dark:text-white">View</Link>
												<button className="px-2 py-1 border-2 border-black dark:border-white rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xs text-black dark:text-white" onClick={() => handleDelete(p._id)}>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>

			{(editingPost || showCreateModal) && (
				<PostEditModal
					post={editingPost || {}}
					onClose={() => { setEditingPost(null); setShowCreateModal(false) }}
					onSave={handleSave}
					artists={artists}
				/>
			)}
		</div>
	)
}

