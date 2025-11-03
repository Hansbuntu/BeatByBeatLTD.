import { useState } from 'react'
import { apiPost } from '../lib/api.js'
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card.jsx'

export default function Login() {
	const [email, setEmail] = useState('admin@example.com')
	const [password, setPassword] = useState('pass123')
	const [error, setError] = useState('')

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		try {
			const { token } = await apiPost('/api/auth/login', { email, password })
			localStorage.setItem('token', token)
			window.location.href = '/admin'
		} catch (e) {
			setError('Login failed - check credentials')
		}
	}

	return (
		<div className="max-w-md mx-auto">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Admin Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={onSubmit}>
						<div>
							<label className="block text-sm font-medium mb-1 text-black dark:text-white">Email</label>
							<input
								className="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
								placeholder="admin@example.com"
								value={email}
								onChange={(e)=>setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1 text-black dark:text-white">Password</label>
							<input
								className="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e)=>setPassword(e.target.value)}
								required
							/>
						</div>
						{error && <div className="text-red-600 dark:text-red-400 text-sm p-3 border-2 border-red-600 dark:border-red-400 rounded bg-red-50 dark:bg-red-950">{error}</div>}
						<button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black rounded-lg border-2 border-black dark:border-white px-4 py-2 hover:opacity-90 transition font-medium">Sign In</button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}


