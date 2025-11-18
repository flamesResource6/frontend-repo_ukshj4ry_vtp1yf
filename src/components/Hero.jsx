import { motion } from 'framer-motion'

export default function Hero({ onExplore }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden>
        <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/40 to-violet-500/40 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-gradient-to-br from-fuchsia-500/30 to-emerald-500/30 blur-3xl rounded-full" />
      </div>
      <div className="text-center space-y-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent"
        >
          Read the Future
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="max-w-2xl mx-auto text-slate-300 text-lg"
        >
          Dive into neon-lit worlds, quantum gardens, and star-faring epics in a distraction-free, immersive reader.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onExplore}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-cyan-500/20"
        >
          Explore Library
        </motion.button>
      </div>
    </div>
  )
}
