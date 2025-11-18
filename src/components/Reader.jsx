import { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../lib/api'

export default function Reader({ novel, onClose }) {
  const [chapters, setChapters] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const cs = await apiGet(`/api/novels/${novel.id}/chapters`)
      setChapters(cs)
      setActive(cs[0] || null)
      setLoading(false)
    }
    load()
  }, [novel.id])

  const content = useMemo(() => active?.content || '', [active])

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex">
      <aside className="w-80 max-w-[80vw] border-r border-slate-800 bg-slate-900/60 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white font-semibold truncate pr-2">{novel.title}</div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">Close</button>
        </div>
        {loading ? (
          <p className="text-slate-400">Loading chapters...</p>
        ) : (
          <div className="space-y-1">
            {chapters.map(ch => (
              <button key={ch.id} onClick={() => setActive(ch)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active?.id===ch.id? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'}`}>
                <div className="font-medium">{ch.index}. {ch.title}</div>
              </button>
            ))}
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {active ? (
            <article className="prose prose-invert prose-slate">
              <h1 className="text-3xl font-bold text-white mb-4">{active.title}</h1>
              <div className="text-slate-300 whitespace-pre-wrap leading-8 tracking-wide">
                {content}
              </div>
            </article>
          ) : (
            <p className="text-slate-400">Select a chapter to begin reading.</p>
          )}
        </div>
      </main>
    </div>
  )}
}
