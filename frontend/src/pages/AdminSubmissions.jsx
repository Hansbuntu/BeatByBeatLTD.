import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api.js'

export default function AdminSubmissions() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState('')

  async function load() {
    try {
      const { items } = await apiGet('/api/submissions')
      setItems(items)
    } catch (e) {
      setErr('Failed to load submissions')
    }
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/submissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ status })
    })
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Admin • Submissions</h1>
      {err && <div className="text-red-600">{err}</div>}
      <div className="space-y-4">
        {items.map(s => (
          <div key={s._id} className="border-2 border-black dark:border-white rounded p-4">
            <div className="flex items-center justify-between">
              <div className="font-bold">{s.user?.email || 'User'}</div>
              <div className="text-sm">{new Date(s.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-sm opacity-80 whitespace-pre-wrap">{(s.links||[]).join('\n')}</div>
            {s.notes && <div className="mt-2 text-sm">{s.notes}</div>}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide">{s.status}</span>
              <button className="px-3 py-1 border-2 border-black dark:border-white rounded text-sm" onClick={()=>updateStatus(s._id,'in_review')}>In Review</button>
              <button className="px-3 py-1 border-2 border-black dark:border-white rounded text-sm" onClick={()=>updateStatus(s._id,'approved')}>Approve</button>
              <button className="px-3 py-1 border-2 border-black dark:border-white rounded text-sm" onClick={()=>updateStatus(s._id,'rejected')}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


