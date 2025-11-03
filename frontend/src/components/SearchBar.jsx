import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
	const [query, setQuery] = useState('')
	const navigate = useNavigate()

	function handleSubmit(e) {
		e.preventDefault()
		if (query.trim()) {
			navigate(`/posts?search=${encodeURIComponent(query.trim())}`)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<input
				type="text"
				placeholder="Search posts..."
				className="border-2 border-black dark:border-white rounded-lg px-3 py-1.5 text-sm w-48 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>
			<button type="submit" className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg border-2 border-black dark:border-white hover:opacity-90 transition text-sm font-medium">
				Search
			</button>
		</form>
	)
}

