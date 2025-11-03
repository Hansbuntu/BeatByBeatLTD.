import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiPost } from '../lib/api.js'

export default function Checkout() {
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [notice, setNotice] = useState('')
  const [err, setErr] = useState('')
  const isDemo = (import.meta.env.VITE_DEMO_MODE || '').toString() === 'true'

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setItems(cart)
  }, [])

  const total = useMemo(() => items.reduce((s, i) => s + (i?.price?.amount ?? 0), 0), [items])

  async function pay() {
    try {
      if (items.length === 0) return
      const body = { items: items.map(i => ({ productId: i.id, licenseType: 'standard' })) }
      const { authorization_url } = await apiPost('/api/checkout/paystack/init', body)
      window.location.href = authorization_url
    } catch (e) {
      setErr('Failed to initialize payment')
    }
  }

  async function completeDemo() {
    try {
      if (items.length === 0) return
      const body = { items: items.map(i => ({ productId: i.id, licenseType: 'standard' })) }
      const res = await apiPost('/api/checkout/demo/complete', body)
      localStorage.removeItem('cart')
      setNotice('Demo purchase completed. Your order is confirmed.')
      setItems([])
    } catch (e) {
      setErr('Failed to complete demo purchase')
    }
  }

  // If redirected back with reference, attempt verification
  useEffect(() => {
    const ref = searchParams.get('reference')
    const orderId = searchParams.get('orderId')
    if (ref && orderId) {
      ;(async () => {
        try {
          await apiPost('/api/checkout/paystack/verify', { reference: ref, orderId })
          localStorage.removeItem('cart')
          setNotice('Payment successful. Your order is confirmed.')
        } catch (e) {
          setErr('Verification failed')
        }
      })()
    }
  }, [searchParams])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      {notice && <div className="text-green-700">{notice}</div>}
      {err && <div className="text-red-600">{err}</div>}
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
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="font-extrabold">Total: ₵{total}</div>
            <div className="flex items-center gap-2">
              {isDemo && <button onClick={completeDemo} className="px-4 py-2 border-2 border-black dark:border-white rounded-lg font-bold hover:opacity-80">Complete Demo Purchase</button>}
              <button onClick={pay} className="px-4 py-2 border-2 border-black dark:border-white rounded-lg font-bold hover:opacity-80">Pay with Paystack</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


