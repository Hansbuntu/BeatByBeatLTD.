export function Card({ children }) {
	return <div className="border border-black dark:border-white rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition">{children}</div>
}

export function CardHeader({ children }) {
	return <div className="p-4 border-b border-black dark:border-white">{children}</div>
}

export function CardContent({ children }) {
	return <div className="p-4">{children}</div>
}

export function CardTitle({ children }) {
	return <h3 className="text-lg font-semibold text-black dark:text-white">{children}</h3>
}


