import { useEffect, useState } from 'react'
import { apiPost, apiUpload, apiGet } from '../lib/api.js'
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card.jsx'

export default function Admin() {
	const [title, setTitle] = useState('')
	const [slug, setSlug] = useState('')
	const [excerpt, setExcerpt] = useState('')
	const [contentMd, setContentMd] = useState('')
	const [tags, setTags] = useState('')
	const [coverImageFile, setCoverImageFile] = useState(null)
	const [audioFile, setAudioFile] = useState(null)
	const [coverImageUrl, setCoverImageUrl] = useState('')
	const [audioUrl, setAudioUrl] = useState('')
	const [message, setMessage] = useState('')
	const [uploading, setUploading] = useState(false)
    const [posts, setPosts] = useState([])
    const [editingId, setEditingId] = useState('')
    const [featured, setFeatured] = useState(false)

    async function loadPosts() {
    	try {
    		const { items } = await apiGet('/api/posts?limit=100')
    		setPosts(items)
    	} catch {}
    }

    useEffect(()=>{ loadPosts() }, [])

	async function handleImageUpload(e) {
		const file = e.target.files?.[0]
		if (!file) return
		setCoverImageFile(file)
		setUploading(true)
		try {
			const { url } = await apiUpload('/api/uploads', file)
			setCoverImageUrl(url)
			setMessage('Image uploaded')
		} catch (e) {
			setMessage('Image upload failed')
		}
		setUploading(false)
	}

	async function handleAudioUpload(e) {
		const file = e.target.files?.[0]
		if (!file) return
		setAudioFile(file)
		setUploading(true)
		try {
			const { url } = await apiUpload('/api/uploads', file)
			setAudioUrl(url)
			setMessage('Audio uploaded')
		} catch (e) {
			setMessage('Audio upload failed')
		}
		setUploading(false)
	}

	async function createPost(e) {
		e.preventDefault()
		setMessage('')
		try {
			const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
			const body = {
				title,
				slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
				contentMd,
				excerpt,
				tags: tagArray,
				coverImageUrl,
				audioUrl,
				featured,
			}
			let post
			if (editingId) {
				post = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts/${editingId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
					body: JSON.stringify(body),
				}).then(r=>r.json())
			} else {
				post = await apiPost('/api/posts', body)
			}
			setMessage(`✅ ${editingId ? 'Updated' : 'Created'}: ${post.title}`)
			setTitle('')
			setSlug('')
			setExcerpt('')
			setContentMd('')
			setTags('')
			setCoverImageUrl('')
			setAudioUrl('')
			setCoverImageFile(null)
			setAudioFile(null)
			setEditingId('')
			setFeatured(false)
			loadPosts()
		} catch (e) {
			setMessage('❌ Create failed - check login and required fields')
		}
	}

	return (
		<div className="max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
			<Card>
				<CardHeader>
					<CardTitle>Create New Post</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={createPost}>
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-1">Title *</label>
								<input
									className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900"
									placeholder="Post Title"
									value={title}
									onChange={(e)=>setTitle(e.target.value)}
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Slug</label>
								<input
									className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900"
									placeholder="auto-generated"
									value={slug}
									onChange={(e)=>setSlug(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Excerpt</label>
							<input
								className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900"
								placeholder="Short description"
								value={excerpt}
								onChange={(e)=>setExcerpt(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
							<input
								className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900"
								placeholder="news, release, house"
								value={tags}
								onChange={(e)=>setTags(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Cover Image</label>
							<input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded-lg px-3 py-2" disabled={uploading} />
							{coverImageUrl && <div className="mt-2 text-sm text-green-600">✓ Uploaded: {coverImageUrl}</div>}
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Audio File</label>
							<input type="file" accept="audio/*" onChange={handleAudioUpload} className="w-full border rounded-lg px-3 py-2" disabled={uploading} />
							{audioUrl && <div className="mt-2 text-sm text-green-600">✓ Uploaded: {audioUrl}</div>}
						</div>
					<div className="flex items-center gap-2">
						<input id="featured" type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} />
						<label htmlFor="featured" className="text-sm">Featured</label>
					</div>
						<div>
							<label className="block text-sm font-medium mb-1">Content (Markdown) *</label>
							<textarea
								className="w-full border rounded-lg px-3 py-2 h-64 font-mono text-sm focus:ring-2 focus:ring-gray-900"
								placeholder="# Heading&#10;&#10;Content here..."
								value={contentMd}
								onChange={(e)=>setContentMd(e.target.value)}
								required
							/>
						</div>
						{message && <div className={`p-3 rounded ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}
						<button type="submit" className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 hover:bg-gray-800 transition font-medium" disabled={uploading}>
							{uploading ? 'Uploading...' : 'Create Post'}
						</button>
					</form>
				</CardContent>
		</Card>

		<Card className="mt-8">
			<CardHeader>
				<CardTitle>Existing Posts</CardTitle>
			</CardHeader>
			<CardContent>
				{posts.length === 0 ? (
					<p className="text-gray-500">No posts yet.</p>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left border-b">
								<th className="py-2">Title</th>
								<th>Slug</th>
								<th>Featured</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{posts.map(p => (
								<tr key={p._id} className="border-b">
									<td className="py-2">{p.title}</td>
									<td>{p.slug}</td>
									<td>{p.featured ? 'Yes' : 'No'}</td>
									<td className="text-right space-x-2">
										<button className="px-2 py-1 border rounded" onClick={() => {
											setEditingId(p._id)
											setTitle(p.title); setSlug(p.slug); setExcerpt(p.excerpt||''); setContentMd(p.contentMd||''); setTags((p.tags||[]).join(', ')); setCoverImageUrl(p.coverImageUrl||''); setAudioUrl(p.audioUrl||''); setFeatured(!!p.featured)
										}}>Edit</button>
										<button className="px-2 py-1 border rounded text-red-600" onClick={async ()=>{
											if (!confirm('Delete this post?')) return
											await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts/${p._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
											loadPosts()
										}}>Delete</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</CardContent>
		</Card>
		</div>
	)
}


