import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api.js'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [err, setErr] = useState('')

  async function load() {
    try {
      const { items } = await apiGet('/api/orders')
      setOrders(items)
    } catch (e) {
      setErr('Failed to load orders')
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Admin • Orders</h1>
      {err && <div className="text-red-600">{err}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b-2 border-black dark:border-white">
              <th className="py-2 text-black dark:text-white">Order ID</th>
              <th className="text-black dark:text-white">User</th>
              <th className="text-black dark:text-white">Total</th>
              <th className="text-black dark:text-white">Status</th>
              <th className="text-black dark:text-white">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-b border-black dark:border-white">
                <td className="py-2 text-black dark:text-white">{o._id.slice(-6)}</td>
                <td className="text-black dark:text-white">{o.user?.email || 'Unknown'}</td>
                <td className="text-black dark:text-white">₵{o?.totals?.subtotal ?? 0}</td>
                <td className="text-black dark:text-white">
                  <span className={`px-2 py-1 rounded text-xs ${o?.totals?.paid ? 'bg-green-600 text-white' : 'bg-yellow-400'}`}>
                    {o?.totals?.paid ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="text-black dark:text-white">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


