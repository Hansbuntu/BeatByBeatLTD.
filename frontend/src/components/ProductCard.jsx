import { Link } from 'react-router-dom'

export default function ProductCard({ p, onAdd }) {
  return (
    <div className="border-2 border-black dark:border-white rounded-lg overflow-hidden flex flex-col">
      {p.coverImageUrl && (
        <Link to={`/store/${p.slug}`}>
          <img src={p.coverImageUrl} alt="" className="w-full h-44 object-cover" />
        </Link>
      )}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <Link to={`/store/${p.slug}`} className="font-extrabold leading-tight hover:underline">{p.title}</Link>
        {p.exclusivity && (
          <div className="text-xs uppercase tracking-wide opacity-70">{p.exclusivity}</div>
        )}
        <div className="mt-auto flex items-center justify-between">
          <div className="font-bold">₵{p?.price?.amount ?? 0}</div>
          <button onClick={() => onAdd?.(p)} className="px-3 py-1.5 border-2 border-black dark:border-white rounded-lg hover:opacity-80 text-sm">Add</button>
        </div>
      </div>
    </div>
  )
}


