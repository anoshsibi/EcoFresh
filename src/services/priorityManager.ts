import type { CityAirQuality } from '../hooks/useAirQuality'

export interface UserPreferences {
  frequentCountries: string[]
  frequentCities: string[]
  lastSelected: string[]
  sessionHistory: Array<{
    city: string
    country: string
    timestamp: number
  }>
  totalSessions: number
}

export interface CachedCityData {
  data: CityAirQuality
  timestamp: number
  fetchCount: number
}

export interface CountryPriority {
  country: string
  countryCode: string
  priority: 'high' | 'medium' | 'low'
  score: number
  displayName: string
}

export interface CityPriority {
  city: string
  country: string
  priority: 'high' | 'medium' | 'low'
  score: number
}

class PriorityManager {
  private static instance: PriorityManager
  private preferences: UserPreferences
  private countryCache: Map<string, CachedCityData[]> = new Map()
  private cityCache: Map<string, CachedCityData> = new Map()
  private readonly CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
  private readonly STORAGE_KEY = 'ecofresh_preferences'

  constructor() {
    this.preferences = this.loadPreferences()
  }

  static getInstance(): PriorityManager {
    if (!PriorityManager.instance) {
      PriorityManager.instance = new PriorityManager()
    }
    return PriorityManager.instance
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error)
    }

    // Default preferences with popular countries
    return {
      frequentCountries: ['Canada', 'United States', 'United Kingdom', 'France', 'Germany'],
      frequentCities: [], // Not used anymore, but kept for compatibility
      lastSelected: [],
      sessionHistory: [],
      totalSessions: 0
    }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences))
    } catch (error) {
      console.warn('Failed to save preferences:', error)
    }
  }

  // Track city selection
  trackCitySelection(city: string, country: string): void {
    const now = Date.now()
    
    // Add to session history
    this.preferences.sessionHistory.push({
      city,
      country,
      timestamp: now
    })

    // Keep only last 50 selections
    if (this.preferences.sessionHistory.length > 50) {
      this.preferences.sessionHistory = this.preferences.sessionHistory.slice(-50)
    }

    // Update frequent countries
    this.updateFrequentCountries(country)

    this.savePreferences()
  }

  // Track user interactions - now focuses on countries
  trackCountrySelection(country: string): void {
    const now = Date.now()
    
    // Add to session history
    this.preferences.sessionHistory.push({
      city: '', // Not used for country-level tracking
      country,
      timestamp: now
    })

    // Keep only last 50 selections
    if (this.preferences.sessionHistory.length > 50) {
      this.preferences.sessionHistory = this.preferences.sessionHistory.slice(-50)
    }

    // Update frequent countries
    this.updateFrequentCountries(country)

    this.savePreferences()
  }

  private updateFrequentCountries(country: string): void {
    const countryCount = this.preferences.sessionHistory.filter(h => h.country === country).length
    
    if (countryCount >= 2 && !this.preferences.frequentCountries.includes(country)) {
      this.preferences.frequentCountries.push(country)
    }

    // Sort by frequency and keep top 10
    const countryCounts = this.preferences.frequentCountries.map(c => ({
      country: c,
      count: this.preferences.sessionHistory.filter(h => h.country === c).length
    }))

    this.preferences.frequentCountries = countryCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(c => c.country)
  }

  // Get prioritized city list
  getCityPriorities(allCities: Array<{name: string, country: string}>): CityPriority[] {
    const popularCities = ['New York', 'London', 'Paris', 'Tokyo', 'Toronto', 'Los Angeles', 'Berlin']
    
    return allCities.map(city => {
      let score = 0
      let priority: 'high' | 'medium' | 'low' = 'low'

      // Base popular cities (always high priority)
      if (popularCities.includes(city.name)) {
        score += 100
        priority = 'high'
      }

      // User's frequent countries
      if (this.preferences.frequentCountries.includes(city.country)) {
        score += 60
        priority = priority === 'low' ? 'medium' : priority
      }

      // Session history frequency
      const cityHistory = this.preferences.sessionHistory.filter(h => h.city === city.name)
      score += cityHistory.length * 20

      // Recent activity bonus
      const recentActivity = cityHistory.filter(h => Date.now() - h.timestamp < 24 * 60 * 60 * 1000)
      score += recentActivity.length * 40

      // Boost priority if recently accessed
      if (recentActivity.length > 0) {
        priority = 'high'
      }

      return {
        city: city.name,
        country: city.country,
        priority,
        score
      }
    }).sort((a, b) => b.score - a.score)
  }

  // Get prioritized country list
  getCountryPriorities(allCountries: Array<{name: string, code: string}>): CountryPriority[] {
    const popularCountries = ['Canada', 'United States', 'United Kingdom', 'France', 'Germany', 'Japan', 'Australia']
    
    return allCountries.map(country => {
      let score = 0
      let priority: 'high' | 'medium' | 'low' = 'low'

      // Base popular countries (always high priority)
      if (popularCountries.includes(country.name)) {
        score += 100
        priority = 'high'
      }

      // User's frequent countries
      if (this.preferences.frequentCountries.includes(country.name)) {
        score += 80
        priority = 'high'
      }

      // Session history frequency
      const countryHistory = this.preferences.sessionHistory.filter(h => h.country === country.name)
      score += countryHistory.length * 10

      // Recent activity bonus
      const recentActivity = countryHistory.filter(h => Date.now() - h.timestamp < 24 * 60 * 60 * 1000)
      score += recentActivity.length * 30

      // Boost priority if recently accessed
      if (recentActivity.length > 0) {
        priority = priority === 'low' ? 'medium' : priority
      }

      return {
        country: country.name,
        countryCode: country.code,
        priority,
        score,
        displayName: country.name
      }
    }).sort((a, b) => b.score - a.score)
  }

  // City-level cache management
  getCachedData(cityKey: string): CityAirQuality | null {
    const cached = this.cityCache.get(cityKey)
    if (!cached) return null

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cityCache.delete(cityKey)
      return null
    }

    return cached.data
  }

  setCachedData(cityKey: string, data: CityAirQuality): void {
    this.cityCache.set(cityKey, {
      data,
      timestamp: Date.now(),
      fetchCount: 1
    })
  }

  // Country-level cache management
  setCountryCache(country: string, citiesData: CityAirQuality[]): void {
    const cacheData = citiesData.map(city => ({
      data: city,
      timestamp: Date.now(),
      fetchCount: 1
    }))
    this.countryCache.set(country, cacheData)
  }

  getCountryCache(country: string): CityAirQuality[] | null {
    const cached = this.countryCache.get(country)
    if (!cached || cached.length === 0) return null

    // Check if cache is still valid
    const firstItem = cached[0]
    if (Date.now() - firstItem.timestamp > this.CACHE_DURATION) {
      this.countryCache.delete(country)
      return null
    }

    return cached.map(item => item.data)
  }

  isCountryCacheValid(country: string): boolean {
    const cached = this.countryCache.get(country)
    if (!cached || cached.length === 0) return false
    return Date.now() - cached[0].timestamp <= this.CACHE_DURATION
  }

  // Get high priority countries that should be loaded immediately
  getHighPriorityCountries(limit: number = 5): string[] {
    const priorities = this.getCountryPriorities([
      { name: 'Canada', code: 'CA' },
      { name: 'United States', code: 'US' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'Japan', code: 'JP' },
      { name: 'Australia', code: 'AU' },
      ...this.preferences.frequentCountries.map(c => ({ name: c, code: '' }))
    ])

    return priorities
      .filter(p => p.priority === 'high')
      .slice(0, limit)
      .map(p => p.country)
  }

  // Clear old cache entries
  cleanupCache(): void {
    const now = Date.now()
    
    // Clean city cache
    for (const [cityKey, cached] of this.cityCache.entries()) {
      if (now - cached.timestamp > this.CACHE_DURATION) {
        this.cityCache.delete(cityKey)
      }
    }
    
    // Clean country cache
    for (const [country, cached] of this.countryCache.entries()) {
      if (cached.length > 0 && now - cached[0].timestamp > this.CACHE_DURATION) {
        this.countryCache.delete(country)
      }
    }
  }

  // Get preferences for display
  getPreferences(): UserPreferences {
    return { ...this.preferences }
  }

  // Reset preferences (for testing)
  resetPreferences(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    this.preferences = this.loadPreferences()
    this.countryCache.clear()
    this.cityCache.clear()
  }
}

export default PriorityManager
