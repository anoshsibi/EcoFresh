import { useState, useEffect, useCallback } from 'react'
import type { CityAirQuality } from './useAirQuality'
import { getAirQualityFromMultipleAPIs, getAQIStatus, convertToEPAScale, EXPANDED_CITIES } from './useAirQuality'
import PriorityManager from '../services/priorityManager'

interface SmartAirQualityState {
  cities: CityAirQuality[]
  loading: boolean
  error: string | null
  loadingProgress: {
    loaded: number
    total: number
    currentBatch: string
  }
}

export const useSmartAirQuality = () => {
  const [state, setState] = useState<SmartAirQualityState>({
    cities: [],
    loading: true,
    error: null,
    loadingProgress: {
      loaded: 0,
      total: 0,
      currentBatch: 'Initializing...'
    }
  })

  const priorityManager = PriorityManager.getInstance()

  // Function to create city key for caching
  const createCityKey = (cityName: string, country: string): string => {
    return `${cityName.toLowerCase()}-${country.toLowerCase()}`
  }

  // Function to fetch single city data
  const fetchCityData = useCallback(async (city: typeof EXPANDED_CITIES[0]): Promise<CityAirQuality | null> => {
    const cityKey = createCityKey(city.name, city.country)
    
    // Check cache first
    const cachedData = priorityManager.getCachedData(cityKey)
    if (cachedData) {
      console.log(`Using cached data for ${city.name}`)
      return cachedData
    }

    try {
      const cityQuery = city.state 
        ? `${city.name}, ${city.state}, ${city.country}` 
        : `${city.name}, ${city.country}`
      
      const multiApiData = await getAirQualityFromMultipleAPIs(cityQuery)
      
      if (!multiApiData.coordinates) {
        console.warn(`Could not find coordinates for ${city.name}`)
        return null
      }

      // Use OpenWeatherMap data as primary, OpenAQ as fallback
      let displayAQI = 0
      let aqiInfo = { status: 'Unknown', color: '#6b7280', bgClass: 'bg-gray-500/20 text-gray-400' }
      let details = { pm25: 'N/A', pm10: 'N/A', o3: 'N/A' }

      if (multiApiData.openweather?.list?.[0]) {
        const currentData = multiApiData.openweather.list[0]
        aqiInfo = getAQIStatus(currentData.main.aqi)
        displayAQI = convertToEPAScale(currentData.main.aqi, currentData.components.pm2_5)
        details = {
          pm25: `${Math.round(currentData.components.pm2_5)} μg/m³`,
          pm10: `${Math.round(currentData.components.pm10)} μg/m³`,
          o3: `${Math.round(currentData.components.o3)} μg/m³`
        }
      } else if (multiApiData.openaq?.processed) {
        const openaqData = multiApiData.openaq.processed
        const pm25 = openaqData.pm25
        displayAQI = Math.round(pm25 * 2)
        
        if (displayAQI <= 50) aqiInfo = { status: 'Good', color: '#22c55e', bgClass: 'bg-green-500/20 text-green-400' }
        else if (displayAQI <= 100) aqiInfo = { status: 'Moderate', color: '#f97316', bgClass: 'bg-orange-500/20 text-orange-400' }
        else if (displayAQI <= 150) aqiInfo = { status: 'Poor', color: '#ef4444', bgClass: 'bg-red-500/20 text-red-400' }
        else aqiInfo = { status: 'Very Poor', color: '#dc2626', bgClass: 'bg-red-600/20 text-red-300' }
        
        details = {
          pm25: `${Math.round(openaqData.pm25)} μg/m³`,
          pm10: `${Math.round(openaqData.pm10)} μg/m³`,
          o3: `${Math.round(openaqData.o3)} μg/m³`
        }
      } else {
        return null
      }

      const result: CityAirQuality = {
        city: city.fullName,
        location: cityQuery,
        aqi: displayAQI,
        status: aqiInfo.status,
        color: aqiInfo.color,
        bgClass: aqiInfo.bgClass,
        details,
        coordinates: multiApiData.coordinates
      }

      // Cache the result
      priorityManager.setCachedData(cityKey, result)
      
      return result
    } catch (error) {
      console.error(`Error fetching data for ${city.name}:`, error)
      return null
    }
  }, [priorityManager])

  // Function to load priority cities
  const loadPriorityCities = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      loadingProgress: { ...prev.loadingProgress, currentBatch: 'Loading priority cities...' }
    }))

    // Get priority cities (top 15 for initial load)
    const priorities = priorityManager.getCityPriorities(
      EXPANDED_CITIES.map(c => ({ name: c.name, country: c.country }))
    )

    const highPriorityCities = priorities
      .filter(p => p.priority === 'high')
      .slice(0, 15)
      .map(p => EXPANDED_CITIES.find(c => c.name === p.city))
      .filter(Boolean) as typeof EXPANDED_CITIES

    console.log('Loading high priority cities:', highPriorityCities.map(c => c.name))

    setState(prev => ({
      ...prev,
      loadingProgress: { 
        loaded: 0, 
        total: highPriorityCities.length,
        currentBatch: 'Loading priority cities...'
      }
    }))

    const results: CityAirQuality[] = []

    // Load priority cities with progress updates
    for (let i = 0; i < highPriorityCities.length; i++) {
      const city = highPriorityCities[i]
      
      setState(prev => ({
        ...prev,
        loadingProgress: {
          ...prev.loadingProgress,
          loaded: i,
          currentBatch: `Loading ${city.name}...`
        }
      }))

      const result = await fetchCityData(city)
      if (result) {
        results.push(result)
        
        // Update UI immediately with each loaded city
        setState(prev => ({
          ...prev,
          cities: [...results]
        }))
      }

      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    setState(prev => ({
      ...prev,
      loading: false,
      loadingProgress: {
        loaded: results.length,
        total: highPriorityCities.length,
        currentBatch: 'Priority cities loaded'
      }
    }))

    console.log(`Loaded ${results.length} priority cities`)
  }, [fetchCityData, priorityManager])

  // Function to load data for a specific city on demand
  const loadCityOnDemand = useCallback(async (cityName: string): Promise<CityAirQuality | null> => {
    const city = EXPANDED_CITIES.find(c => c.name === cityName)
    if (!city) return null

    const cityKey = createCityKey(city.name, city.country)
    
    // Check if already loaded
    const existing = state.cities.find(c => c.city === city.fullName)
    if (existing) return existing

    // Check cache
    const cached = priorityManager.getCachedData(cityKey)
    if (cached) {
      setState(prev => ({
        ...prev,
        cities: [...prev.cities, cached]
      }))
      return cached
    }

    // Fetch new data
    const result = await fetchCityData(city)
    if (result) {
      setState(prev => ({
        ...prev,
        cities: [...prev.cities, result]
      }))
    }

    return result
  }, [state.cities, fetchCityData, priorityManager])

  // Function to load all cities for a country
  const loadCountryCities = useCallback(async (countryName: string, maxCities: number = 10): Promise<void> => {
    const countryCities = EXPANDED_CITIES
      .filter(c => c.country === countryName)
      .slice(0, maxCities)

    setState(prev => ({
      ...prev,
      loadingProgress: {
        loaded: 0,
        total: countryCities.length,
        currentBatch: `Loading ${countryName} cities...`
      }
    }))

    for (let i = 0; i < countryCities.length; i++) {
      const city = countryCities[i]
      
      // Skip if already loaded
      const existing = state.cities.find(c => c.city === city.fullName)
      if (existing) continue

      setState(prev => ({
        ...prev,
        loadingProgress: {
          ...prev.loadingProgress,
          loaded: i,
          currentBatch: `Loading ${city.name}...`
        }
      }))

      const result = await loadCityOnDemand(city.name)
      if (result) {
        // Track user interaction
        priorityManager.trackCountrySelection(city.name, countryName)
      }

      await new Promise(resolve => setTimeout(resolve, 300))
    }

    setState(prev => ({
      ...prev,
      loadingProgress: {
        ...prev.loadingProgress,
        loaded: countryCities.length,
        currentBatch: `${countryName} cities loaded`
      }
    }))
  }, [state.cities, loadCityOnDemand, priorityManager])

  // Initialize on mount
  useEffect(() => {
    loadPriorityCities()
    
    // Cleanup old cache entries
    priorityManager.cleanupCache()
  }, [loadPriorityCities, priorityManager])

  return {
    ...state,
    loadCityOnDemand,
    loadCountryCities,
    refreshPriorityData: loadPriorityCities,
    trackCountrySelection: priorityManager.trackCountrySelection.bind(priorityManager),
    getPreferences: priorityManager.getPreferences.bind(priorityManager)
  }
}
