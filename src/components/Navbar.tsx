import React from 'react'

interface NavbarProps {
  currentPage?: string
  onJoinCommunity?: () => void
  onDonate?: () => void
  onLogout?: () => void
  userEmail?: string
}

export default function Navbar({ currentPage = '', onJoinCommunity, onDonate, onLogout, userEmail }: NavbarProps) {
  const navigateTo = (hash: string) => {
    if (hash === '') {
      window.location.hash = ''
    } else {
      window.location.hash = hash
    }
  }

  const navItems = [
    { id: '', label: 'Home', hash: '' },
    { id: 'dashboard', label: 'Dashboard', hash: '#dashboard' },
    { id: 'analytics', label: 'Analytics', hash: '#analytics' },
    { id: 'news', label: 'News', hash: '#news' },
    { id: 'about', label: 'About', hash: '#about' }
  ]

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigateTo('')}
              className="text-xl font-bold text-white hover:scale-105 transition-transform duration-300"
              style={{ 
                background: 'linear-gradient(45deg, #00d4ff, #5e72e4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              EcoFresh
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.hash)}
                className={`text-sm font-medium transition-all duration-300 relative ${
                  currentPage === item.id
                    ? 'text-white border-b-2 border-blue-500 pb-1'
                    : 'text-gray-300 hover:text-white hover:text-[#00d4ff]'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* User info and logout button */}
            {onLogout && (
              <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-white/20">
                {userEmail && (
                  <span className="text-sm text-gray-300">
                    Welcome, {userEmail.split('@')[0]}
                  </span>
                )}
                <button 
                  onClick={onLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}
            
            {/* Conditional Action Buttons - Only show on About page */}
            {currentPage === 'about' && (onJoinCommunity || onDonate) && (
              <>
                {onJoinCommunity && (
                  <button 
                    onClick={onJoinCommunity}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Join Community
                  </button>
                )}
                {onDonate && (
                  <button 
                    onClick={onDonate}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Donate
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white hover:text-[#00d4ff] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (hidden by default, can be expanded later) */}
      <div className="md:hidden hidden bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="px-4 py-3 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.hash)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                currentPage === item.id
                  ? 'text-white bg-blue-600'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
} 