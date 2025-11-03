import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { apiGet } from '../lib/api.js'
import { Card, CardContent } from '../components/ui/Card.jsx'

export default function PostDetail() {
	const { slug } = useParams()
	const [post, setPost] = useState(null)
	const [relatedPosts, setRelatedPosts] = useState([])

	useEffect(() => {
		apiGet(`/api/posts/${slug}`).then(async (p) => {
			setPost(p)
			// Get related posts (same tags or artist)
			const { items } = await apiGet('/api/posts?limit=10')
			const related = items.filter(item => 
				item._id !== p._id && 
				(item.tags?.some(tag => p.tags?.includes(tag)) || item.artist?._id === p.artist?._id)
			).slice(0, 3)
			setRelatedPosts(related)
		}).catch(() => {})
	}, [slug])

	function shareToTwitter() {
		const url = window.location.href
		const text = encodeURIComponent(post.title)
		window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
	}

	function shareToFacebook() {
		const url = window.location.href
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
	}

	function copyLink() {
		navigator.clipboard.writeText(window.location.href)
		alert('Link copied!')
	}

	if (!post) return <div className="text-center py-12">Loading...</div>

	return (
		<div className="max-w-4xl mx-auto">
			<nav className="mb-4 text-sm text-black dark:text-white opacity-80">
				<Link to="/" className="hover:text-black dark:text-white">Home</Link>
				<span className="mx-2">/</span>
				<Link to="/posts" className="hover:text-black dark:text-white">Blog</Link>
				<span className="mx-2">/</span>
				<span className="text-black dark:text-white">{post.title}</span>
			</nav>

			<article>
				{post.coverImageUrl && (
					<div className="mb-8 border-4 border-black dark:border-white rounded-xl overflow-hidden shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
						<img src={post.coverImageUrl} alt="cover" className="w-full h-96 object-cover" />
					</div>
				)}
				
				<header className="mb-8">
					<h1 className="text-4xl font-extrabold mb-3 text-black dark:text-white">{post.title}</h1>
					<div className="flex items-center gap-4 text-sm text-black dark:text-white opacity-80 mb-4">
						<span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
						{post.artist?.name && (
							<>
								<span>•</span>
								<Link to={`/artists/${post.artist.slug}`} className="hover:text-black dark:text-white font-bold">{post.artist.name}</Link>
							</>
						)}
					</div>
					{post.excerpt && <p className="text-xl text-black dark:text-white opacity-80 mb-4 font-medium">{post.excerpt}</p>}
					{!post.audioUrl && post.externalLink && (
						<div className="mb-4">
							{post.externalPlatform === 'soundcloud' && (
								<iframe
									title="SoundCloud Player"
									width="100%"
									height="166"
									scrolling="no"
									frameBorder="no"
									src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(post.externalLink)}&color=%23000000&inverse=false&auto_play=false&show_user=true`}
								/>
							)}
							{post.externalPlatform === 'youtube' && (
								<div className="aspect-video">
									<iframe
										title="YouTube Player"
										width="100%"
										height="100%"
										src={`https://www.youtube.com/embed/${extractYouTubeId(post.externalLink)}`}
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										allowFullScreen
									/>
								</div>
							)}
							{post.externalPlatform === 'spotify' && (
								<iframe
									title="Spotify Player"
									style={{ borderRadius: '12px' }}
									src={`https://open.spotify.com/embed/track/${extractSpotifyId(post.externalLink)}?utm_source=generator`}
									width="100%"
									height="152"
									frameBorder="0"
									allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
									loading="lazy"
								/>
							)}
						</div>
					)}
					{post.tags && post.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-4">
							{post.tags.map(tag => (
								<span key={tag} className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white text-sm rounded font-bold uppercase tracking-wide">{tag}</span>
							))}
						</div>
					)}
					<div className="flex flex-wrap gap-3 mb-4">
						{post.audioUrl && (
							<button
								className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg border-2 border-black dark:border-white hover:opacity-90 transition font-bold flex items-center gap-2"
								onClick={() => {
									localStorage.setItem('nowPlaying', JSON.stringify({ src: post.audioUrl, title: post.title, artist: post?.artist?.name || '' }))
									window.dispatchEvent(new CustomEvent('nowplaying'))
								}}
							>
								▶ Play in Mini-Player
							</button>
						)}
						<button onClick={shareToTwitter} className="px-4 py-2 border-2 border-black dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-black dark:text-white font-bold">Share on Twitter</button>
						<button onClick={shareToFacebook} className="px-4 py-2 border-2 border-black dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-black dark:text-white font-bold">Share on Facebook</button>
						<button onClick={copyLink} className="px-4 py-2 border-2 border-black dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-black dark:text-white font-bold">Copy Link</button>
					</div>
				</header>
				<div className="prose prose-lg max-w-none mb-12">
					<ReactMarkdown>{post.contentMd || ''}</ReactMarkdown>
				</div>
			</article>

			{relatedPosts.length > 0 && (
				<section className="mt-12 border-t-2 border-black dark:border-white pt-8">
					<h2 className="text-2xl font-extrabold mb-6">Related Posts</h2>
					<div className="grid md:grid-cols-3 gap-4">
						{relatedPosts.map(p => (
							<Card key={p._id} className="border-2 border-black dark:border-white hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition">
								<CardContent>
									{p.coverImageUrl && <img src={p.coverImageUrl} alt="" className="w-full h-32 object-cover rounded mb-2 border-2 border-black dark:border-white" />}
									<Link to={`/posts/${p.slug}`} className="font-bold text-black dark:text-white underline hover:no-underline block mb-1">
										{p.title}
									</Link>
									{p.excerpt && <p className="text-sm text-black dark:text-white opacity-80 line-clamp-2">{p.excerpt}</p>}
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			)}
		</div>
	)
}

function extractYouTubeId(link) {
  try {
    const url = new URL(link)
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1)
    if (url.searchParams.get('v')) return url.searchParams.get('v')
    const parts = url.pathname.split('/');
    const embedIdx = parts.indexOf('embed');
    if (embedIdx !== -1 && parts[embedIdx+1]) return parts[embedIdx+1]
  } catch {}
  return ''
}

function extractSpotifyId(link) {
  try {
    const url = new URL(link)
    const parts = url.pathname.split('/')
    return parts[parts.length - 1] || ''
  } catch {}
  return ''
}


