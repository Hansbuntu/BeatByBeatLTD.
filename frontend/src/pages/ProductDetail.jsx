import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api.js'

export default function ProductDetail() {
  const { slug } = useParams()
  const [p, setP] = useState(null)
  const [err, setErr] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet(`/api/products/${slug}`)
        setP(data)
      } catch (e) {
        setErr('Product not found')
      }
    })()
  }, [slug])

  function addToCart() {
    if (!p) return
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const exists = cart.find(i => i.id === p._id)
    if (!exists) cart.push({ id: p._id, slug: p.slug, title: p.title, price: p.price, coverImageUrl: p.coverImageUrl })
    localStorage.setItem('cart', JSON.stringify(cart))
    setNotice('Added to cart')
    setTimeout(() => setNotice(''), 1500)
  }

  if (err) return <div className="text-red-600">{err}</div>
  if (!p) return <div>Loading...</div>

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        {p.coverImageUrl && <img src={p.coverImageUrl} alt="" className="w-full rounded-lg border-2 border-black dark:border-white" />}
        {p.audioPreviewUrl && (
          <audio controls className="w-full mt-4">
            <source src={p.audioPreviewUrl} />
          </audio>
        )}
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold">{p.title}</h1>
        {p.exclusivity && <div className="text-xs uppercase tracking-wide opacity-70">{p.exclusivity}</div>}
        <div className="font-bold text-2xl">₵{p?.price?.amount ?? 0}</div>
        <button onClick={addToCart} className="px-4 py-2 border-2 border-black dark:border-white rounded-lg font-bold hover:opacity-80">Add to Cart</button>
        {notice && <div className="text-green-700">{notice}</div>}
        {p.description && <p className="opacity-80 whitespace-pre-wrap">{p.description}</p>}
      </div>
    </div>
  )
}


