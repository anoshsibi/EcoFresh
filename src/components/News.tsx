import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'

// News article interface
interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  author: string
  publishedAt: string
  imageUrl: string
  source: string
  category: string
  location: {
    country: string
    state: string
  }
  readTime: string
  tags: string[]
}

// Filter options
const TIME_FILTERS = [
  { id: '1', label: 'Today', days: 1 },
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '30', label: 'Last 30 days', days: 30 },
  { id: '90', label: 'Last 3 months', days: 90 },
  { id: 'all', label: 'All time', days: 0 }
]

const COUNTRIES = [
  { id: 'all', name: 'All Countries' },
  { id: 'us', name: 'United States' },
  { id: 'uk', name: 'United Kingdom' },
  { id: 'canada', name: 'Canada' },
  { id: 'australia', name: 'Australia' },
  { id: 'germany', name: 'Germany' },
  { id: 'france', name: 'France' },
  { id: 'japan', name: 'Japan' },
  { id: 'china', name: 'China' },
  { id: 'india', name: 'India' },
  { id: 'brazil', name: 'Brazil' }
]

const STATES_BY_COUNTRY: { [key: string]: { id: string; name: string }[] } = {
  us: [
    { id: 'all', name: 'All States' },
    { id: 'ca', name: 'California' },
    { id: 'ny', name: 'New York' },
    { id: 'fl', name: 'Florida' },
    { id: 'tx', name: 'Texas' },
    { id: 'wa', name: 'Washington' }
  ],
  uk: [
    { id: 'all', name: 'All Regions' },
    { id: 'england', name: 'England' },
    { id: 'scotland', name: 'Scotland' },
    { id: 'wales', name: 'Wales' }
  ],
  canada: [
    { id: 'all', name: 'All Provinces' },
    { id: 'on', name: 'Ontario' },
    { id: 'qc', name: 'Quebec' },
    { id: 'bc', name: 'British Columbia' }
  ]
}

