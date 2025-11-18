import { useState } from 'react'
import Hero from './components/Hero'
import Library from './components/Library'
import Reader from './components/Reader'

function App() {
  const [showLibrary, setShowLibrary] = useState(false)
  const [openNovel, setOpenNovel] = useState(null)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="relative min-h-screen">
        <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="font-extrabold tracking-tight text-white">NeonReads</div>
            <nav className="text-sm text-slate-300">
              <a href="/test" className="hover:text-white">System Test</a>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6">
          {!showLibrary && (
            <Hero onExplore={() => setShowLibrary(true)} />
          )}

          {showLibrary && (
            <div className="py-10">
              <Library onOpen={(n) => setOpenNovel(n)} />
            </div>
          )}
        </main>

        {openNovel && (
          <Reader novel={openNovel} onClose={() => setOpenNovel(null)} />
        )}

        <footer className="border-t border-slate-800 py-6 text-center text-slate-400">
          Built for immersive reading in a neon future.
        </footer>
      </div>
    </div>
  )
}

export default App
