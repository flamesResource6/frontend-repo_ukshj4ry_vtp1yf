import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'

export default function Library({ onOpen }) {
  const [novels, setNovels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const data = await apiGet('/api/novels')
        if (mounted) setNovels(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const seed = async () => {
    try {
      await apiPost('/api/seed', {})
      const data = await apiGet('/api/novels')
      setNovels(data)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Library</h2>
        <button onClick={seed} className="text-sm px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-200 hover:bg-slate-700">Seed Demo</button>
      </div>

      {loading && (
        <p className="text-slate-300">Loading...</p>
      )}
      {error && (
        <p className="text-red-400">{error}</p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {novels.map(n => (
          <button key={n.id} onClick={() => onOpen(n)} className="group text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] bg-slate-900/50 relative">
              {n.cover_url && (
                <img src={n.cover_url} alt={n.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            </div>
            <div className="p-4 space-y-1">
              <div className="text-white font-semibold truncate">{n.title}</div>
              <div className="text-slate-300 text-sm">by {n.author}</div>
              {n.genres?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {n.genres.slice(0,3).map(g => (
                    <span key={g} className="px-2 py-0.5 rounded-full bg-slate-700/70 text-slate-200 text-xs">{g}</span>
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {novels.length === 0 && !loading && (
        <div className="text-slate-300">No novels yet. Click Seed Demo to add a couple.</div>
      )}
    </div>
  )
}
