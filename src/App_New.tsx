import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainPageNew from './components/MainPageNew'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import News from './components/News'
import About from './components/About'

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'dashboard' | 'analytics' | 'news' | 'about'>('main')
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#dashboard' || hash === '#dashboard-page') {
        setCurrentView('dashboard')
      } else if (hash === '#analytics') {
        setCurrentView('analytics')
      } else if (hash === '#news') {
        setCurrentView('news')
      } else if (hash === '#about') {
        setCurrentView('about')
      } else {
        setCurrentView('main')
      }
    }

    // Check initial hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Auto-hide splash screen after 3 seconds or on click
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(splashTimer)
  }, [])

  const handleSkipSplash = () => {
    setShowSplash(false)
  }



  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.05,
              filter: "blur(8px)",
              transition: { 
                duration: 1.0,
                ease: "easeInOut"
              }
            }}
            className="fixed inset-0 z-[10000] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center cursor-pointer"
            onClick={handleSkipSplash}
          >
            <div className="text-center">
              <div className="text-6xl font-light text-white tracking-[8px] mb-4 opacity-90">
                Eco<span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Fresh</span>
              </div>
              <div className="text-lg text-white/60 tracking-[3px] uppercase font-normal">
                Clean Air Intelligence
              </div>
              <div className="mt-8 text-sm text-white/40">
                Click anywhere or wait to continue...
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ 
              opacity: 0, 
              scale: 0.85,
              filter: "blur(15px)"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: "blur(0px)"
            }}
            transition={{ 
              duration: 1.8,
              ease: "easeOut",
              delay: 0.1
            }}
            className="min-h-screen"
          >
            {currentView === 'main' && <MainPageNew />}
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'analytics' && <Analytics />}
            {currentView === 'news' && <News />}
            {currentView === 'about' && <About />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
