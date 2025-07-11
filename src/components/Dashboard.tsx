import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './Navbar'
import Footer from './Footer'
import SmartLoadingStatus from './SmartLoadingStatus'
import { EXPANDED_CITIES } from '../hooks/useAirQuality'
import { useSmartCountryAirQuality } from '../hooks/useSmartCountryAirQuality'

gsap.registerPlugin(ScrollTrigger)

const COUNTRY_NAMES: { [key: string]: string } = {
  'AE': 'United Arab Emirates',
  'AR': 'Argentina',
  'AT': 'Austria',
  'AU': 'Australia',
  'BE': 'Belgium',
  'BR': 'Brazil',
  'CA': 'Canada',
  'CD': 'Democratic Republic of Congo',
  'CH': 'Switzerland',
  'CL': 'Chile',
  'CN': 'China',
  'CO': 'Colombia',
  'CZ': 'Czech Republic',
  'DE': 'Germany',
  'DK': 'Denmark',
  'DZ': 'Algeria',
  'EG': 'Egypt',
  'ES': 'Spain',
  'ET': 'Ethiopia',
  'FI': 'Finland',
  'FR': 'France',
  'GB': 'United Kingdom',
  'GH': 'Ghana',
  'GR': 'Greece',
  'HU': 'Hungary',
  'ID': 'Indonesia',
  'IE': 'Ireland',
  'IL': 'Israel',
  'IN': 'India',
  'IQ': 'Iraq',
  'IR': 'Iran',
  'IT': 'Italy',
  'JP': 'Japan',
  'KE': 'Kenya',
  'KR': 'South Korea',
  'MA': 'Morocco',
  'MX': 'Mexico',
  'MY': 'Malaysia',
  'NG': 'Nigeria',
  'NL': 'Netherlands',
  'NO': 'Norway',
  'NZ': 'New Zealand',
  'PE': 'Peru',
  'PH': 'Philippines',
  'PL': 'Poland',
  'PT': 'Portugal',
  'SA': 'Saudi Arabia',
  'SE': 'Sweden',
  'SG': 'Singapore',
  'TH': 'Thailand',
  'TR': 'Turkey',
  'US': 'United States',
  'VE': 'Venezuela',
  'VN': 'Vietnam',
  'ZA': 'South Africa'
}

// State/Province name mapping for better display
const STATE_NAMES: { [key: string]: string } = {
  // US States
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia',
  
  // Canadian Provinces/Territories
  'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 'NB': 'New Brunswick',
  'NL': 'Newfoundland and Labrador', 'NS': 'Nova Scotia', 'NT': 'Northwest Territories',
  'NU': 'Nunavut', 'ON': 'Ontario', 'PE': 'Prince Edward Island', 'QC': 'Quebec',
  'SK': 'Saskatchewan', 'YT': 'Yukon'
}

const generateCountriesAndCities = () => {
  const countries: { [key: string]: { cities: string[], states: string[] } } = {}
  
  EXPANDED_CITIES.forEach(city => {
    const countryName = COUNTRY_NAMES[city.country] || city.country
    
    if (!countries[countryName]) {
      countries[countryName] = { cities: [], states: [] }
    }
    
    if (!countries[countryName].cities.includes(city.name)) {
      countries[countryName].cities.push(city.name)
    }
    
    // Add state/province if it exists and not already added
    if (city.state && city.state.trim() !== '' && !countries[countryName].states.includes(city.state)) {
      countries[countryName].states.push(city.state)
    }
  })
  
  // Sort cities and states
  Object.keys(countries).forEach(country => {
    countries[country].cities.sort()
    countries[country].states.sort()
  })
  
  return countries
}

