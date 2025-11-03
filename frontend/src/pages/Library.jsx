import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api.js'

export default function Library() {
  const [orders, setOrders] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { items } = await apiGet('/api/orders/me')
        setOrders(items)
      } catch (e) {
        setErr('Failed to load orders (login required).')
      }
    })()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">My Library</h1>
      {err && <div className="text-red-600">{err}</div>}
      {orders.length === 0 ? (
        <p className="opacity-80">No purchases yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o._id} className="border-2 border-black dark:border-white rounded p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold">Order #{o._id.slice(-6)}</div>
                <div className={"text-sm " + (o?.totals?.paid ? 'text-green-700' : 'text-yellow-700')}>{o?.totals?.paid ? 'Paid' : 'Pending'}</div>
              </div>
              <ul className="mt-2 space-y-2">
                {o.items.map((it, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{it.product?.title || 'Exclusive'}</span>
                    <span>₵{it?.priceAtPurchase?.amount ?? 0}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