export default function News() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('7')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedState, setSelectedState] = useState('all')
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [showModal, setShowModal] = useState(false)

  // const navigateTo = (hash: string) => {
  //   if (hash === '') {
  //     window.location.hash = ''
  //   } else {
  //     window.location.hash = hash
  //   }
  // }

  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article)
    setShowModal(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const closeArticle = () => {
    setSelectedArticle(null)
    setShowModal(false)
    // Restore body scroll
    document.body.style.overflow = 'unset'
  }

  const shareArticle = async (article: NewsArticle) => {
    const shareData = {
      title: article.title,
      text: article.summary,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        const textToCopy = `${article.title}\n\n${article.summary}\n\nRead more: ${window.location.href}`
        await navigator.clipboard.writeText(textToCopy)
        alert('Article link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing article:', error)
      // Fallback: copy to clipboard
      try {
        const textToCopy = `${article.title}\n\n${article.summary}\n\nRead more: ${window.location.href}`
        await navigator.clipboard.writeText(textToCopy)
        alert('Article link copied to clipboard!')
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError)
        alert('Unable to share article. Please copy the URL manually.')
      }
    }
  }

  const viewSource = (article: NewsArticle) => {
    // Create a simulated source URL (in a real app, this would be the actual article URL)
    const sourceUrl = `https://${article.source.toLowerCase().replace(/\s+/g, '')}.com/article/${article.id}`
    window.open(sourceUrl, '_blank', 'noopener,noreferrer')
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeArticle()
      }
    }

    if (showModal) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showModal])

  // Mock news data generator
  const generateMockNews = (): NewsArticle[] => {
    const newsTemplates = [
      {
        title: "Air Quality Improves in Major Cities Following New Green Policies",
        summary: "Recent environmental policies have led to significant improvements in air quality across several metropolitan areas.",
        category: "Policy",
        tags: ["policy", "improvement", "government"]
      },
      {
        title: "Wildfire Smoke Creates Hazardous Air Quality Conditions",
        summary: "Forest fires have created dangerous air quality levels, prompting health warnings for sensitive groups.",
        category: "Emergency",
        tags: ["wildfire", "hazardous", "health"]
      },
      {
        title: "New Air Quality Monitoring System Deployed Nationwide",
        summary: "Advanced sensors and AI technology are revolutionizing how we monitor and predict air pollution.",
        category: "Technology",
        tags: ["monitoring", "technology", "sensors"]
      },
      {
        title: "Study Links Air Pollution to Increased Respiratory Illness",
        summary: "Latest research demonstrates the direct correlation between air quality and public health outcomes.",
        category: "Health",
        tags: ["health", "research", "respiratory"]
      },
      {
        title: "Electric Vehicle Adoption Reduces Urban Air Pollution",
        summary: "Cities with higher EV adoption rates show measurable improvements in air quality metrics.",
        category: "Transportation",
        tags: ["electric-vehicles", "urban", "pollution"]
      },
      {
        title: "Industrial Emissions Regulations Tightened",
        summary: "New federal regulations impose stricter limits on industrial air pollution emissions.",
        category: "Regulation",
        tags: ["industrial", "emissions", "regulation"]
      }
    ]

    const countries = ['us', 'uk', 'canada', 'australia', 'germany', 'france']
    const states = ['ca', 'ny', 'fl', 'england', 'scotland', 'on', 'qc']
    const sources = ['Environmental Times', 'Air Quality Today', 'Green News', 'Health Monitor', 'EcoWatch', 'Clean Air Alliance']
    const authors = ['Dr. Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'Prof. David Kim', 'Lisa Anderson', 'James Wilson']

    return Array.from({ length: 24 }, (_, index) => {
      const template = newsTemplates[index % newsTemplates.length]
      const daysAgo = Math.floor(Math.random() * 90)
      const publishDate = new Date()
      publishDate.setDate(publishDate.getDate() - daysAgo)

      return {
        id: `news-${index + 1}`,
        title: template.title,
        summary: template.summary,
        content: `${template.summary} This comprehensive report analyzes the latest developments in air quality monitoring and environmental health. Recent studies have shown significant correlations between air pollution levels and various health outcomes. Environmental experts recommend continued monitoring and policy development to address these challenges. The implementation of new technologies and regulations continues to play a crucial role in improving air quality standards worldwide.`,
        author: authors[Math.floor(Math.random() * authors.length)],
        publishedAt: publishDate.toISOString(),
        imageUrl: `https://picsum.photos/800/400?random=${index + 1}`,
        source: sources[Math.floor(Math.random() * sources.length)],
        category: template.category,
        location: {
          country: countries[Math.floor(Math.random() * countries.length)],
          state: states[Math.floor(Math.random() * states.length)]
        },
        readTime: `${Math.floor(Math.random() * 8) + 2} min read`,
        tags: template.tags
      }
    })
  }

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      const mockNews = generateMockNews()
      setNewsArticles(mockNews)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = [...newsArticles]

    // Filter by time
    if (selectedTimeFilter !== 'all') {
      const daysToFilter = TIME_FILTERS.find(f => f.id === selectedTimeFilter)?.days || 7
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToFilter)
      
      filtered = filtered.filter(article => 
        new Date(article.publishedAt) >= cutoffDate
      )
    }

    // Filter by country
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(article => 
        article.location.country === selectedCountry
      )
    }

    // Filter by state
    if (selectedState !== 'all') {
      filtered = filtered.filter(article => 
        article.location.state === selectedState
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredNews(filtered)
  }, [newsArticles, selectedTimeFilter, selectedCountry, selectedState, searchQuery])

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths}mo ago`
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Policy': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Emergency': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Technology': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Health': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Transportation': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Regulation': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  const availableStates = selectedCountry !== 'all' 
    ? STATES_BY_COUNTRY[selectedCountry] || [{ id: 'all', name: 'All Regions' }]
    : [{ id: 'all', name: 'All Regions' }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Navbar currentPage="news" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            📰 Air Quality News
          </h1>
          <p className="text-gray-400 text-lg">
            Stay updated with the latest air quality news, research, and environmental developments
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">📅 Time Period</label>
              <select
                value={selectedTimeFilter}
                onChange={(e) => setSelectedTimeFilter(e.target.value)}
                className="w-full p-3 bg-black/60 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {TIME_FILTERS.map(filter => (
                  <option key={filter.id} value={filter.id}>{filter.label}</option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value)
                  setSelectedState('all')
                }}
                className="w-full p-3 bg-black/60 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {COUNTRIES.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">📍 State/Region</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                disabled={selectedCountry === 'all'}
                className="w-full p-3 bg-black/60 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
              >
                {availableStates.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Showing {filteredNews.length} articles</span>
            {selectedTimeFilter !== 'all' && (
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                {TIME_FILTERS.find(f => f.id === selectedTimeFilter)?.label}
              </span>
            )}
            {selectedCountry !== 'all' && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                {COUNTRIES.find(c => c.id === selectedCountry)?.name}
              </span>
            )}
            {selectedState !== 'all' && (
              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                {availableStates.find(s => s.id === selectedState)?.name}
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-black/40 rounded-xl border border-white/10 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* News Articles */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map(article => (
              <article key={article.id} className="bg-black/40 rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="relative">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>{article.source}</span>
                    <span>{getRelativeTime(article.publishedAt)}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 leading-tight">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>By {article.author}</span>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                                     <button 
                     onClick={() => openArticle(article)}
                     className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium"
                   >
                     Read Full Article
                   </button>
                </div>
              </article>
            ))}
          </div>
        )}

                 {/* No Results */}
         {!loading && filteredNews.length === 0 && (
           <div className="text-center py-12">
             <div className="text-6xl mb-4">📰</div>
             <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
             <p className="text-gray-400">Try adjusting your filters or search terms</p>
           </div>
         )}
       </div>

       {/* Article Modal */}
       {showModal && selectedArticle && (
         <div className="fixed inset-0 z-[9999] overflow-y-auto">
           {/* Backdrop */}
           <div 
             className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
             onClick={closeArticle}
           ></div>
           
           {/* Modal Content */}
           <div className="relative min-h-screen flex items-center justify-center p-4">
             <div className="relative bg-gray-900 rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
               {/* Close Button */}
               <button
                 onClick={closeArticle}
                 className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
               >
                 ✕
               </button>
               
               {/* Article Header */}
               <div className="relative">
                 <img 
                   src={selectedArticle.imageUrl} 
                   alt={selectedArticle.title}
                   className="w-full h-64 md:h-80 object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                 <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(selectedArticle.category)}`}>
                   {selectedArticle.category}
                 </div>
                 <div className="absolute bottom-6 left-6 right-16">
                   <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                     {selectedArticle.title}
                   </h1>
                   <div className="flex items-center gap-4 text-gray-300 text-sm">
                     <span className="flex items-center gap-2">
                       👤 {selectedArticle.author}
                     </span>
                     <span className="flex items-center gap-2">
                       📅 {getRelativeTime(selectedArticle.publishedAt)}
                     </span>
                     <span className="flex items-center gap-2">
                       ⏱️ {selectedArticle.readTime}
                     </span>
                   </div>
                 </div>
               </div>
               
               {/* Article Content */}
               <div className="p-6 md:p-8 overflow-y-auto max-h-[50vh]">
                 {/* Source and metadata */}
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                   <div className="flex items-center gap-4">
                     <span className="text-blue-400 font-medium">{selectedArticle.source}</span>
                     <span className="text-gray-400">•</span>
                     <span className="text-gray-400">{new Date(selectedArticle.publishedAt).toLocaleDateString('en-US', {
                       year: 'numeric',
                       month: 'long',
                       day: 'numeric'
                     })}</span>
                   </div>
                   <div className="flex gap-2">
                     <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Share">
                       🔗
                     </button>
                     <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Bookmark">
                       🔖
                     </button>
                   </div>
                 </div>
                 
                 {/* Summary */}
                 <div className="mb-6">
                   <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
                   <p className="text-gray-300 text-lg leading-relaxed italic border-l-4 border-blue-500 pl-4">
                     {selectedArticle.summary}
                   </p>
                 </div>
                 
                 {/* Full Content */}
                 <div className="prose prose-invert max-w-none">
                   <h3 className="text-lg font-semibold text-white mb-4">Full Article</h3>
                   <div className="text-gray-300 leading-relaxed space-y-4">
                     {selectedArticle.content.split('. ').map((sentence, index) => (
                       <p key={index} className="mb-4">
                         {sentence.trim()}{sentence.includes('.') ? '' : '.'}
                       </p>
                     ))}
                   </div>
                 </div>
                 
                 {/* Tags */}
                 <div className="mt-8 pt-6 border-t border-white/10">
                   <h4 className="text-sm font-semibold text-gray-400 mb-3">TAGS</h4>
                   <div className="flex flex-wrap gap-2">
                     {selectedArticle.tags.map(tag => (
                       <span key={tag} className="bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full text-sm transition-colors cursor-pointer">
                         #{tag}
                       </span>
                     ))}
                   </div>
                 </div>
                 
                 {/* Related Actions */}
                 <div className="mt-8 pt-6 border-t border-white/10">
                   <div className="flex flex-wrap gap-3">
                     <button 
                       onClick={() => shareArticle(selectedArticle)}
                       className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                     >
                       🔗 Share Article
                     </button>
                     <button 
                       onClick={() => viewSource(selectedArticle)}
                       className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                     >
                       🌐 View Source
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }