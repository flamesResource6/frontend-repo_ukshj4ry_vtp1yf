import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { apiGet, apiPost } from '../lib/api'

function getAnonUserId() {
  try {
    const key = 'anon_user_id'
    let id = localStorage.getItem(key)
    if (!id) {
      id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : `anon_${Math.random().toString(36).slice(2)}`
      localStorage.setItem(key, id)
    }
    return id
  } catch {
    return `anon_${Math.random().toString(36).slice(2)}`
  }
}

export default function Reader({ novel, onClose }) {
  const [chapters, setChapters] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resumePos, setResumePos] = useState(0)
  const scrollRef = useRef(null)
  const userIdRef = useRef(getAnonUserId())
  const savingRef = useRef(false)
  const lastSentRef = useRef(0)

  // Load chapters and progress
  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const cs = await apiGet(`/api/novels/${novel.id}/chapters`)
        if (!mounted) return
        setChapters(cs)
        // Try to resume progress
        try {
          const progress = await apiGet(`/api/progress/${userIdRef.current}/${novel.id}`)
          if (progress && progress.chapter_id) {
            const found = cs.find(c => c.id === progress.chapter_id) || cs[0]
            setActive(found || null)
            setResumePos(typeof progress.position === 'number' ? progress.position : 0)
          } else {
            setActive(cs[0] || null)
            setResumePos(0)
          }
        } catch {
          setActive(cs[0] || null)
          setResumePos(0)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [novel.id])

  const content = useMemo(() => active?.content || '', [active])

  // Scroll to resume position when active chapter changes
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // small delay to ensure content is rendered
    const t = setTimeout(() => {
      const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight)
      el.scrollTop = Math.min(maxScroll, Math.floor(maxScroll * resumePos))
    }, 50)
    return () => clearTimeout(t)
  }, [active?.id, resumePos])

  const saveProgress = useCallback(async (positionRatio) => {
    if (!active) return
    const now = Date.now()
    // Throttle network calls to at most 1 every 600ms
    if (now - lastSentRef.current < 600) return
    lastSentRef.current = now
    try {
      savingRef.current = true
      await apiPost('/api/progress', {
        user_id: userIdRef.current,
        novel_id: novel.id,
        chapter_id: active.id,
        position: Math.max(0, Math.min(1, positionRatio || 0))
      })
    } finally {
      savingRef.current = false
    }
  }, [active, novel.id])

  // On scroll, compute position and save (throttled)
  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || !active) return
    const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight)
    const ratio = el.scrollTop / maxScroll
    saveProgress(ratio)
  }, [active, saveProgress])

  // Save when chapter changes (reset to start)
  useEffect(() => {
    if (!active) return
    setResumePos(0)
    // Post a reset progress to 0 to indicate chapter change
    saveProgress(0)
  }, [active?.id])

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
              <button
                key={ch.id}
                onClick={() => setActive(ch)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active?.id===ch.id? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                <div className="font-medium">{ch.index}. {ch.title}</div>
              </button>
            ))}
          </div>
        )}
      </aside>
      <main ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
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
  )
}
