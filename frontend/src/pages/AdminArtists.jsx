import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api.js'
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card.jsx'

export default function AdminArtists() {
	const [items, setItems] = useState([])
	const [form, setForm] = useState({ name: '', slug: '', bio: '', instagram: '', x: '', youtube: '', website: '' })
	const [editingId, setEditingId] = useState('')
	const [msg, setMsg] = useState('')

	async function load() {
		try { const data = await apiGet('/api/artists'); setItems(data) } catch {}
	}
	useEffect(()=>{ load() }, [])

	async function save(e) {
		e.preventDefault()
		setMsg('')
		const body = { name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g,'-'), bio: form.bio, socials: { instagram: form.instagram, x: form.x, youtube: form.youtube, website: form.website } }
		const base = (import.meta.env.VITE_API_URL || 'http://localhost:4000')
		const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
		const res = await fetch(`${base}/api/artists${editingId?`/${editingId}`:''}`, { method: editingId?'PUT':'POST', headers, body: JSON.stringify(body) })
		if (res.ok) { setMsg('Saved'); setForm({ name:'', slug:'', bio:'', instagram:'', x:'', youtube:'', website:'' }); setEditingId(''); load() } else { setMsg('Save failed') }
	}

	async function del(id) {
		if (!confirm('Delete this artist?')) return
		const base = (import.meta.env.VITE_API_URL || 'http://localhost:4000')
		await fetch(`${base}/api/artists/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` } })
		load()
	}

	return (
		<div className="max-w-5xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Artists (Admin)</h1>
			<Card>
				<CardHeader>
					<CardTitle>{editingId ? 'Edit Artist' : 'Create Artist'}</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="grid md:grid-cols-2 gap-4" onSubmit={save}>
						<input className="border-2 border-black dark:border-white rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
						<input className="border-2 border-black dark:border-white rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white" placeholder="Slug (optional)" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} />
						<textarea className="md:col-span-2 border-2 border-black dark:border-white rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white" placeholder="Bio" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} />
						<input className="border-2 border-black dark:border-white rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white" placeholder="Instagram" value={form.instagram} onChange={e=>setForm({...form,instagram:e.target.value})} />
						<input className="border-2 border-black dark:border-white rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white" placeholder="X (Twitter)" value={form.x} onChange={e=>setForm({...form,x:e.target.value})} />
						<input className="border-2 border-black dark:border-white rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white" placeholder="YouTube URL" value={form.youtube} onChange={e=>setForm({...form,youtube:e.target.value})} />
						<input className="border-2 border-black dark:border-white rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white" placeholder="Website" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} />
						{msg && <div className="md:col-span-2 text-sm text-green-700 dark:text-green-400">{msg}</div>}
						<div className="md:col-span-2 flex gap-2">
							<button className="bg-black dark:bg-white text-white dark:text-black rounded border-2 border-black dark:border-white px-4 py-2 hover:opacity-90 transition" type="submit">{editingId ? 'Update' : 'Create'}</button>
							{editingId && <button type="button" className="border-2 border-black dark:border-white rounded px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition" onClick={()=>{setEditingId(''); setForm({ name:'', slug:'', bio:'', instagram:'', x:'', youtube:'', website:'' })}}>Cancel</button>}
						</div>
					</form>
				</CardContent>
			</Card>

			<Card className="mt-8">
				<CardHeader>
					<CardTitle>Existing Artists</CardTitle>
				</CardHeader>
				<CardContent>
					{items.length===0 ? (
						<p className="text-black dark:text-white opacity-70">No artists yet.</p>
					) : (
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left border-b border-black dark:border-white">
									<th className="py-2 text-black dark:text-white">Name</th>
									<th className="text-black dark:text-white">Slug</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{items.map(a => (
									<tr key={a._id} className="border-b border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">
										<td className="py-2 text-black dark:text-white">{a.name}</td>
										<td className="text-black dark:text-white">{a.slug}</td>
										<td className="text-right space-x-2">
											<button className="px-2 py-1 border-2 border-black dark:border-white rounded text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xs" onClick={()=>{ setEditingId(a._id); setForm({ name:a.name, slug:a.slug, bio:a.bio||'', instagram:a.socials?.instagram||'', x:a.socials?.x||'', youtube:a.socials?.youtube||'', website:a.socials?.website||'' }) }}>Edit</button>
											<button className="px-2 py-1 border-2 border-red-600 dark:border-red-400 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition text-xs" onClick={()=>del(a._id)}>Delete</button>
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


