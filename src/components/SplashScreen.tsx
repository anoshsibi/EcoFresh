import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
  userName?: string
}

const SplashScreen = ({ onComplete, userName }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000) // Show splash for 3 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold mb-4">EcoFresh</h1>
          <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-xl"
        >
          {userName ? `Welcome back, ${userName}!` : 'Welcome to EcoFresh'}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          className="mt-8"
        >
          <div className="inline-block">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
          className="mt-4 text-white/80"
        >
          Preparing your environmental dashboard...
        </motion.p>
      </div>
    </div>
  )
}

export default SplashScreen
