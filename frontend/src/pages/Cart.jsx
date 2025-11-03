import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Cart() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setItems(cart)
  }, [])

  function removeItem(id) {
    const next = items.filter(i => i.id !== id)
    setItems(next)
    localStorage.setItem('cart', JSON.stringify(next))
  }

  const total = items.reduce((sum, i) => sum + (i?.price?.amount ?? 0), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Cart</h1>
      {items.length === 0 ? (
        <p className="opacity-80">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map(i => (
              <li key={i.id} className="flex items-center gap-3 border-2 border-black dark:border-white rounded p-3">
                {i.coverImageUrl && <img src={i.coverImageUrl} alt="" className="w-14 h-14 object-cover rounded" />}
                <div className="flex-1">
                  <div className="font-bold">{i.title}</div>
                  <div className="opacity-80">₵{i?.price?.amount ?? 0}</div>
                </div>
                <button className="text-sm underline" onClick={() => removeItem(i.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="font-extrabold">Total: ₵{total}</div>
            <Link to="/checkout" className="px-4 py-2 border-2 border-black dark:border-white rounded-lg font-bold hover:opacity-80">Checkout</Link>
          </div>
        </>
      )}
    </div>
  )
}


