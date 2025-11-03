import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api.js'
import { Link } from 'react-router-dom'

export default function Discover() {
  const [posts, setPosts] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { items } = await apiGet('/api/posts?limit=10')
        setPosts(items)
      } catch (e) {
        setErr('Failed to load')
      }
    })()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Discover</h1>
      {err && <div className="text-red-600">{err}</div>}
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map(p => (
          <Link key={p._id} to={`/posts/${p.slug}`} className="block border-2 border-black dark:border-white rounded-lg overflow-hidden hover:opacity-90 transition">
            {p.coverImageUrl && <img src={p.coverImageUrl} alt="" className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="font-bold text-lg">{p.title}</div>
              {p.excerpt && <div className="text-sm opacity-80 mt-1">{p.excerpt}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


