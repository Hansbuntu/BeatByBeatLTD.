import { useAuth } from '../hooks/useAuth.js'
import { Link } from 'react-router-dom'

export default function Account() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold">Account</h1>
        <p>Please <Link className="underline" to="/login">login</Link>.</p>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Account</h1>
      <ul className="list-disc pl-6">
        <li><Link className="underline" to="/library">My Library</Link></li>
        <li><Link className="underline" to="/submit">Submissions</Link></li>
      </ul>
    </div>
  )
}


