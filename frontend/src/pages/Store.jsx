import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Store() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { items } = await apiGet('/api/products')
        setItems(items)
      } catch (e) {
        setErr('Failed to load store')
      }
    })()
  }, [])

  function addToCart(p) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const exists = cart.find(i => i.id === p._id)
    if (!exists) cart.push({ id: p._id, slug: p.slug, title: p.title, price: p.price, coverImageUrl: p.coverImageUrl })
    localStorage.setItem('cart', JSON.stringify(cart))
    setNotice('Added to cart')
    setTimeout(() => setNotice(''), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Exclusives Store</h1>
        <a href="/cart" className="underline">Cart</a>
      </div>
      {err && <div className="text-red-600">{err}</div>}
      {notice && <div className="text-green-700">{notice}</div>}
      <div className="grid md:grid-cols-3 gap-6">
        {items.map(p => (
          <ProductCard key={p._id} p={p} onAdd={addToCart} />
        ))}
      </div>
    </div>
  )
}


