import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainPage from './components/MainPageNew'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import News from './components/News'
import About from './components/About'

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'dashboard' | 'analytics' | 'news' | 'about'>('main')
  const [showSplash, setShowSplash] = useState(false)
  const [splashFadeOut, setSplashFadeOut] = useState(false)
  const [barOpacity, setBarOpacity] = useState(0)
  const [barWidth, setBarWidth] = useState(0)

  // Check if this is a page reload vs navigation
  useEffect(() => {
    // Clear any previous state
    setShowSplash(false)
    setSplashFadeOut(false)
    setBarOpacity(0)
    setBarWidth(0)
    
    // Use a more reliable method to detect page reload
    // Method 1: Check if we're on the main view AND it's a fresh load
    const isMainView = window.location.hash === '' || window.location.hash === '#' || window.location.hash === '#main'
    
    // Method 2: Use performance navigation API
    const navigationEntries = performance.getEntriesByType('navigation')
    let isPageReload = false
    
    if (navigationEntries.length > 0) {
      const navigationType = (navigationEntries[0] as PerformanceNavigationTiming).type
      isPageReload = navigationType === 'reload'
    }
    
    // Method 3: Check document.referrer and if we haven't set a navigation flag yet
    const isFirstLoad = !sessionStorage.getItem('app-has-loaded')
    
    // Show splash if:
    // 1. It's a page reload, OR  
    // 2. It's the first load of the session AND we're on main view
    if (isPageReload || (isFirstLoad && isMainView)) {
      console.log('Showing splash screen - Reload:', isPageReload, 'First load:', isFirstLoad, 'Main view:', isMainView)
      
      setShowSplash(true)
      
      // Mark that app has loaded in this session
      sessionStorage.setItem('app-has-loaded', 'true')
      
      // Handle splash screen animation
      const barOpacityTimer = setTimeout(() => {
        setBarOpacity(1);
        
        const barWidthTimer = setTimeout(() => {
          setBarWidth(100);
        }, 500);
        
        return () => clearTimeout(barWidthTimer);
      }, 2000);
      
      const splashTimer = setTimeout(() => {
        setSplashFadeOut(true)
        setTimeout(() => {
          setShowSplash(false)
        }, 800)
      }, 4500)

      return () => {
        clearTimeout(barOpacityTimer);
        clearTimeout(splashTimer);
      }
    } else {
      console.log('Not showing splash screen - navigation detected')
    }
  }, [])

  // Skip splash on click
  const handleSkipSplash = () => {
    if (showSplash && !splashFadeOut) {
      setSplashFadeOut(true)
      setTimeout(() => {
        setShowSplash(false)
      }, 800)
    }
  }

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

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="min-h-screen text-white relative">
      {/* Splash Screen */}
      {showSplash && (
        <div 
          className={`fixed inset-0 z-50 bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] overflow-hidden cursor-pointer ${
            splashFadeOut ? 'animate-splash-fade-out' : ''
          }`}
          onClick={handleSkipSplash}
        >
          {/* Particle Field */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-cyan-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  animation: `particleFloat ${Math.random() * 4 + 6}s linear infinite ${Math.random() * 8}s`
                }}
              />
            ))}
          </div>

          {/* Splash Container */}
          <div className="h-full flex flex-col">
            {/* Main content area */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                {/* Breathing Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[400px] md:h-[400px] sm:w-[320px] sm:h-[320px] border-2 border-cyan-400/30 rounded-full animate-breathe"></div>
                
                {/* Text Content */}
                <div className="relative z-10 text-center px-8">
                  <div className="text-6xl md:text-6xl sm:text-4xl font-light text-white tracking-[8px] md:tracking-[8px] sm:tracking-[4px] mb-2 opacity-0 animate-logo-fade-in">
                    Eco<span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Fresh</span>
                  </div>
                  <div className="text-lg md:text-lg sm:text-base text-white/60 tracking-[3px] md:tracking-[3px] sm:tracking-[2px] uppercase font-normal opacity-0 animate-tagline-fade-in">
                    Clean Air Intelligence
                  </div>
                </div>
              </div>
            </div>
            
            {/* Loading Elements */}
            <div className="pb-12 w-full flex flex-col items-center justify-center">
              {/* Loading Bar */}
              <div className="w-[300px] max-w-[90vw] h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" 
                  style={{
                    width: `${barWidth}%`,
                    opacity: barOpacity,
                    transition: 'width 2s ease-out, opacity 0.5s ease-out',
                  }}>
                </div>
              </div>

              {/* Loading Text */}
              <div 
                className="text-sm text-white/40 tracking-[2px] text-center"
                style={{
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease-out 2.5s forwards',
                }}
              >
                Loading...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main App Content */}
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="min-h-screen"
      >
        {currentView === 'main' && <MainPage />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'news' && <News />}
        {currentView === 'about' && <About />}
      </motion.div>
    </div>
  )
}

export default App
