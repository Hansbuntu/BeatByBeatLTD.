import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api.js'
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card.jsx'

export default function Artists() {
	const [items, setItems] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	useEffect(()=>{ apiGet('/api/artists').then(data => setItems(Array.isArray(data) ? data : [])).catch(()=>{}) }, [])

	const filtered = items.filter(a => 
		a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		a.bio?.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-extrabold text-black dark:text-white">Artists</h1>
				<input
					type="text"
					placeholder="Search artists..."
					className="border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black text-black dark:text-white w-64"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			{filtered.length === 0 ? (
				<Card>
					<CardContent>
						<p className="text-black dark:text-white opacity-70">No artists found.</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filtered.map(a => (
						<Card key={a._id} className="hover:shadow-lg transition">
							<CardHeader>
								<CardTitle>
									<Link to={`/artists/${a.slug}`} className="hover:text-black dark:text-white underline transition">{a.name}</Link>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{a.avatarUrl && <img src={a.avatarUrl} alt={a.name} className="w-full h-40 object-cover rounded mb-3" />}
								{a.bio && <p className="text-black dark:text-white opacity-80 text-sm mb-3 line-clamp-2">{a.bio}</p>}
								<Link to={`/artists/${a.slug}`} className="text-black dark:text-white underline hover:no-underline text-sm font-medium">View Profile →</Link>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}


