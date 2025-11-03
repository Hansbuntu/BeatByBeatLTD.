import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiGet } from '../lib/api.js'
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card.jsx'

export default function Posts() {
	const [items, setItems] = useState([])
	const [error, setError] = useState('')
	const [selectedTag, setSelectedTag] = useState('')
	const [tags, setTags] = useState([])
	const [sortBy, setSortBy] = useState('newest')
	const [currentPage, setCurrentPage] = useState(1)
	const [searchParams, setSearchParams] = useSearchParams()
	const searchQuery = searchParams.get('search') || ''

	const postsPerPage = 12

	useEffect(() => {
		apiGet('/api/posts?limit=100').then((d) => {
			setItems(d.items)
			const allTags = [...new Set(d.items.flatMap(p => p.tags || []))]
			setTags(allTags)
		}).catch(() => setError('Failed to load posts'))
	}, [])

	let filtered = items
	if (searchQuery) {
		filtered = filtered.filter(p => 
			p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.contentMd?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	}
	if (selectedTag) {
		filtered = filtered.filter(p => p.tags?.includes(selectedTag))
	}

	const sorted = [...filtered].sort((a, b) => {
		if (sortBy === 'newest') return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
		if (sortBy === 'oldest') return new Date(a.publishedAt || a.createdAt) - new Date(b.publishedAt || b.createdAt)
		if (sortBy === 'title') return a.title.localeCompare(b.title)
		return 0
	})

	const totalPages = Math.ceil(sorted.length / postsPerPage)
	const paginated = sorted.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Blog Posts</h1>
			
			{searchQuery && (
					<div className="mb-4 p-3 border-2 border-black dark:border-white rounded-lg bg-white dark:bg-black">
					<span className="text-sm">Search results for: <strong>{searchQuery}</strong></span>
					<button onClick={() => setSearchParams({})} className="ml-2 text-black dark:text-white underline hover:underline text-sm">Clear</button>
				</div>
			)}

			<div className="mb-6 flex flex-wrap gap-4 items-center">
				{tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setSelectedTag('')}
							className={`px-3 py-1.5 rounded text-sm transition ${selectedTag === '' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'}`}
						>
							All
						</button>
						{tags.map(tag => (
							<button
								key={tag}
								onClick={() => setSelectedTag(tag)}
								className={`px-3 py-1.5 rounded text-sm transition ${selectedTag === tag ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'}`}
							>
								{tag}
							</button>
						))}
					</div>
				)}
				<select className="border-2 border-black dark:border-white rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-black text-black dark:text-white" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
					<option value="newest">Newest First</option>
					<option value="oldest">Oldest First</option>
					<option value="title">Title A-Z</option>
				</select>
			</div>

			{error && <div className="text-red-600 dark:text-red-400 text-sm mb-4 p-3 border-2 border-red-600 dark:border-red-400 rounded bg-red-50 dark:bg-red-950">{error}</div>}
			{paginated.length === 0 ? (
				<Card>
					<CardContent>
						<p className="text-black dark:text-white opacity-70">No posts found.</p>
					</CardContent>
				</Card>
			) : (
				<>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
						{paginated.map(p => (
							<Card key={p._id} className="hover:shadow-lg transition">
								<CardHeader>
									<CardTitle>
										<Link to={`/posts/${p.slug}`} className="hover:text-black dark:text-white underline transition">{p.title}</Link>
									</CardTitle>
								</CardHeader>
								<CardContent>
									{p.coverImageUrl && (
										<img src={p.coverImageUrl} alt="cover" className="w-full h-40 object-cover rounded mb-3" />
									)}
									<p className="text-xs text-black dark:text-white opacity-70 mb-2">{new Date(p.publishedAt || p.createdAt).toLocaleDateString()}</p>
									{p.excerpt && <p className="text-black dark:text-white opacity-80 mb-3 text-sm">{p.excerpt}</p>}
									{p.tags && p.tags.length > 0 && (
										<div className="flex flex-wrap gap-1 mb-3">
											{p.tags.map(tag => (
												<span key={tag} className="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white text-xs rounded">{tag}</span>
											))}
										</div>
									)}
									<Link to={`/posts/${p.slug}`} className="text-black dark:text-white underline hover:no-underline text-sm font-medium">Read more →</Link>
								</CardContent>
							</Card>
						))}
					</div>
					{totalPages > 1 && (
						<div className="flex justify-center gap-2">
							<button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 border-2 border-black dark:border-white rounded text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition">
								Previous
							</button>
							<span className="px-3 py-2 text-black dark:text-white">Page {currentPage} of {totalPages}</span>
							<button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 border-2 border-black dark:border-white rounded text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition">
								Next
							</button>
						</div>
					)}
				</>
			)}
		</div>
	)
}


