const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getHeaders() {
	const token = localStorage.getItem('token')
	const headers = { 'Content-Type': 'application/json' }
	if (token) headers.Authorization = `Bearer ${token}`
	return headers
}

export async function apiGet(path) {
	const res = await fetch(`${API_URL}${path}`, { headers: getHeaders() })
	if (!res.ok) {
		let errorMsg = `GET ${path} failed`
		try {
			const data = await res.json()
			if (data.error) errorMsg = data.error
		} catch {}
		throw new Error(errorMsg)
	}
	return res.json()
}

export async function apiPost(path, body) {
	const res = await fetch(`${API_URL}${path}`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify(body),
	})
	if (!res.ok) {
		let errorMsg = `POST ${path} failed`
		try {
			const data = await res.json()
			if (data.error) errorMsg = data.error
		} catch {}
		throw new Error(errorMsg)
	}
	return res.json()
}

export async function apiUpload(path, file) {
	const token = localStorage.getItem('token')
	const fd = new FormData()
	fd.append('file', file)
	const res = await fetch(`${API_URL}${path}`, {
		method: 'POST',
		headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		body: fd,
	})
	if (!res.ok) throw new Error(`UPLOAD ${path} failed`)
	return res.json()
}