// Generate dynamic countries from loaded API data
const generateCountriesFromAPIData = (apiCities: any[]) => {
  const countries: { [key: string]: { cities: string[], states: string[] } } = {}
  
  apiCities.forEach(city => {
    // Try to map country code to name, fallback to country code
    const countryName = COUNTRY_NAMES[city.country] || city.country
    
    if (!countries[countryName]) {
      countries[countryName] = { cities: [], states: [] }
    }
    
    if (!countries[countryName].cities.includes(city.city)) {
      countries[countryName].cities.push(city.city)
    }
    
    // Add state/province if it exists and not already added
    // For API data, we might not have state info, so we'll rely on static mapping
    if (city.state && city.state.trim() !== '' && !countries[countryName].states.includes(city.state)) {
      countries[countryName].states.push(city.state)
    }
  })
  
  // Enhance with static state data for countries that have states defined
  EXPANDED_CITIES.forEach(city => {
    const countryName = COUNTRY_NAMES[city.country] || city.country
    
    if (countries[countryName] && city.state && city.state.trim() !== '') {
      if (!countries[countryName].states.includes(city.state)) {
        countries[countryName].states.push(city.state)
      }
    }
  })
  
  // Sort cities and states
  Object.keys(countries).forEach(country => {
    countries[country].cities.sort()
    countries[country].states.sort()
  })
  
  return countries
}

const COUNTRIES = generateCountriesAndCities()

interface CityData {
  name: string
  aqi: number
  status: string
  coords: { lat: number; lng: number }
}

