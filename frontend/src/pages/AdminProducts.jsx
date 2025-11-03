import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiUpload } from '../lib/api.js'

export default function AdminProducts() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState('')

  // Create form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState('0')
  const [currency, setCurrency] = useState('GHS')
  const [description, setDescription] = useState('')
  const [artistId, setArtistId] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('')
  const [published, setPublished] = useState(false)
  const [exclusivity, setExclusivity] = useState('exclusive')
  const [tags, setTags] = useState('')
  const [artists, setArtists] = useState([])
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')

  async function load() {
    try {
      const [{ items: prods }, artistList] = await Promise.all([
        apiGet('/api/products?all=true'),
        apiGet('/api/artists')
      ])
      setItems(prods)
      setArtists(Array.isArray(artistList) ? artistList : [])
    } catch (e) {
      setErr('Failed to load products')
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    await fetch(`${base}/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    load()
  }

  async function togglePublished(id, published) {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    await fetch(`${base}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ published: !published })
    })
    load()
  }

  async function uploadCover(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await apiUpload('/api/uploads', file)
      setCoverImageUrl(url)
    } catch {}
    setUploading(false)
  }

  async function uploadPreview(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await apiUpload('/api/uploads', file)
      setAudioPreviewUrl(url)
    } catch {}
    setUploading(false)
  }

  async function createProduct(e) {
    e.preventDefault()
    setErr(''); setNotice('')
    try {
      const body = {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        description,
        coverImageUrl: coverImageUrl || undefined,
        audioPreviewUrl: audioPreviewUrl || undefined,
        price: { amount: Number(price || 0), currency },
        artist: artistId || undefined,
        exclusivity,
        tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
        published,
      }
      await apiPost('/api/products', body)
      setNotice('Product created')
      setTitle(''); setSlug(''); setDescription(''); setArtistId(''); setCoverImageUrl(''); setAudioPreviewUrl(''); setPrice('0'); setPublished(false); setExclusivity('exclusive'); setTags('')
      load()
    } catch (e) {
      setErr('Failed to create product')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Admin • Products</h1>
      {notice && <div className="text-green-700">{notice}</div>}
      {err && <div className="text-red-600">{err}</div>}

      {/* Create Product */}
      <form className="space-y-4 border-2 border-black dark:border-white rounded-lg p-4" onSubmit={createProduct}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black" value={title} onChange={(e)=>setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black" value={slug} onChange={(e)=>setSlug(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (GHS)</label>
            <input type="number" min="0" className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black" value={price} onChange={(e)=>setPrice(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Artist</label>
            <select className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black" value={artistId} onChange={(e)=>setArtistId(e.target.value)}>
              <option value="">None</option>
              {artists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Exclusivity</label>
            <select className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black" value={exclusivity} onChange={(e)=>setExclusivity(e.target.value)}>
              <option value="exclusive">Exclusive</option>
              <option value="limited">Limited</option>
              <option value="open">Open</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black h-24" value={description} onChange={(e)=>setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 bg-white dark:bg-black" value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="exclusive, house, afro" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <input type="file" accept="image/*" onChange={uploadCover} disabled={uploading} />
            {coverImageUrl && <div className="text-sm mt-1">✓ {coverImageUrl}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Audio Preview</label>
            <input type="file" accept="audio/*" onChange={uploadPreview} disabled={uploading} />
            {audioPreviewUrl && <div className="text-sm mt-1">✓ {audioPreviewUrl}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="prod-published" type="checkbox" checked={published} onChange={(e)=>setPublished(e.target.checked)} />
          <label htmlFor="prod-published">Published</label>
        </div>
        <button type="submit" className="px-4 py-2 border-2 border-black dark:border-white rounded-lg font-bold hover:opacity-80" disabled={uploading}>Create Product</button>
      </form>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b-2 border-black dark:border-white">
              <th className="py-2 text-black dark:text-white">Title</th>
              <th className="text-black dark:text-white">Price</th>
              <th className="text-black dark:text-white">Status</th>
              <th className="text-black dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id} className="border-b border-black dark:border-white">
                <td className="py-2 text-black dark:text-white">{p.title}</td>
                <td className="text-black dark:text-white">₵{p?.price?.amount ?? 0}</td>
                <td className="text-black dark:text-white">
                  <button onClick={() => togglePublished(p._id, p.published)} className={`px-2 py-1 rounded text-xs ${p.published ? 'bg-green-600 text-white' : 'bg-gray-400'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="text-right space-x-2">
                  <a href={`/store/${p.slug}`} target="_blank" className="text-sm underline text-black dark:text-white">View</a>
                  <button onClick={() => handleDelete(p._id)} className="text-sm underline text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


