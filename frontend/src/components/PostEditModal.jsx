import { useState, useEffect } from 'react'
import { apiPost, apiUpload } from '../lib/api.js'

export default function PostEditModal({ post, onClose, onSave, artists = [] }) {
	const [title, setTitle] = useState('')
	const [slug, setSlug] = useState('')
	const [excerpt, setExcerpt] = useState('')
	const [contentMd, setContentMd] = useState('')
	const [tags, setTags] = useState('')
	const [coverImageUrl, setCoverImageUrl] = useState('')
	const [audioUrl, setAudioUrl] = useState('')
	const [externalLink, setExternalLink] = useState('')
	const [externalPlatform, setExternalPlatform] = useState('')
	const [featured, setFeatured] = useState(false)
	const [artistId, setArtistId] = useState('')
	const [uploading, setUploading] = useState(false)
	const [previewUrl, setPreviewUrl] = useState('')
	const [extracting, setExtracting] = useState(false)

	useEffect(() => {
		if (post && Object.keys(post).length > 0) {
			setTitle(post.title || '')
			setSlug(post.slug || '')
			setExcerpt(post.excerpt || '')
			setContentMd(post.contentMd || '')
			setTags((post.tags || []).join(', '))
			setCoverImageUrl(post.coverImageUrl || '')
			setAudioUrl(post.audioUrl || '')
			setExternalLink(post.externalLink || '')
			setExternalPlatform(post.externalPlatform || '')
			setFeatured(post.featured || false)
			setArtistId(post.artist?._id || post.artist || '')
			setPreviewUrl(post.coverImageUrl || '')
		} else {
			// Reset for new post
			setTitle('')
			setSlug('')
			setExcerpt('')
			setContentMd('')
			setTags('')
			setCoverImageUrl('')
			setAudioUrl('')
			setExternalLink('')
			setExternalPlatform('')
			setFeatured(false)
			setArtistId('')
			setPreviewUrl('')
		}
	}, [post])

	async function handleExtractMetadata() {
		if (!externalLink.trim()) {
			alert('Please enter a music link (YouTube, Spotify, SoundCloud, or direct audio)')
			return
		}
		setExtracting(true)
		try {
			const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
			const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
			const res = await fetch(`${base}/api/posts/extract-metadata`, { method: 'POST', headers, body: JSON.stringify({ url: externalLink }) })
			const data = await res.json()
			if (data.error) {
				alert(data.error)
				return
			}
			if (data.thumbnailUrl) {
				setCoverImageUrl(data.thumbnailUrl)
				setPreviewUrl(data.thumbnailUrl)
			}
			if (data.audioUrl) setAudioUrl(data.audioUrl)
			setExternalPlatform(data.platform || 'other')
		} catch (e) {
			alert('Failed to extract metadata')
		}
		setExtracting(false)
	}

	async function handleImageUpload(e) {
		const file = e.target.files?.[0]
		if (!file) return
		setUploading(true)
		try {
			const { url } = await apiUpload('/api/uploads', file)
			setCoverImageUrl(url)
			setPreviewUrl(url)
		} catch (err) {
			alert('Image upload failed: ' + err.message)
		}
		setUploading(false)
	}

	async function handleAudioUpload(e) {
		const file = e.target.files?.[0]
		if (!file) return
		setUploading(true)
		try {
			const { url } = await apiUpload('/api/uploads', file)
			setAudioUrl(url)
		} catch (err) {
			alert('Audio upload failed: ' + err.message)
		}
		setUploading(false)
	}

	async function handleSave(e) {
		e.preventDefault()
		const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
		const body = {
			title,
			slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
			contentMd,
			excerpt,
			tags: tagArray,
			coverImageUrl,
			audioUrl,
			externalLink: externalLink || undefined,
			externalPlatform: externalPlatform || undefined,
			featured,
			artist: artistId || undefined,
		}
		await onSave(body)
	}

	// Always render (for create mode, post might be empty object)

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
			<div className="bg-white dark:bg-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-black dark:border-white">
				<div className="sticky top-0 bg-white dark:bg-black border-b-2 border-black dark:border-white p-4 flex justify-between items-center">
					<h2 className="text-xl font-bold text-black dark:text-white">{post && Object.keys(post).length > 0 ? 'Edit Post' : 'Create Post'}</h2>
					<button onClick={onClose} className="text-black dark:text-white hover:opacity-70">✕</button>
				</div>
				<form className="p-6 space-y-4" onSubmit={handleSave}>
					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1 text-black dark:text-white">Title *</label>
							<input className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black text-black dark:text-white" value={title} onChange={(e)=>setTitle(e.target.value)} required />
						</div>
						<div>
							<label className="block text-sm font-medium mb-1 text-black dark:text-white">Slug</label>
							<input className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black text-black dark:text-white" value={slug} onChange={(e)=>setSlug(e.target.value)} />
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-black dark:text-white">Excerpt</label>
						<input className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black text-black dark:text-white" value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} />
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-black dark:text-white">Artist</label>
						<select className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black text-black dark:text-white" value={artistId} onChange={(e)=>setArtistId(e.target.value)}>
							<option value="">None</option>
							{artists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-black dark:text-white">Tags (comma-separated)</label>
						<input className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black text-black dark:text-white" value={tags} onChange={(e)=>setTags(e.target.value)} />
					</div>
					<div>
				<label className="block text-sm font-medium mb-1 text-black dark:text-white">External Link (YouTube, Spotify, SoundCloud, or audio URL)</label>
				<div className="flex gap-2">
					<input className="flex-1 border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black text-black dark:text-white" value={externalLink} onChange={(e)=>setExternalLink(e.target.value)} placeholder="https://..." />
					<button type="button" onClick={handleExtractMetadata} disabled={extracting} className="px-4 py-2 border-2 border-black dark:border-white rounded-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">
						{extracting ? 'Extracting...' : 'Extract from URL'}
					</button>
				</div>
				{externalPlatform && <p className="mt-1 text-xs text-black dark:text-white opacity-70">Detected: {externalPlatform}</p>}
			</div>

			<div>
						<label className="block text-sm font-medium mb-1 text-black dark:text-white">Cover Image</label>
						<input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black text-black dark:text-white" disabled={uploading} />
						{previewUrl && <img src={previewUrl} alt="preview" className="mt-2 w-full h-40 object-cover rounded" />}
						{coverImageUrl && !previewUrl && <div className="mt-2 text-sm text-green-600 dark:text-green-400">✓ Uploaded</div>}
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-black dark:text-white">Audio File</label>
						<input type="file" accept="audio/*" onChange={handleAudioUpload} className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black text-black dark:text-white" disabled={uploading} />
						{audioUrl && <div className="mt-2 text-sm text-green-600 dark:text-green-400">✓ Uploaded: {audioUrl}</div>}
					</div>
					<div className="flex items-center gap-2">
						<input id="featured" type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} className="border-2 border-black dark:border-white" />
						<label htmlFor="featured" className="text-sm text-black dark:text-white">Featured</label>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-black dark:text-white">Content (Markdown) *</label>
						<textarea className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 h-64 font-mono text-sm bg-white dark:bg-black text-black dark:text-white" value={contentMd} onChange={(e)=>setContentMd(e.target.value)} required />
					</div>
					<div className="flex gap-3">
						<button type="submit" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg border-2 border-black dark:border-white hover:opacity-90 transition" disabled={uploading}>
							{uploading ? 'Uploading...' : 'Save'}
						</button>
						<button type="button" onClick={onClose} className="px-4 py-2 border-2 border-black dark:border-white rounded-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">Cancel</button>
					</div>
				</form>
			</div>
		</div>
	)
}

