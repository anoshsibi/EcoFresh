import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './Navbar'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

// Extended country and city data
const COUNTRIES = {
  'United States': {
    states: {
      'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland', 'Fresno', 'Long Beach', 'Santa Ana', 'Anaheim', 'Bakersfield', 'San Jose', 'Riverside', 'Stockton', 'Irvine', 'Chula Vista', 'Fremont', 'San Bernardino', 'Modesto', 'Fontana', 'Oxnard', 'Moreno Valley', 'Huntington Beach', 'Glendale', 'Santa Clarita', 'Garden Grove'],
              'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica', 'White Plains', 'Troy', 'Niagara Falls', 'Binghamton', 'Rome', 'Oswego', 'Ithaca', 'Watertown', 'Cortland', 'Elmira'],
        'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock', 'Laredo', 'Garland', 'Irving', 'Amarillo', 'Grand Prairie', 'Brownsville', 'McKinney', 'Frisco', 'Pasadena', 'Mesquite', 'Killeen', 'McAllen', 'Carrollton', 'Midland', 'Waco'],
      'Florida': ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral'],
      'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria', 'Elgin', 'Waukegan', 'Cicero']
    }
  },
  'India': {
    states: {
      'Delhi': ['New Delhi', 'Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'Shahdara', 'South West Delhi', 'North West Delhi', 'North East Delhi', 'Rohini', 'Dwarka', 'Janakpuri', 'Lajpat Nagar', 'Karol Bagh', 'Connaught Place', 'Saket', 'Vasant Kunj', 'Pitampura'],
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Bhiwandi', 'Amravati', 'Nanded', 'Kolhapur', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Jalgaon', 'Navi Mumbai', 'Kalyan', 'Vasai-Virar', 'Ulhasnagar', 'Sangli', 'Malegaon', 'Jalna'],
      'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul'],
      'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman', 'Kharagpur', 'Haldia', 'Raiganj']
    }
  },
  'China': {
    states: {
      'Beijing': ['Beijing', 'Chaoyang', 'Haidian', 'Fengtai', 'Shijingshan', 'Mentougou', 'Fangshan', 'Tongzhou', 'Shunyi', 'Changping'],
      'Shanghai': ['Shanghai', 'Pudong', 'Huangpu', 'Xuhui', 'Changning', 'Jing\'an', 'Putuo', 'Hongkou', 'Yangpu', 'Minhang'],
      'Guangdong': ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Zhongshan', 'Zhuhai', 'Jiangmen', 'Huizhou', 'Zhaoqing', 'Shantou'],
      'Jiangsu': ['Nanjing', 'Suzhou', 'Wuxi', 'Changzhou', 'Nantong', 'Yangzhou', 'Xuzhou', 'Zhenjiang', 'Huai\'an', 'Yancheng'],
      'Zhejiang': ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing', 'Huzhou', 'Shaoxing', 'Jinhua', 'Quzhou', 'Zhoushan', 'Taizhou']
    }
  },
  'United Kingdom': {
    states: {
      'England': ['London', 'Birmingham', 'Manchester', 'Leeds', 'Liverpool', 'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Leicester'],
      'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Stirling', 'Perth', 'Inverness', 'Paisley', 'East Kilbride', 'Kilmarnock'],
      'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry', 'Caerphilly', 'Bridgend', 'Neath', 'Port Talbot', 'Cwmbran'],
      'Northern Ireland': ['Belfast', 'Derry', 'Lisburn', 'Newtownabbey', 'Bangor', 'Craigavon', 'Castlereagh', 'Ballymena', 'Newtownards', 'Carrickfergus']
    }
  },
  'Canada': {
    states: {
      'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Kitchener', 'Windsor', 'Oshawa', 'Barrie', 'Guelph', 'Kingston'],
      'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Trois-Rivières', 'Terrebonne', 'Saint-Jean-sur-Richelieu'],
      'British Columbia': ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford', 'Coquitlam', 'Saanich', 'Delta', 'Kelowna', 'Langley'],
      'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'St. Albert', 'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc'],
      'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie', 'Winkler', 'Selkirk', 'Morden', 'Dauphin', 'Flin Flon']
    }
  }
}

// Mock AQI data generator
const generateMockAQI = () => Math.floor(Math.random() * 300) + 1

interface CityData {
  name: string
  state: string
  aqi: number
  status: string
  color: string
  bgClass: string
}

