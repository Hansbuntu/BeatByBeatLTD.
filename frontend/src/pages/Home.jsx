import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api.js'
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card.jsx'

export default function Home() {
	const [latest, setLatest] = useState([])
	const [tracks, setTracks] = useState([])
	const [err, setErr] = useState('')

	useEffect(() => {
		;(async () => {
			try {
				// Get featured post first
				const f = await apiGet('/api/posts?featured=true&limit=1')
				const { items } = await apiGet('/api/posts?limit=10')
				const allPosts = [...items]
				if (f.items?.length) {
					const featuredPost = f.items[0]
					setLatest([featuredPost, ...allPosts.filter(p => p._id !== featuredPost._id).slice(0, 5)])
				} else {
					setLatest(allPosts.slice(0, 6))
				}
				setTracks(allPosts.filter(p => p.audioUrl))
			} catch (e) {
				setErr('Failed to load posts')
			}
		})()
	}, [])

	const featured = latest[0]?.featured ? latest[0] : null

	return (
		<div className="space-y-10">
			{featured && (
				<section className="relative rounded-xl overflow-hidden border-4 border-black dark:border-white shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
					{featured.coverImageUrl ? (
						<div className="relative h-96 bg-black dark:bg-white">
							<img src={featured.coverImageUrl} alt={featured.title} className="w-full h-full object-cover opacity-70 dark:opacity-30" />
							<div className="absolute inset-0 flex items-center">
								<div className="max-w-3xl px-8 text-white dark:text-black">
									<h2 className="text-sm uppercase tracking-wider mb-2 opacity-80">Featured Post</h2>
									<Link to={`/posts/${featured.slug}`} className="text-3xl font-bold mb-3 block hover:underline">{featured.title}</Link>
									<p className="opacity-90 mb-4">{featured.excerpt || ''}</p>
									<Link to={`/posts/${featured.slug}`} className="inline-block px-4 py-2 bg-white text-black dark:bg-black dark:text-white rounded border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium">Read More</Link>
								</div>
							</div>
						</div>
					) : (
						<div className="bg-black dark:bg-white text-white dark:text-black p-8 border-4 border-black dark:border-white shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
							<div className="max-w-3xl">
								<h2 className="text-sm uppercase tracking-wider mb-2 opacity-80">Featured Post</h2>
								<Link to={`/posts/${featured.slug}`} className="text-3xl font-bold mb-3 block hover:underline">{featured.title}</Link>
								<p className="opacity-90 mb-4">{featured.excerpt || ''}</p>
								<Link to={`/posts/${featured.slug}`} className="inline-block px-4 py-2 bg-white text-black dark:bg-black dark:text-white rounded border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium">Read More</Link>
							</div>
						</div>
					)}
				</section>
			)}

			<div className="grid md:grid-cols-2 gap-8">
				<Card>
					<CardHeader>
						<CardTitle className="text-black dark:text-white">Latest Posts</CardTitle>
					</CardHeader>
					<CardContent>
						{err && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{err}</div>}
						{latest.length === 0 ? (
							<p className="text-black dark:text-white opacity-70">No posts yet.</p>
						) : (
							<>
								<ul className="space-y-3">
									{latest.slice(0, 5).map(p => (
										<li key={p._id}>
											<Link className="text-black dark:text-white underline hover:no-underline hover:underline font-medium" to={`/posts/${p.slug}`}>{p.title}</Link>
											{p.excerpt && <p className="text-sm text-black dark:text-white opacity-80 mt-1">{p.excerpt}</p>}
										</li>
									))}
								</ul>
								<Link to="/posts" className="mt-4 inline-block text-black dark:text-white underline hover:no-underline text-sm font-medium">View All Posts →</Link>
							</>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-black dark:text-white">Featured Tracks</CardTitle>
					</CardHeader>
					<CardContent>
						{tracks.length === 0 ? (
							<p className="text-black dark:text-white opacity-70">No audio tracks yet.</p>
						) : (
							<ul className="space-y-3">
								{tracks.map(p => (
									<li key={p._id} className="flex items-center gap-3">
										<button
											className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded border-2 border-black dark:border-white hover:opacity-90 transition text-sm font-medium"
											onClick={() => {
												localStorage.setItem('nowPlaying', JSON.stringify({ src: p.audioUrl, title: p.title, artist: p?.artist?.name || '' }))
												window.dispatchEvent(new CustomEvent('nowplaying'))
											}}
										>
											▶ Play
										</button>
										<div className="flex-1">
											<Link className="text-black dark:text-white underline hover:no-underline hover:underline font-medium" to={`/posts/${p.slug}`}>{p.title}</Link>
											{p.artist?.name && <p className="text-sm text-black dark:text-white opacity-70">{p.artist.name}</p>}
										</div>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Exclusive strip */}
			<div className="border-4 border-black dark:border-white rounded-xl p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex items-center justify-between">
				<div>
					<h3 className="text-xl font-extrabold">Exclusive Drops</h3>
					<p className="opacity-80">Unique releases available only on <span className="font-extrabold uppercase tracking-wide">BeatByBeatRecordLtd</span></p>
				</div>
				<Link to="/store" className="px-4 py-2 border-2 border-black dark:border-white rounded-lg font-bold hover:opacity-80">Visit Store</Link>
			</div>
		</div>
	)
}


