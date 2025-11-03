import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

export default function MiniPlayer({ src = '', title = 'No track', artist = '' }) {
	const containerRef = useRef(null)
	const wavesurferRef = useRef(null)
	const [isPlaying, setIsPlaying] = useState(false)
    const [track, setTrack] = useState({ src, title, artist })

	useEffect(() => {
		if (!containerRef.current || !track.src) return
		const ws = WaveSurfer.create({
			container: containerRef.current,
			height: 48,
			waveColor: '#cbd5e1',
			progressColor: '#0f172a',
			cursorColor: '#0f172a',
			barWidth: 2,
			barGap: 1,
		})
		wavesurferRef.current = ws
		ws.load(track.src)
		ws.on('play', ()=>setIsPlaying(true))
		ws.on('pause', ()=>setIsPlaying(false))
		return () => { ws.destroy() }
	}, [track.src])

	useEffect(() => {
		const saved = localStorage.getItem('nowPlaying')
		if (saved) {
			try { setTrack(JSON.parse(saved)) } catch {}
		}
		function onNP() {
			const s = localStorage.getItem('nowPlaying')
			if (s) { try { setTrack(JSON.parse(s)) } catch {} }
		}
		window.addEventListener('nowplaying', onNP)
		return () => window.removeEventListener('nowplaying', onNP)
	}, [])

	function toggle() {
		if (!wavesurferRef.current) return
		wavesurferRef.current.playPause()
	}

	return (
		<div className="fixed bottom-0 inset-x-0 border-t bg-white">
			<div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
				<button onClick={toggle} className="px-3 py-2 border rounded">
					{isPlaying ? 'Pause' : 'Play'}
				</button>
				<div className="flex-1" ref={containerRef} />
				<div className="text-sm text-gray-600 truncate">{track.title}{track.artist ? ` — ${track.artist}` : ''}</div>
			</div>
		</div>
	)
}