export default function Dashboard() {
  const { 
    loading: apiLoading, 
    error: apiError, 
    loadCountryOnDemand,
    getAllLoadedCities,
    trackCountrySelection,
    loadingProgress
  } = useSmartCountryAirQuality()
  
  // Get all loaded cities for compatibility with existing code
  const allCitiesData = getAllLoadedCities()
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [monitoredCitiesData, setMonitoredCitiesData] = useState<CityData[]>([])
  const [countryData, setCountryData] = useState<CityData[]>([])
  const [loading, setLoading] = useState(false)
  const [dynamicCountries, setDynamicCountries] = useState<{ [key: string]: { cities: string[], states: string[] } }>(COUNTRIES)

  // Update dynamic countries when API data changes
  useEffect(() => {
    if (allCitiesData && allCitiesData.length > 0) {
      const apiCountries = generateCountriesFromAPIData(allCitiesData)
      
      setDynamicCountries(prevCountries => {
        // Merge API data with static data for comprehensive coverage
        const merged = { ...prevCountries }
        
        Object.keys(apiCountries).forEach(country => {
          if (!merged[country]) {
            merged[country] = { cities: [], states: [] }
          }
          
          // Add cities from API that aren't already present
          apiCountries[country].cities.forEach(city => {
            if (!merged[country].cities.includes(city)) {
              merged[country].cities.push(city)
            }
          })
          
          // Add states from API that aren't already present  
          apiCountries[country].states.forEach(state => {
            if (!merged[country].states.includes(state)) {
              merged[country].states.push(state)
            }
          })
          
          // Re-sort after merging
          merged[country].cities.sort()
          merged[country].states.sort()
        })
        
        console.log('Final merged countries:', merged)        
        return merged
      })
    }
  }, [allCitiesData])

  // Auto-refresh monitored cities data every 30 seconds
  useEffect(() => {
    if (monitoredCitiesData.length > 0) {
      const interval = setInterval(() => {
        // Refresh priority data instead of all data
        console.log('Auto-refreshing priority data...')
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [monitoredCitiesData.length])

  // Generate real location data for a city using API data
  const generateCityData = (cityName: string, countryName: string): CityData | null => {
    // Find the city in our API data with more flexible matching
    const apiCityData = allCitiesData.find(city => {
      const cityLower = cityName.toLowerCase()
      const apiCityLower = city.city.toLowerCase()
      const apiLocationLower = city.location.toLowerCase()
      
      return apiCityLower.includes(cityLower) || 
             cityLower.includes(apiCityLower) ||
             apiLocationLower.includes(cityLower) ||
             cityLower.includes(apiLocationLower)
    })
    
    if (apiCityData) {
      return {
        name: cityName,
        aqi: apiCityData.aqi,
        status: apiCityData.status,
        coords: {
          lat: apiCityData.coordinates?.lat || 0,
          lng: apiCityData.coordinates?.lon || 0
        }
      }
    }
    
    // If API is still loading, show loading status
    if (apiLoading) {
      const baseCoords = getCityCoordinates(cityName, countryName)
      return {
        name: cityName,
        aqi: 0,
        status: 'Loading...',
        coords: baseCoords
      }
    }
    
    // Fallback: use coordinates but default AQI values if API data not available
    const baseCoords = getCityCoordinates(cityName, countryName)
    return {
      name: cityName,
      aqi: 0, // No data available
      status: 'N/A',
      coords: baseCoords
    }
  }

  // Get mock coordinates for cities (you can enhance this with real data)
  const getCityCoordinates = (cityName: string, _countryName: string) => {
    // This is simplified - in a real app you'd have a proper geocoding service
    const coords = {
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'London': { lat: 51.5074, lng: -0.1278 },
      'Paris': { lat: 48.8566, lng: 2.3522 },
      'Tokyo': { lat: 35.6762, lng: 139.6503 },
      'Beijing': { lat: 39.9042, lng: 116.4074 },
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Sydney': { lat: -33.8688, lng: 151.2093 },
      'Mexico City': { lat: 19.4326, lng: -99.1332 },
      'Toronto': { lat: 43.6532, lng: -79.3832 }
    }
    return coords[cityName as keyof typeof coords] || { lat: 0, lng: 0 }
  }

  // Handle country selection with smart loading
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setSelectedState('')
    setSelectedCities([])
    
    if (country) {
      setLoading(true)
      
      // Load all cities for this country using the smart system
      loadCountryOnDemand(country).then(() => {
        // Generate display data for cities in the country
        const cities = dynamicCountries[country]?.cities || []
        const newCountryData = cities.slice(0, 10).map(city => generateCityData(city, country)).filter(Boolean) as CityData[]
        setCountryData(newCountryData)
        
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
    } else {
      setCountryData([])
    }
  }

  // Handle state/city selection
  const handleStateChange = (value: string) => {
    setSelectedState(value)
    setSelectedCities([])
    
    if (!selectedCountry || !value) {
      return
    }

    const hasStates = dynamicCountries[selectedCountry]?.states?.length > 0

    if (hasStates) {
      // Country has states - handle state selection
      if (value === 'all') {
        // Show all cities for the country
        const cities = dynamicCountries[selectedCountry]?.cities || []
        const newCountryData = cities.slice(0, 10).map(city => generateCityData(city, selectedCountry)).filter(Boolean) as CityData[]
        setCountryData(newCountryData)
      } else {
        // Filter cities by selected state using static data mapping
        const stateCities = EXPANDED_CITIES
          .filter(city => {
            const countryName = COUNTRY_NAMES[city.country] || city.country
            return countryName === selectedCountry && city.state === value
          })
          .map(city => city.name)
        const newStateData = stateCities.slice(0, 10).map(city => generateCityData(city, selectedCountry)).filter(Boolean) as CityData[]
        setCountryData(newStateData)
        // Automatically pin all cities in the selected state for monitoring
        setMonitoredCitiesData(prevData => {
          const newCities = stateCities
            .map(cityName => generateCityData(cityName, selectedCountry))
            .filter(cityData => cityData && !prevData.some(c => c.name === cityData!.name)) as CityData[]
          return [...prevData, ...newCities]
        })
        setSelectedCities(prev => {
          const newCityNames = stateCities.filter(cityName => !prev.includes(cityName))
          return [...prev, ...newCityNames]
        })
      }
    } else {
      // Country has no states - handle individual city selection
      const selectedCityData = generateCityData(value, selectedCountry)
      if (selectedCityData) {
        setCountryData([selectedCityData])
        // Automatically pin for monitoring
        setMonitoredCitiesData(prevData => {
          if (prevData.some(city => city.name === value)) {
            return prevData
          }
          return [...prevData, selectedCityData]
        })
        setSelectedCities(prev => {
          if (prev.includes(value)) {
            return prev
          }
          return [...prev, value]
        })
      }
    }
  }

  // Get available states for selected country, or cities if no states
  const getAvailableStatesOrCities = () => {
    if (!selectedCountry) return []
    const states = dynamicCountries[selectedCountry]?.states || []
    
    if (states.length > 0) {
      // Country has states - return states with proper display names
      return states.map(state => ({
        code: state,
        name: STATE_NAMES[state] || state,
        type: 'state'
      }))
    } else {
      // Country has no states - return cities as options
      const cities = dynamicCountries[selectedCountry]?.cities || []
      return cities.map(city => ({
        code: city,
        name: city,
        type: 'city'
      }))
    }
  }

  // Get display name for a state
  const getStateDisplayName = (stateCode: string) => {
    return STATE_NAMES[stateCode] || stateCode
  }

  // Handle city selection/deselection with smart tracking
  const handleCitySelection = (cityName: string) => {
    setSelectedCities(prev => {
      const isSelected = prev.includes(cityName)
      if (isSelected) {
        // Remove city from monitoring
        setMonitoredCitiesData(prevData => prevData.filter(city => city.name !== cityName))
        return prev.filter(city => city !== cityName)
      } else {
        // Track country selection for learning (since we're country-focused now)
        trackCountrySelection(selectedCountry)
        
        // Add city to monitoring - avoid duplicates by checking if already monitored
        setMonitoredCitiesData(prevData => {
          // Check if city is already being monitored
          if (prevData.some(city => city.name === cityName)) {
            return prevData // Already exists, don't add duplicate
          }
          
          // Try to find from loaded API data first
          const existingCity = allCitiesData.find(city => city.city.includes(cityName))
          if (existingCity) {
            const cityData = {
              name: cityName,
              aqi: existingCity.aqi,
              status: existingCity.status,
              coords: {
                lat: existingCity.coordinates?.lat || 0,
                lng: existingCity.coordinates?.lon || 0
              }
            }
            return [...prevData, cityData]
          } else {
            // Fallback to generated data
            const fallbackData = generateCityData(cityName, selectedCountry)
            if (fallbackData) {
              return [...prevData, fallbackData]
            }
            return prevData
          }
        })
        
        return [...prev, cityName]
      }
    })
  }

  // Get available countries (dynamically updated)
  const availableCountries = Object.keys(dynamicCountries).sort()

  // Initialize animations
  useEffect(() => {
    const tl = gsap.timeline()
    
    tl.fromTo('.dashboard-hero', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    )
    .fromTo('.dashboard-controls',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo('.dashboard-content',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    )

    // Animate cards when they appear
    ScrollTrigger.batch('.aqi-card', {
      onEnter: (elements) => {
        gsap.fromTo(elements, 
          { y: 50, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
        )
      },
      start: 'top bottom-=100',
      once: true
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Refresh country data when API data updates
  useEffect(() => {
    if (selectedCountry && !apiLoading) {
      const cities = dynamicCountries[selectedCountry]?.cities || []
      const newCountryData = cities.slice(0, 10).map(city => generateCityData(city, selectedCountry)).filter(Boolean) as CityData[]
      setCountryData(newCountryData)
    }
  }, [allCitiesData, selectedCountry, apiLoading, dynamicCountries])

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="dashboard-hero pt-20 pb-12 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Global Air Quality Dashboard
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Monitor air quality by country, state, and city. Monitor multiple locations for real-time insights.
          </p>
        </div>
      </div>

      {/* Dashboard Controls */}
      <div className="dashboard-controls bg-slate-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Smart Loading Progress */}
          <SmartLoadingStatus 
            loadingProgress={{
              loaded: loadingProgress.loadedCountries,
              total: loadingProgress.totalCountries,
              currentBatch: `${loadingProgress.currentCountry} ${loadingProgress.currentCity ? `- ${loadingProgress.currentCity}` : ''}`
            }}
            isLoading={apiLoading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country Selection */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 outline-none transition-all"
              >
                <option value="">Select a country</option>
                {availableCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* State/Province Selection */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                {selectedCountry && dynamicCountries[selectedCountry]?.states?.length > 0 ? 'State/Province' : 'City'}
                {selectedCountry && getAvailableStatesOrCities().length > 0 && (
                  <span className="text-gray-400 text-xs ml-2">({getAvailableStatesOrCities().length} available)</span>
                )}
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                disabled={!selectedCountry}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 outline-none transition-all disabled:opacity-50"
              >
                {!selectedCountry ? (
                  <option value="">Select a country first</option>
                ) : getAvailableStatesOrCities().length === 0 ? (
                  <option value="">Loading...</option>
                ) : (
                  <>
                    <option value="">
                      {dynamicCountries[selectedCountry]?.states?.length > 0 
                        ? 'Select a state/province' 
                        : 'Select a city'
                      }
                    </option>
                    {dynamicCountries[selectedCountry]?.states?.length > 0 && (
                      <option value="all">All Cities</option>
                    )}
                    {getAvailableStatesOrCities().map(item => (
                      <option key={item.code} value={item.code}>{item.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* API Loading State */}
          {apiLoading && (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading real-time air quality data from multiple APIs...</p>
              </div>
            </div>
          )}

          {/* API Error State */}
          {apiError && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="text-red-400 text-sm">
                  <strong>API Error:</strong> {apiError}
                  <button 
                    onClick={() => window.location.reload()}
                    className="ml-4 px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-white text-xs transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {(loading || apiLoading) && !apiError && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          )}

          {/* Monitored Cities Section */}
          {monitoredCitiesData.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Monitored Cities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {monitoredCitiesData.map((city, index) => (
                  <div key={index} className="aqi-card bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white">{city.name}</h3>
                      <button
                        onClick={() => handleCitySelection(city.name)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${
                      city.aqi === 0 ? 'text-gray-400' :
                      city.aqi <= 50 ? 'text-green-400' :
                      city.aqi <= 100 ? 'text-yellow-400' :
                      city.aqi <= 150 ? 'text-orange-400' :
                      city.aqi <= 200 ? 'text-red-400' :
                      'text-purple-400'
                    }`}>
                      {city.aqi === 0 ? 'N/A' : city.aqi}
                    </div>
                    <div className="text-gray-300">{city.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Country Cities Section */}
          {countryData.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedState && dynamicCountries[selectedCountry]?.states?.length === 0 ? (
                  // Single city selected for country without states
                  `${selectedState}`
                ) : (
                  // Country with states or all cities
                  <>
                    Cities in {selectedCountry}
                    {selectedState && selectedState !== 'all' && (
                      <span className="text-blue-400"> - {getStateDisplayName(selectedState)}</span>
                    )}
                  </>
                )}
                <span className="text-gray-400 text-lg ml-3">({countryData.length} cities)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countryData.map((city, index) => (
                  <div key={index} className="aqi-card bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-400 transition-colors cursor-pointer"
                       onClick={() => handleCitySelection(city.name)}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white">{city.name}</h3>
                      <div className={`text-sm px-2 py-1 rounded ${
                        selectedCities.includes(city.name) 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-700 text-gray-300'
                      }`}>
                        {selectedCities.includes(city.name) ? 'Monitoring' : 'Click to Monitor'}
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${
                      city.aqi === 0 ? 'text-gray-400' :
                      city.aqi <= 50 ? 'text-green-400' :
                      city.aqi <= 100 ? 'text-yellow-400' :
                      city.aqi <= 150 ? 'text-orange-400' :
                      city.aqi <= 200 ? 'text-red-400' :
                      'text-purple-400'
                    }`}>
                      {city.aqi === 0 ? 'N/A' : city.aqi}
                    </div>
                    <div className="text-gray-300">{city.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !apiLoading && countryData.length === 0 && monitoredCitiesData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Welcome to the Global Air Quality Dashboard
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-4">
                Select a country above to view real-time air quality data for cities around the world. 
                Click on any city to add it to your monitoring list.
              </p>
              {!apiLoading && allCitiesData.length > 0 && (
                <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg inline-block">
                  <p className="text-green-400 text-sm">
                    ✅ Real-time data loaded for {allCitiesData.length} cities from OpenWeatherMap & OpenAQ APIs
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
