import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiGet } from '../lib/api.js'
import { Card, CardContent } from '../components/ui/Card.jsx'

export default function ArtistDetail() {
	const { slug } = useParams()
	const [artist, setArtist] = useState(null)
	const [posts, setPosts] = useState([])
	const [products, setProducts] = useState([])
	const [activeTab, setActiveTab] = useState('posts')
	
	useEffect(()=>{
		apiGet(`/api/artists/${slug}`).then(setArtist).catch(()=>{})
	}, [slug])
	
	useEffect(() => {
		if (artist?._id) {
			apiGet('/api/posts?limit=50').then(d => {
				setPosts(d.items.filter(p => p.artist?._id === artist._id || p.artist === artist._id))
			}).catch(()=>{})
			apiGet(`/api/products?artist=${artist._id}`).then(d => {
				setProducts(d.items || [])
			}).catch(()=>{})
		}
	}, [artist])
	
	if (!artist) return <div className="text-center py-12">Loading...</div>
	
	const tracks = posts.filter(p => p.audioUrl)
	
	return (
		<div className="max-w-4xl mx-auto">
			<header className="mb-8 border-4 border-black dark:border-white rounded-xl p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
				<div className="flex items-center gap-4 mb-4">
					{artist.avatarUrl && <img src={artist.avatarUrl} alt={artist.name} className="w-20 h-20 rounded-full border-2 border-black dark:border-white object-cover" />}
					<h1 className="text-4xl font-extrabold text-black dark:text-white">{artist.name}</h1>
				</div>
				{artist.bio && <p className="text-lg text-black dark:text-white opacity-80 whitespace-pre-line mb-6">{artist.bio}</p>}
				{artist.socials && (artist.socials.instagram || artist.socials.x || artist.socials.youtube || artist.socials.website) && (
					<div className="flex flex-wrap gap-4">
						{artist.socials.instagram && <a href={`https://instagram.com/${artist.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline hover:no-underline font-bold">Instagram</a>}
						{artist.socials.x && <a href={`https://x.com/${artist.socials.x}`} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline hover:no-underline font-bold">X</a>}
						{artist.socials.youtube && <a href={artist.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline hover:no-underline font-bold">YouTube</a>}
						{artist.socials.website && <a href={artist.socials.website} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline hover:no-underline font-bold">Website</a>}
					</div>
				)}
			</header>
			
			<div className="border-b-2 border-black dark:border-white mb-6">
				<div className="flex gap-4">
					<button onClick={() => setActiveTab('posts')} className={`py-2 px-4 font-bold ${activeTab === 'posts' ? 'border-b-4 border-black dark:border-white' : 'opacity-60'}`}>Posts ({posts.length})</button>
					<button onClick={() => setActiveTab('tracks')} className={`py-2 px-4 font-bold ${activeTab === 'tracks' ? 'border-b-4 border-black dark:border-white' : 'opacity-60'}`}>Tracks ({tracks.length})</button>
					<button onClick={() => setActiveTab('exclusives')} className={`py-2 px-4 font-bold ${activeTab === 'exclusives' ? 'border-b-4 border-black dark:border-white' : 'opacity-60'}`}>Exclusives ({products.length})</button>
				</div>
			</div>
			
			{activeTab === 'posts' && (
				<div className="grid md:grid-cols-2 gap-4">
					{posts.map(p => (
						<Card key={p._id} className="border-2 border-black dark:border-white hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition">
							<CardContent>
								{p.coverImageUrl && <img src={p.coverImageUrl} alt="" className="w-full h-32 object-cover rounded mb-2 border-2 border-black dark:border-white" />}
								<Link to={`/posts/${p.slug}`} className="text-lg font-bold text-black dark:text-white underline hover:no-underline block mb-2">{p.title}</Link>
								{p.excerpt && <p className="text-black dark:text-white opacity-80 text-sm mb-2">{p.excerpt}</p>}
							</CardContent>
						</Card>
					))}
				</div>
			)}
			
			{activeTab === 'tracks' && (
				<div className="grid md:grid-cols-2 gap-4">
					{tracks.map(p => (
						<Card key={p._id} className="border-2 border-black dark:border-white hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition">
							<CardContent>
								{p.coverImageUrl && <img src={p.coverImageUrl} alt="" className="w-full h-32 object-cover rounded mb-2 border-2 border-black dark:border-white" />}
								<Link to={`/posts/${p.slug}`} className="text-lg font-bold text-black dark:text-white underline hover:no-underline block mb-2">{p.title}</Link>
								<button onClick={() => {
									localStorage.setItem('nowPlaying', JSON.stringify({ src: p.audioUrl, title: p.title, artist: artist.name }))
									window.dispatchEvent(new CustomEvent('nowplaying'))
								}} className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded border-2 border-black dark:border-white hover:opacity-90 transition text-sm font-medium">▶ Play</button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
			
			{activeTab === 'exclusives' && (
				<div className="grid md:grid-cols-3 gap-4">
					{products.map(p => (
						<Card key={p._id} className="border-2 border-black dark:border-white hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition">
							<CardContent>
								{p.coverImageUrl && <Link to={`/store/${p.slug}`}><img src={p.coverImageUrl} alt="" className="w-full h-32 object-cover rounded mb-2 border-2 border-black dark:border-white" /></Link>}
								<Link to={`/store/${p.slug}`} className="text-lg font-bold text-black dark:text-white underline hover:no-underline block mb-2">{p.title}</Link>
								<div className="font-bold">₵{p?.price?.amount ?? 0}</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}


