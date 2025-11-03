import { useAuth } from '../hooks/useAuth.js'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { apiPost, apiGet } from '../lib/api.js'

export default function Submit() {
  const { isAuthenticated } = useAuth()
  const [links, setLinks] = useState('')
  const [notes, setNotes] = useState('')
  const [notice, setNotice] = useState('')
  const [err, setErr] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold">Submit Your Music</h1>
        <p>Please <Link className="underline" to="/login">login</Link> to submit.</p>
        <p className="text-sm opacity-80">We review within 3–5 business days.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Submit Your Music</h1>
      <p className="text-sm opacity-80">We review within 3–5 business days. Provide links and any notes.</p>
      {notice && <div className="text-green-700">{notice}</div>}
      {err && <div className="text-red-600">{err}</div>}
      <form className="space-y-3" onSubmit={async (e)=>{
        e.preventDefault()
        try {
          const linkArray = links.split('\n').map(s=>s.trim()).filter(Boolean)
          await apiPost('/api/submissions', { links: linkArray, notes })
          setNotice('Submitted! You can expect a response in 3–5 business days.')
          setLinks(''); setNotes('')
        } catch (e) {
          setErr('Failed to submit')
        }
      }}>
        <div>
          <label className="block text-sm font-medium mb-1">Links (one per line)</label>
          <textarea value={links} onChange={(e)=>setLinks(e.target.value)} className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 h-32 bg-white dark:bg-black" placeholder="https://soundcloud.com/...\nhttps://drive.google.com/..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} className="w-full border-2 border-black dark:border-white rounded-lg px-3 py-2 h-24 bg-white dark:bg-black" />
        </div>
        <button type="submit" className="px-4 py-2 border-2 border-black dark:border-white rounded-lg font-bold hover:opacity-80">Submit</button>
      </form>
    </div>
  )
}