export default function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [monitoredCitiesData, setMonitoredCitiesData] = useState<CityData[]>([])
  const [countryData, setCountryData] = useState<CityData[]>([])
  const [stateData, setStateData] = useState<CityData[]>([])
  const [loading, setLoading] = useState(false)

  // Auto-refresh monitored cities data every 30 seconds
  useEffect(() => {
    if (monitoredCitiesData.length > 0) {
      const interval = setInterval(() => {
        setMonitoredCitiesData(prev => 
          prev.map(city => {
            const newAqi = generateMockAQI()
            const updatedAQI = getAQIStatus(newAqi)
            return { ...city, aqi: newAqi, ...updatedAQI }
          })
        )
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [monitoredCitiesData.length])

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { status: 'Good', color: '#10b981', bgClass: 'bg-emerald-500/20 text-emerald-400' }
    if (aqi <= 100) return { status: 'Moderate', color: '#22c55e', bgClass: 'bg-green-500/20 text-green-400' }
    if (aqi <= 150) return { status: 'Unhealthy for Sensitive', color: '#f97316', bgClass: 'bg-orange-500/20 text-orange-400' }
    if (aqi <= 200) return { status: 'Unhealthy', color: '#ef4444', bgClass: 'bg-red-500/20 text-red-400' }
    return { status: 'Very Unhealthy', color: '#dc2626', bgClass: 'bg-red-600/20 text-red-300' }
  }

  const generateCountryData = (country: string) => {
    const countryInfo = COUNTRIES[country as keyof typeof COUNTRIES]
    if (!countryInfo) return []

    const allCities: CityData[] = []
    Object.entries(countryInfo.states).forEach(([state, cities]) => {
      (cities as string[]).forEach((city: string) => {
        const aqi = generateMockAQI()
        const aqiInfo = getAQIStatus(aqi)
        allCities.push({
          name: city,
          state,
          aqi,
          ...aqiInfo
        })
      })
    })

    return allCities.sort((a: CityData, b: CityData) => a.aqi - b.aqi)
  }

  const generateStateData = (country: string, state: string) => {
    const countryInfo = COUNTRIES[country as keyof typeof COUNTRIES]
    if (!countryInfo || !(countryInfo.states as any)[state]) return []

    const cities = (countryInfo.states as any)[state] as string[]
    return cities.map((city: string) => {
      const aqi = generateMockAQI()
      const aqiInfo = getAQIStatus(aqi)
      return {
        name: city,
        state,
        aqi,
        ...aqiInfo
      }
    }).sort((a: CityData, b: CityData) => a.aqi - b.aqi)
  }

  const handleCountrySelect = async (country: string) => {
    if (!country) {
      setCountryData([])
      setSelectedState('')
      setStateData([])
      return
    }

    setLoading(true)
    setSelectedCountry(country)
    setSelectedState('')
    setStateData([])
    
    // Simulate API delay
    setTimeout(() => {
      const data = generateCountryData(country)
      setCountryData(data)
      setLoading(false)
    }, 800)
  }

  const handleStateSelect = async (state: string) => {
    if (!state || !selectedCountry) {
      setStateData([])
      return
    }

    setLoading(true)
    setSelectedState(state)
    
    // Simulate API delay
    setTimeout(() => {
      const data = generateStateData(selectedCountry, state)
      setStateData(data)
      setLoading(false)
    }, 500)
  }

  const addCityToMonitor = (city: CityData) => {
    if (!selectedCities.includes(city.name)) {
      setSelectedCities([...selectedCities, city.name])
      // Add city with updated live data
      const liveCity = {
        ...city,
        aqi: generateMockAQI(),
      }
      const updatedAQI = getAQIStatus(liveCity.aqi)
      setMonitoredCitiesData([...monitoredCitiesData, { ...liveCity, ...updatedAQI }])
    }
  }

  const removeCityFromMonitor = (cityName: string) => {
    setSelectedCities(selectedCities.filter(city => city !== cityName))
    setMonitoredCitiesData(monitoredCitiesData.filter(city => city.name !== cityName))
  }

  const topCleanCities = countryData.slice(0, 10)
  const topPollutedCities = countryData.slice(-10).reverse()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
      <Navbar currentPage="dashboard" />
      <div className="pt-20 px-5">
        <div className="container max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Interactive Air Quality Dashboard
            </h1>
            <p className="text-xl text-white/70 max-w-[700px] mx-auto">
              Explore air quality data by country, state, and city. Monitor multiple locations and get real-time insights.
            </p>
          </div>

          {/* Control Panel */}
          <div className="glass-effect rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Select Location</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 mb-2">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountrySelect(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#00d4ff] focus:outline-none"
                >
                  <option value="">Select a country</option>
                  {Object.keys(COUNTRIES).map(country => (
                    <option key={country} value={country} className="bg-gray-900">{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-2">State/Province</label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateSelect(e.target.value)}
                  disabled={!selectedCountry}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#00d4ff] focus:outline-none disabled:opacity-50"
                >
                  <option value="">Select a state</option>
                  {selectedCountry && COUNTRIES[selectedCountry as keyof typeof COUNTRIES] && 
                    Object.keys(COUNTRIES[selectedCountry as keyof typeof COUNTRIES].states).map(state => (
                      <option key={state} value={state} className="bg-gray-900">{state}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>

          {/* Monitored Cities with Live Data */}
          {monitoredCitiesData.length > 0 && (
            <div className="glass-effect rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="animate-pulse">🔴</span> Your Monitored Cities - Live Data
                </h3>
                <button
                  onClick={() => {
                    setMonitoredCitiesData(prev => 
                      prev.map(city => {
                        const newAqi = generateMockAQI()
                        const updatedAQI = getAQIStatus(newAqi)
                        return { ...city, aqi: newAqi, ...updatedAQI }
                      })
                    )
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff]/20 border border-[#00d4ff]/30 rounded-full text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {monitoredCitiesData.map(city => (
                  <div key={city.name} className="glass-effect rounded-xl p-6 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{city.name}</h4>
                        <p className="text-white/60 text-sm">{city.state}</p>
                      </div>
                      <button
                        onClick={() => removeCityFromMonitor(city.name)}
                        className="text-red-400 hover:text-red-300 text-xl"
                        title="Remove from monitoring"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${city.bgClass}`}>
                        {city.aqi}
                      </div>
                      <div className={`text-sm font-semibold ${city.bgClass}`}>
                        {city.status}
                      </div>
                      <div className="mt-3 text-xs text-white/60">
                        Last updated: {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((city.aqi / 300) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="glass-effect rounded-2xl p-8 mb-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white/70">Loading air quality data...</p>
            </div>
          )}

          {/* Country Overview */}
          {selectedCountry && countryData.length > 0 && !loading && (
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-8">Air Quality Overview: {selectedCountry}</h3>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="glass-effect rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#00d4ff] mb-2">{countryData.length}</div>
                  <div className="text-white/70 text-sm">Total Cities</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#22c55e] mb-2">
                    {Math.round(countryData.reduce((sum, city) => sum + city.aqi, 0) / countryData.length)}
                  </div>
                  <div className="text-white/70 text-sm">Average AQI</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#10b981] mb-2">
                    {countryData.filter(city => city.aqi <= 100).length}
                  </div>
                  <div className="text-white/70 text-sm">Good Air Quality</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#ef4444] mb-2">
                    {countryData.filter(city => city.aqi > 150).length}
                  </div>
                  <div className="text-white/70 text-sm">Poor Air Quality</div>
                </div>
              </div>
            </div>
          )}

          {/* State Data */}
          {selectedState && stateData.length > 0 && !loading && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Cities in {selectedState}, {selectedCountry}
              </h3>
              <div className="glass-effect rounded-2xl p-8">
                <div className="grid gap-4">
                  {stateData.map((city, index) => (
                    <div key={city.name} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium text-lg">{city.name}</div>
                          <div className="text-white/60">AQI: {city.aqi} - {city.status}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-full font-semibold ${city.bgClass}`}>
                          {city.aqi}
                        </div>
                        <button
                          onClick={() => addCityToMonitor(city)}
                          className="bg-[#00d4ff] hover:bg-[#00d4ff]/80 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300"
                        >
                          + Monitor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Default State */}
          {!selectedCountry && (
            <div className="glass-effect rounded-2xl p-12 text-center">
              <div className="text-6xl mb-6 text-blue-400 font-bold">WORLD</div>
              <h3 className="text-2xl font-bold text-white mb-4">Select a Country to Get Started</h3>
              <p className="text-white/70 mb-8">Choose a country from the dropdown above to explore air quality data and monitor cities of your choice.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 bg-white/5 rounded-xl">
                  <div className="text-[#00d4ff] text-3xl font-bold mb-2">CITIES</div>
                  <div className="text-white font-semibold mb-2">Multiple Countries</div>
                  <div className="text-white/60 text-sm">Monitor air quality across US, India, China, UK, and Canada</div>
                </div>
                <div className="p-6 bg-white/5 rounded-xl">
                  <div className="text-[#00d4ff] text-3xl font-bold mb-2">DATA</div>
                  <div className="text-white font-semibold mb-2">Real-time Data</div>
                  <div className="text-white/60 text-sm">Get live air quality index and pollutant information</div>
                </div>
                <div className="p-6 bg-white/5 rounded-xl">
                  <div className="text-[#00d4ff] text-3xl font-bold mb-2">RANKS</div>
                  <div className="text-white font-semibold mb-2">Smart Rankings</div>
                  <div className="text-white/60 text-sm">View top clean and most polluted cities instantly</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 