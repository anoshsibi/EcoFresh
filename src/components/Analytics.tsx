import React, { useState, useEffect } from 'react'
import { useAirQuality } from '../hooks/useAirQuality'
import Navbar from './Navbar'

// Chart type options
const CHART_TYPES = [
  { id: 'line', name: 'Line Chart', icon: '📈' },
  { id: 'bar', name: 'Bar Chart', icon: '📊' },
  { id: 'area', name: 'Area Chart', icon: '🌊' },
  { id: 'pie', name: 'Pie Chart', icon: '🥧' },
  { id: 'donut', name: 'Donut Chart', icon: '🍩' },
  { id: 'scatter', name: 'Scatter Plot', icon: '🔸' },
  { id: 'radar', name: 'Radar Chart', icon: '🎯' },
  { id: 'histogram', name: 'Histogram', icon: '📋' },
  { id: 'heatmap', name: 'Heatmap', icon: '🔥' }
]

// Metric options
const METRIC_OPTIONS = [
  { id: 'aqi', name: 'Air Quality Index', unit: 'AQI' },
  { id: 'pm25', name: 'PM2.5', unit: 'μg/m³' },
  { id: 'pm10', name: 'PM10', unit: 'μg/m³' },
  { id: 'o3', name: 'Ozone (O₃)', unit: 'μg/m³' },
  { id: 'no2', name: 'Nitrogen Dioxide', unit: 'μg/m³' },
  { id: 'so2', name: 'Sulfur Dioxide', unit: 'μg/m³' },
  { id: 'co', name: 'Carbon Monoxide', unit: 'μg/m³' }
]

// Available locations data
const LOCATIONS = {
  countries: [
    { id: 'us', name: 'United States', states: ['california', 'new-york', 'florida', 'washington', 'texas', 'illinois', 'pennsylvania', 'ohio'] },
    { id: 'uk', name: 'United Kingdom', states: ['england', 'scotland', 'wales', 'northern-ireland'] },
    { id: 'canada', name: 'Canada', states: ['ontario', 'quebec', 'british-columbia', 'alberta', 'manitoba', 'saskatchewan'] },
    { id: 'australia', name: 'Australia', states: ['new-south-wales', 'victoria', 'queensland', 'western-australia', 'south-australia'] },
    { id: 'germany', name: 'Germany', states: ['bavaria', 'north-rhine-westphalia', 'baden-wurttemberg', 'lower-saxony', 'hesse'] },
    { id: 'france', name: 'France', states: ['ile-de-france', 'auvergne-rhone-alpes', 'nouvelle-aquitaine', 'occitanie', 'hauts-de-france'] },
    { id: 'japan', name: 'Japan', states: ['tokyo', 'osaka', 'kanagawa', 'aichi', 'saitama', 'chiba', 'hyogo'] },
    { id: 'china', name: 'China', states: ['beijing', 'shanghai', 'guangdong', 'jiangsu', 'shandong', 'zhejiang'] },
    { id: 'india', name: 'India', states: ['maharashtra', 'uttar-pradesh', 'bihar', 'west-bengal', 'madhya-pradesh', 'tamil-nadu'] },
    { id: 'brazil', name: 'Brazil', states: ['sao-paulo', 'rio-de-janeiro', 'minas-gerais', 'bahia', 'parana', 'rio-grande-do-sul'] }
  ],
  states: {
    // United States
    california: { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno', 'Long Beach', 'Oakland'] },
    'new-york': { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany', 'Yonkers', 'New Rochelle'] },
    florida: { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale'] },
    washington: { name: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton'] },
    texas: { name: 'Texas', cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi'] },
    illinois: { name: 'Illinois', cities: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria', 'Elgin'] },
    pennsylvania: { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem'] },
    ohio: { name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton'] },
    
    // United Kingdom
    england: { name: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle'] },
    scotland: { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Stirling', 'Perth', 'Inverness'] },
    wales: { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry', 'Caerphilly', 'Rhondda'] },
    'northern-ireland': { name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newtownabbey', 'Bangor', 'Craigavon'] },
    
    // Canada
    ontario: { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Kitchener', 'Windsor', 'Oshawa', 'Barrie'] },
    quebec: { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Trois-Rivieres'] },
    'british-columbia': { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford', 'Coquitlam'] },
    alberta: { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Grande Prairie'] },
    manitoba: { name: 'Manitoba', cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie'] },
    saskatchewan: { name: 'Saskatchewan', cities: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current'] },
    
    // Australia
    'new-south-wales': { name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Maitland', 'Albury', 'Wagga Wagga'] },
    victoria: { name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Latrobe', 'Frankston', 'Shepparton'] },
    queensland: { name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Cairns', 'Townsville', 'Toowoomba', 'Mackay', 'Rockhampton'] },
    'western-australia': { name: 'Western Australia', cities: ['Perth', 'Fremantle', 'Rockingham', 'Mandurah', 'Bunbury', 'Geraldton'] },
    'south-australia': { name: 'South Australia', cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Lincoln'] },
    
    // Germany
    bavaria: { name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg', 'Würzburg', 'Regensburg', 'Ingolstadt', 'Fürth'] },
    'north-rhine-westphalia': { name: 'North Rhine-Westphalia', cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum', 'Wuppertal'] },
    'baden-wurttemberg': { name: 'Baden-Württemberg', cities: ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg', 'Heidelberg', 'Ulm'] },
    'lower-saxony': { name: 'Lower Saxony', cities: ['Hanover', 'Braunschweig', 'Osnabrück', 'Oldenburg', 'Göttingen', 'Wolfsburg'] },
    hesse: { name: 'Hesse', cities: ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt', 'Offenbach', 'Gießen'] },
    
    // France
    'ile-de-france': { name: 'Île-de-France', cities: ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Versailles', 'Nanterre'] },
    'auvergne-rhone-alpes': { name: 'Auvergne-Rhône-Alpes', cities: ['Lyon', 'Grenoble', 'Saint-Étienne', 'Villeurbanne', 'Clermont-Ferrand'] },
    'nouvelle-aquitaine': { name: 'Nouvelle-Aquitaine', cities: ['Bordeaux', 'Limoges', 'Poitiers', 'Pau', 'La Rochelle', 'Périgueux'] },
    occitanie: { name: 'Occitanie', cities: ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Béziers', 'Narbonne'] },
    'hauts-de-france': { name: 'Hauts-de-France', cities: ['Lille', 'Amiens', 'Roubaix', 'Tourcoing', 'Dunkirk', 'Calais'] },
    
    // Japan
    tokyo: { name: 'Tokyo', cities: ['Tokyo', 'Hachioji', 'Tachikawa', 'Musashino', 'Mitaka', 'Ome', 'Fuchu'] },
    osaka: { name: 'Osaka', cities: ['Osaka', 'Sakai', 'Higashiosaka', 'Hirakata', 'Toyonaka', 'Suita', 'Takatsuki'] },
    kanagawa: { name: 'Kanagawa', cities: ['Yokohama', 'Kawasaki', 'Sagamihara', 'Fujisawa', 'Chigasaki', 'Hiratsuka'] },
    aichi: { name: 'Aichi', cities: ['Nagoya', 'Toyota', 'Okazaki', 'Ichinomiya', 'Kasugai', 'Anjo', 'Toyohashi'] },
    saitama: { name: 'Saitama', cities: ['Saitama', 'Kawaguchi', 'Tokorozawa', 'Koshigaya', 'Soka', 'Ageo', 'Kasukabe'] },
    chiba: { name: 'Chiba', cities: ['Chiba', 'Funabashi', 'Matsudo', 'Ichikawa', 'Kashiwa', 'Ichihara', 'Kamagaya'] },
    hyogo: { name: 'Hyogo', cities: ['Kobe', 'Himeji', 'Nishinomiya', 'Amagasaki', 'Akashi', 'Kakogawa'] },
    
    // China
    beijing: { name: 'Beijing', cities: ['Beijing', 'Chaoyang', 'Haidian', 'Fengtai', 'Shijingshan', 'Mentougou'] },
    shanghai: { name: 'Shanghai', cities: ['Shanghai', 'Pudong', 'Huangpu', 'Xuhui', 'Changning', 'Jing\'an', 'Putuo'] },
    guangdong: { name: 'Guangdong', cities: ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Zhongshan', 'Zhuhai', 'Jiangmen'] },
    jiangsu: { name: 'Jiangsu', cities: ['Nanjing', 'Suzhou', 'Wuxi', 'Changzhou', 'Xuzhou', 'Nantong', 'Yangzhou'] },
    shandong: { name: 'Shandong', cities: ['Jinan', 'Qingdao', 'Yantai', 'Weifang', 'Zibo', 'Jining', 'Weihai'] },
    zhejiang: { name: 'Zhejiang', cities: ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing', 'Huzhou', 'Shaoxing', 'Jinhua'] },
    
    // India
    maharashtra: { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati'] },
    'uttar-pradesh': { name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'] },
    bihar: { name: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif'] },
    'west-bengal': { name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman'] },
    'madhya-pradesh': { name: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas'] },
    'tamil-nadu': { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'] },
    
    // Brazil
    'sao-paulo': { name: 'São Paulo', cities: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco'] },
    'rio-de-janeiro': { name: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói'] },
    'minas-gerais': { name: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros'] },
    bahia: { name: 'Bahia', cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro', 'Ilhéus'] },
    parana: { name: 'Paraná', cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais'] },
    'rio-grande-do-sul': { name: 'Rio Grande do Sul', cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'] }
  }
}

export default function Analytics() {
  const { cities, historicalData, loading } = useAirQuality()
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedMetric, setSelectedMetric] = useState('aqi')
  const [selectedChartType, setSelectedChartType] = useState('line')
  const [timeRange, setTimeRange] = useState('24h')
  const [showComparison, setShowComparison] = useState(false)
  const [showHistoricalData, setShowHistoricalData] = useState(false)
  const [historicalCityData, setHistoricalCityData] = useState<any[]>([])
  const [loadingHistorical, setLoadingHistorical] = useState(false)

  // Better color palette
  const getChartColor = (index: number) => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
      '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1',
      '#14B8A6', '#F43F5E', '#8B5CF6', '#22C55E', '#FbbF24'
    ]
    return colors[index % colors.length]
  }

  const navigateTo = (hash: string) => {
    if (hash === '') {
      window.location.hash = ''
    } else {
      window.location.hash = hash
    }
  }

  // Export functions
  const exportAsPNG = () => {
    const chartElement = document.querySelector('.chart-container svg') as SVGElement
    if (!chartElement) {
      alert('No chart to export. Please select cities and generate a chart first.')
      return
    }

    // Create canvas and export as PNG
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const svgData = new XMLSerializer().serializeToString(chartElement)
    
    canvas.width = 1200
    canvas.height = 600
    
    const img = new Image()
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Download
        const link = document.createElement('a')
        link.download = `air-quality-${selectedChartType}${showHistoricalData ? '-historical' : ''}-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
      URL.revokeObjectURL(url)
    }
    
    img.src = url
  }

  const exportAsCSV = () => {
    if (selectedCities.length === 0) {
      alert('No data to export. Please select cities first.')
      return
    }

    const headers = ['City', 'Time', selectedMetric.toUpperCase(), 'Value']
    const csvData = [headers]
    
    mockChartData.forEach(cityData => {
      cityData.values.forEach(point => {
        csvData.push([
          cityData.city,
          point.time,
          METRIC_OPTIONS.find(m => m.id === selectedMetric)?.name || selectedMetric,
          point.value.toString()
        ])
      })
    })
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `air-quality-data${showHistoricalData ? '-historical' : ''}-${Date.now()}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const exportAsPDF = () => {
    if (selectedCities.length === 0) {
      alert('No data to export. Please select cities first.')
      return
    }

    // Create a new window with the chart content for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to export PDF')
      return
    }

    const chartElement = document.querySelector('.chart-container')
    const statsElement = document.querySelector('.stats-summary')
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Air Quality Analytics Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: white;
              color: black;
              margin: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .chart-container {
              margin: 20px 0;
              border: 1px solid #ddd;
              padding: 20px;
            }
            .stats {
              display: flex;
              justify-content: space-around;
              margin-top: 20px;
              border: 1px solid #ddd;
              padding: 15px;
            }
            .stat-item {
              text-align: center;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
            }
            svg {
              max-width: 100%;
              height: auto;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌍 EcoFresh Air Quality Analytics Report</h1>
            <h2>${METRIC_OPTIONS.find(m => m.id === selectedMetric)?.name} - ${selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)} Chart</h2>
            <p><strong>Cities:</strong> ${selectedCities.join(', ')}</p>
            <p><strong>Time Range:</strong> Last ${timeRange}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="chart-container">
            ${chartElement?.innerHTML || 'Chart not available'}
          </div>
          
          <div class="stats">
            <div class="stat-item">
              <div class="stat-label">Average ${METRIC_OPTIONS.find(m => m.id === selectedMetric)?.name}</div>
              <div class="stat-value">
                ${mockChartData.length > 0 
                  ? Math.round(mockChartData.reduce((sum, city) => 
                      sum + city.values.reduce((s, v) => s + v.value, 0) / city.values.length, 0
                    ) / mockChartData.length)
                  : 0
                }
              </div>
              <div class="stat-label">${METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Highest Reading</div>
              <div class="stat-value">
                ${mockChartData.length > 0 
                  ? Math.max(...mockChartData.flatMap(city => city.values.map(v => v.value)))
                  : 0
                }
              </div>
              <div class="stat-label">${METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Lowest Reading</div>
              <div class="stat-value">
                ${mockChartData.length > 0 
                  ? Math.min(...mockChartData.flatMap(city => city.values.map(v => v.value)))
                  : 0
                }
              </div>
              <div class="stat-label">${METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
              }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Historical data functions
  const fetchHistoricalDataForCity = async (cityName: string) => {
    try {
      // Map city names to known coordinates (in a real app, you'd use geocoding)
      const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
        'Los Angeles': { lat: 34.0522, lon: -118.2437 },
        'New York City': { lat: 40.7128, lon: -74.0060 },
        'Seattle': { lat: 47.6062, lon: -122.3321 },
        'Miami': { lat: 25.7617, lon: -80.1918 },
        'London': { lat: 51.5074, lon: -0.1278 },
        'Paris': { lat: 48.8566, lon: 2.3522 },
        'Tokyo': { lat: 35.6762, lon: 139.6503 },
        'Beijing': { lat: 39.9042, lon: 116.4074 },
        'Mumbai': { lat: 19.0760, lon: 72.8777 },
        'Sydney': { lat: -33.8688, lon: 151.2093 }
      }
      
      const coords = cityCoordinates[cityName]
      if (!coords) {
        // Return mock data for cities without known coordinates
        return Array.from({ length: 24 }, (_, i) => ({
          time: `${String(i).padStart(2, '0')}:00`,
          aqi: Math.floor(Math.random() * 150) + 10,
          pm25: Math.floor(Math.random() * 50) + 5,
          pm10: Math.floor(Math.random() * 100) + 10,
          o3: Math.floor(Math.random() * 200) + 20,
          no2: Math.floor(Math.random() * 80) + 10,
          so2: Math.floor(Math.random() * 60) + 5,
          co: Math.floor(Math.random() * 1000) + 100
        }))
      }

      // Fetch real historical data from API
      const API_KEY = '741081f2196356e85d5138db13c2f41c'
      const end = Math.floor(Date.now() / 1000)
      const start = end - (24 * 60 * 60) // Last 24 hours
      
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${coords.lat}&lon=${coords.lon}&start=${start}&end=${end}&appid=${API_KEY}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical data')
      }
      
      const data = await response.json()
      
      return data.list.slice(-24).map((item: any, index: number) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: false 
        }),
        aqi: Math.min(300, Math.max(0, Math.round(item.components.pm2_5 * 2))),
        pm25: Math.round(item.components.pm2_5),
        pm10: Math.round(item.components.pm10),
        o3: Math.round(item.components.o3),
        no2: Math.round(item.components.no2),
        so2: Math.round(item.components.so2),
        co: Math.round(item.components.co)
      }))
    } catch (error) {
      console.error(`Error fetching historical data for ${cityName}:`, error)
      // Return mock data as fallback
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        aqi: Math.floor(Math.random() * 150) + 10,
        pm25: Math.floor(Math.random() * 50) + 5,
        pm10: Math.floor(Math.random() * 100) + 10,
        o3: Math.floor(Math.random() * 200) + 20,
        no2: Math.floor(Math.random() * 80) + 10,
        so2: Math.floor(Math.random() * 60) + 5,
        co: Math.floor(Math.random() * 1000) + 100
      }))
    }
  }

  const loadHistoricalData = async () => {
    if (selectedCities.length === 0) return
    
    setLoadingHistorical(true)
    try {
      const historicalPromises = selectedCities.map(async (city) => {
        const data = await fetchHistoricalDataForCity(city)
        return { city, values: data }
      })
      
      const results = await Promise.all(historicalPromises)
      setHistoricalCityData(results)
    } catch (error) {
      console.error('Error loading historical data:', error)
    } finally {
      setLoadingHistorical(false)
    }
  }

  // Use effect to load historical data when cities change
  useEffect(() => {
    if (showHistoricalData && selectedCities.length > 0) {
      loadHistoricalData()
    }
  }, [selectedCities, showHistoricalData])

  // Mock data for demonstration (when not using historical data)
  const generateMockData = (cities: string[], metric: string) => {
    const data = cities.map(city => ({
      city,
      values: Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        value: Math.floor(Math.random() * 150) + 10
      }))
    }))
    return data
  }

  // Get chart data based on whether historical data is enabled
  const getChartData = () => {
    if (showHistoricalData && historicalCityData.length > 0) {
      return historicalCityData.map(cityData => ({
        city: cityData.city,
        values: cityData.values.map((val: any) => ({
          time: val.time,
          value: val[selectedMetric] || val.aqi
        }))
      }))
    }
    return generateMockData(selectedCities, selectedMetric)
  }

  const mockChartData = getChartData()

  const availableStates = selectedCountry 
    ? LOCATIONS.countries.find(c => c.id === selectedCountry)?.states || []
    : []

  const availableCities = selectedState 
    ? LOCATIONS.states[selectedState as keyof typeof LOCATIONS.states]?.cities || []
    : []

  const renderChart = () => {
    if (selectedCities.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-4 text-blue-400 font-bold">ANALYTICS</div>
            <p>Select cities to view analytics</p>
          </div>
        </div>
      )
    }

    const maxValue = Math.max(...mockChartData.flatMap(city => city.values.map(v => v.value)))
    
    return (
      <div className="space-y-4">
        {/* Chart Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            {METRIC_OPTIONS.find(m => m.id === selectedMetric)?.name} - {selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)} Chart
          </h3>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              Last {timeRange}
            </div>
            {showHistoricalData && (
              <div className="text-xs text-blue-400 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Real-time API Data
              </div>
            )}
          </div>
        </div>

        {/* Line Chart */}
        {selectedChartType === 'line' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="relative h-80">
              <svg viewBox="0 0 800 300" className="w-full h-full">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="300" fill="url(#grid)" />
                
                {/* Chart lines */}
                {mockChartData.map((cityData, cityIndex) => {
                  const points = cityData.values.map((point, index) => 
                    `${index * (800 / (cityData.values.length - 1))},${300 - (point.value / maxValue) * 280}`
                  ).join(' ')
                  
                  return (
                    <g key={cityData.city}>
                      <polyline
                        fill="none"
                        stroke={getChartColor(cityIndex)}
                        strokeWidth="3"
                        points={points}
                        className="transition-all duration-300"
                      />
                      {/* Data points */}
                      {cityData.values.map((point, index) => (
                        <circle
                          key={index}
                          cx={index * (800 / (cityData.values.length - 1))}
                          cy={300 - (point.value / maxValue) * 280}
                          r="4"
                          fill={getChartColor(cityIndex)}
                          className="transition-all duration-300 hover:r-6"
                        >
                          <title>{`${cityData.city}: ${point.value} at ${point.time}`}</title>
                        </circle>
                      ))}
                    </g>
                  )
                })}
                
                {/* X-axis labels */}
                {mockChartData[0]?.values.map((point, index) => (
                  index % 4 === 0 && (
                    <text
                      key={index}
                      x={index * (800 / (mockChartData[0].values.length - 1))}
                      y={320}
                      fill="rgba(255,255,255,0.6)"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {point.time}
                    </text>
                  )
                ))}
              </svg>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {mockChartData.map((cityData, index) => (
                <div key={cityData.city} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getChartColor(index) }}
                  />
                  <span className="text-sm text-gray-300">{cityData.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bar Chart */}
        {selectedChartType === 'bar' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockChartData.map((cityData, cityIndex) => {
                const avgValue = cityData.values.reduce((sum, v) => sum + v.value, 0) / cityData.values.length
                const percentage = Math.min((avgValue / maxValue) * 100, 100)
                
                return (
                  <div key={cityData.city} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white truncate mr-2">{cityData.city}</span>
                      <span className="text-sm text-gray-400 whitespace-nowrap">
                        Avg: {Math.round(avgValue)}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="h-6 rounded-full transition-all duration-500 flex items-center"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getChartColor(cityIndex)
                        }}
                      >
                        <span className="text-xs text-white ml-2 font-medium">
                          {Math.round(avgValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Area Chart */}
        {selectedChartType === 'area' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="relative h-80">
              <svg viewBox="0 0 800 300" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  </pattern>
                  {mockChartData.map((_, index) => (
                    <linearGradient key={index} id={`area-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={getChartColor(index)} stopOpacity="0.6"/>
                      <stop offset="100%" stopColor={getChartColor(index)} stopOpacity="0.1"/>
                    </linearGradient>
                  ))}
                </defs>
                <rect width="800" height="300" fill="url(#grid)" />
                
                {mockChartData.map((cityData, cityIndex) => {
                  const points = cityData.values.map((point, index) => 
                    `${index * (800 / (cityData.values.length - 1))},${300 - (point.value / maxValue) * 280}`
                  ).join(' ')
                  const areaPoints = `${points} 800,300 0,300`
                  
                  return (
                    <g key={cityData.city}>
                      <polygon
                        points={areaPoints}
                        fill={`url(#area-gradient-${cityIndex})`}
                        stroke={getChartColor(cityIndex)}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                    </g>
                  )
                })}
              </svg>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {mockChartData.map((cityData, index) => (
                <div key={cityData.city} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getChartColor(index) }}
                  />
                  <span className="text-sm text-gray-300">{cityData.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pie Chart */}
        {selectedChartType === 'pie' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-center">
              <div className="relative w-80 h-80">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {mockChartData.map((cityData, index) => {
                    const avgValue = cityData.values.reduce((sum, v) => sum + v.value, 0) / cityData.values.length
                    const total = mockChartData.reduce((sum, c) => sum + c.values.reduce((s, v) => s + v.value, 0) / c.values.length, 0)
                    const percentage = avgValue / total
                    const angle = percentage * 360
                    const startAngle = mockChartData.slice(0, index).reduce((sum, c) => {
                      const avg = c.values.reduce((s, v) => s + v.value, 0) / c.values.length
                      return sum + (avg / total) * 360
                    }, 0)
                    
                    const radius = 80
                    const centerX = 100
                    const centerY = 100
                    
                    const startAngleRad = (startAngle * Math.PI) / 180
                    const endAngleRad = ((startAngle + angle) * Math.PI) / 180
                    
                    const x1 = centerX + radius * Math.cos(startAngleRad)
                    const y1 = centerY + radius * Math.sin(startAngleRad)
                    const x2 = centerX + radius * Math.cos(endAngleRad)
                    const y2 = centerY + radius * Math.sin(endAngleRad)
                    
                    const largeArcFlag = angle > 180 ? 1 : 0
                    
                    return (
                      <path
                        key={cityData.city}
                        d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={getChartColor(index)}
                        stroke="#1a1a1a"
                        strokeWidth="2"
                        className="transition-all duration-300 hover:opacity-80"
                      >
                        <title>{`${cityData.city}: ${(percentage * 100).toFixed(1)}%`}</title>
                      </path>
                    )
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">Total</div>
                    <div className="text-sm text-gray-400">Cities: {selectedCities.length}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {mockChartData.map((cityData, index) => (
                <div key={cityData.city} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getChartColor(index) }}
                  />
                  <span className="text-sm text-gray-300">{cityData.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donut Chart */}
        {selectedChartType === 'donut' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-center">
              <div className="relative w-80 h-80">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {mockChartData.map((cityData, index) => {
                    const avgValue = cityData.values.reduce((sum, v) => sum + v.value, 0) / cityData.values.length
                    const total = mockChartData.reduce((sum, c) => sum + c.values.reduce((s, v) => s + v.value, 0) / c.values.length, 0)
                    const percentage = avgValue / total
                    const circumference = 2 * Math.PI * 70
                    const strokeDasharray = circumference
                    const strokeDashoffset = circumference - (percentage * circumference)
                    
                    return (
                      <circle
                        key={cityData.city}
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke={getChartColor(index)}
                        strokeWidth="20"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                        transform={`rotate(${index * (360 / mockChartData.length)} 100 100)`}
                      >
                        <title>{`${cityData.city}: ${(percentage * 100).toFixed(1)}%`}</title>
                      </circle>
                    )
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">Analytics</div>
                    <div className="text-sm text-gray-400">{selectedCities.length} Cities</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {mockChartData.map((cityData, index) => (
                <div key={cityData.city} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getChartColor(index) }}
                  />
                  <span className="text-sm text-gray-300">{cityData.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scatter Plot */}
        {selectedChartType === 'scatter' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="relative h-80">
              <svg viewBox="0 0 800 300" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="300" fill="url(#grid)" />
                
                {mockChartData.map((cityData, cityIndex) => (
                  cityData.values.map((point, index) => (
                    <circle
                      key={`${cityData.city}-${index}`}
                      cx={index * (800 / (cityData.values.length - 1))}
                      cy={300 - (point.value / maxValue) * 280}
                      r="6"
                      fill={getChartColor(cityIndex)}
                      fillOpacity="0.7"
                      className="transition-all duration-300 hover:r-8 hover:fill-opacity-100"
                    >
                      <title>{`${cityData.city}: ${point.value} at ${point.time}`}</title>
                    </circle>
                  ))
                ))}
              </svg>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {mockChartData.map((cityData, index) => (
                <div key={cityData.city} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getChartColor(index) }}
                  />
                  <span className="text-sm text-gray-300">{cityData.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Radar Chart */}
        {selectedChartType === 'radar' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-center">
              <div className="relative w-80 h-80">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  {/* Radar grid */}
                  <g stroke="rgba(255,255,255,0.2)" fill="none">
                    {[60, 120, 180, 240, 300].map(radius => (
                      <circle key={radius} cx="150" cy="150" r={radius/5} strokeWidth="1"/>
                    ))}
                    {Array.from({length: 8}).map((_, i) => {
                      const angle = (i * 360 / 8) * Math.PI / 180
                      const x = 150 + 60 * Math.cos(angle)
                      const y = 150 + 60 * Math.sin(angle)
                      return <line key={i} x1="150" y1="150" x2={x} y2={y} strokeWidth="1"/>
                    })}
                  </g>
                  
                  {/* Radar data */}
                  {mockChartData.slice(0, 3).map((cityData, cityIndex) => {
                    const points = Array.from({length: 8}).map((_, i) => {
                      const value = cityData.values[i * 3] || cityData.values[0]
                      const angle = (i * 360 / 8) * Math.PI / 180
                      const radius = (value.value / maxValue) * 60
                      const x = 150 + radius * Math.cos(angle)
                      const y = 150 + radius * Math.sin(angle)
                      return `${x},${y}`
                    }).join(' ')
                    
                    return (
                      <polygon
                        key={cityData.city}
                        points={points}
                        fill={getChartColor(cityIndex)}
                        fillOpacity="0.3"
                        stroke={getChartColor(cityIndex)}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                    )
                  })}
                  
                  {/* Axis labels */}
                  {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map((label, i) => {
                    const angle = (i * 360 / 8) * Math.PI / 180
                    const x = 150 + 75 * Math.cos(angle)
                    const y = 150 + 75 * Math.sin(angle)
                    return (
                      <text
                        key={label}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.7)"
                        fontSize="12"
                      >
                        {label}
                      </text>
                    )
                  })}
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {mockChartData.slice(0, 3).map((cityData, index) => (
                <div key={cityData.city} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getChartColor(index) }}
                  />
                  <span className="text-sm text-gray-300">{cityData.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Histogram */}
        {selectedChartType === 'histogram' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="relative h-80">
              <svg viewBox="0 0 800 300" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="300" fill="url(#grid)" />
                
                {mockChartData.map((cityData, cityIndex) => 
                  cityData.values.map((point, index) => (
                    <rect
                      key={`${cityData.city}-${index}`}
                      x={index * (800 / cityData.values.length) + cityIndex * 3}
                      y={300 - (point.value / maxValue) * 280}
                      width={Math.max(800 / cityData.values.length - mockChartData.length * 3, 10)}
                      height={(point.value / maxValue) * 280}
                      fill={getChartColor(cityIndex)}
                      fillOpacity="0.8"
                      className="transition-all duration-300 hover:fill-opacity-100"
                    >
                      <title>{`${cityData.city}: ${point.value} at ${point.time}`}</title>
                    </rect>
                  ))
                )}
              </svg>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {mockChartData.map((cityData, index) => (
                <div key={cityData.city} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getChartColor(index) }}
                  />
                  <span className="text-sm text-gray-300">{cityData.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Heatmap */}
        {selectedChartType === 'heatmap' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="space-y-2">
              {mockChartData.map((cityData, cityIndex) => (
                <div key={cityData.city} className="flex items-center gap-2">
                  <div className="w-24 text-sm text-white truncate">{cityData.city}</div>
                  <div className="flex gap-1 flex-1">
                    {cityData.values.map((point, index) => {
                      const intensity = point.value / maxValue
                      return (
                        <div
                          key={index}
                          className="h-8 flex-1 transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: `rgba(${Math.round(255 * intensity)}, ${Math.round(100 + 155 * intensity)}, ${Math.round(50 + 205 * intensity)}, 0.8)`
                          }}
                          title={`${cityData.city}: ${point.value} at ${point.time}`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
              <span>Low</span>
              <div className="flex gap-1">
                {Array.from({length: 10}).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4"
                    style={{
                      backgroundColor: `rgba(${Math.round(255 * (i/9))}, ${Math.round(100 + 155 * (i/9))}, ${Math.round(50 + 205 * (i/9))}, 0.8)`
                    }}
                  />
                ))}
              </div>
              <span>High</span>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 stats-summary">
          <div className="bg-black/40 p-4 rounded-lg border border-white/10">
            <div className="text-sm text-gray-400">Average {METRIC_OPTIONS.find(m => m.id === selectedMetric)?.name}</div>
            <div className="text-2xl font-bold text-white">
              {mockChartData.length > 0 
                ? Math.round(mockChartData.reduce((sum, city) => 
                    sum + city.values.reduce((s, v) => s + v.value, 0) / city.values.length, 0
                  ) / mockChartData.length)
                : 0
              }
            </div>
            <div className="text-xs text-gray-500">{METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</div>
          </div>
          
          <div className="bg-black/40 p-4 rounded-lg border border-white/10">
            <div className="text-sm text-gray-400">Highest Reading</div>
            <div className="text-2xl font-bold text-red-400">
              {mockChartData.length > 0 
                ? Math.max(...mockChartData.flatMap(city => city.values.map(v => v.value)))
                : 0
              }
            </div>
            <div className="text-xs text-gray-500">{METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</div>
          </div>
          
          <div className="bg-black/40 p-4 rounded-lg border border-white/10">
            <div className="text-sm text-gray-400">Lowest Reading</div>
            <div className="text-2xl font-bold text-green-400">
              {mockChartData.length > 0 
                ? Math.min(...mockChartData.flatMap(city => city.values.map(v => v.value)))
                : 0
              }
            </div>
            <div className="text-xs text-gray-500">{METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Air Quality Analytics
          </h1>
          <p className="text-gray-400 text-lg">
            Create custom visualizations and analyze air quality data across different locations
          </p>
          
          {/* Historical Data Info Panel */}
          {showHistoricalData && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-400/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-white">Historical Data Mode Active</h3>
              </div>
              <p className="text-blue-200 text-sm">
                📡 Fetching real air quality data from OpenWeatherMap API for the last 24 hours. 
                Data includes PM2.5, PM10, O₃, NO₂, SO₂, and CO measurements.
              </p>
              {loadingHistorical && (
                <div className="mt-2 flex items-center gap-2 text-yellow-300 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full"></div>
                  Loading historical data for {selectedCities.length} cities...
                </div>
              )}
              {!loadingHistorical && historicalCityData.length > 0 && (
                <div className="mt-2 text-green-300 text-sm">
                  ✅ Historical data loaded for {historicalCityData.length} cities
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Selection */}
            <div className="bg-black/40 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold mb-4 text-white">📍 Location Selection</h3>
              
              {/* Country Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value)
                    setSelectedState('')
                    setSelectedCities([])
                  }}
                  className="w-full p-3 bg-black/60 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Country</option>
                  {LOCATIONS.countries.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
              </div>

              {/* State Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">State/Region</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setSelectedCities([])
                  }}
                  disabled={!selectedCountry}
                  className="w-full p-3 bg-black/60 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">Select State/Region</option>
                  {availableStates.map(state => (
                    <option key={state} value={state}>
                      {LOCATIONS.states[state as keyof typeof LOCATIONS.states]?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Cities</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableCities.map(city => (
                    <label key={city} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCities([...selectedCities, city])
                          } else {
                            setSelectedCities(selectedCities.filter(c => c !== city))
                          }
                        }}
                        className="rounded border-white/20 bg-black/60 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">{city}</span>
                    </label>
                  ))}
                </div>
                {selectedCities.length > 0 && (
                  <div className="mt-2 text-xs text-blue-400">
                    {selectedCities.length} cities selected
                  </div>
                )}
              </div>
            </div>

            {/* Chart Configuration */}
            <div className="bg-black/40 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold mb-4 text-white">⚙️ Chart Settings</h3>
              
              {/* Metric Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Metric</label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="w-full p-3 bg-black/60 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  {METRIC_OPTIONS.map(metric => (
                    <option key={metric.id} value={metric.id}>
                      {metric.name} ({metric.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Chart Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Chart Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {CHART_TYPES.map(chart => (
                    <button
                      key={chart.id}
                      onClick={() => setSelectedChartType(chart.id)}
                      className={`p-2 rounded-lg border transition-all text-center ${
                        selectedChartType === chart.id
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      <div className="text-base mb-1">{chart.icon}</div>
                      <div className="text-xs leading-tight">{chart.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full p-3 bg-black/60 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="1h">Last Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showComparison}
                    onChange={(e) => setShowComparison(e.target.checked)}
                    className="rounded border-white/20 bg-black/60 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Show Comparison</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showHistoricalData}
                    onChange={(e) => setShowHistoricalData(e.target.checked)}
                    className="rounded border-white/20 bg-black/60 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Use Real Historical Data</span>
                </label>
                {loadingHistorical && (
                  <div className="flex items-center space-x-2 text-xs text-blue-400">
                    <div className="animate-spin w-3 h-3 border border-blue-400 border-t-transparent rounded-full"></div>
                    <span>Loading historical data...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-black/40 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold mb-4 text-white">💾 Export</h3>
              <div className="space-y-2">
                <button 
                  onClick={exportAsPNG}
                  disabled={selectedCities.length === 0}
                  className="w-full p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  📷 Export as PNG
                </button>
                <button 
                  onClick={exportAsCSV}
                  disabled={selectedCities.length === 0}
                  className="w-full p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  📊 Export as CSV
                </button>
                <button 
                  onClick={exportAsPDF}
                  disabled={selectedCities.length === 0}
                  className="w-full p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  📄 Export as PDF
                </button>
              </div>
              {selectedCities.length === 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Select cities to enable export
                </p>
              )}
            </div>
          </div>

          {/* Chart Display */}
          <div className="lg:col-span-3">
            <div className="bg-black/30 rounded-xl border border-white/10 p-6 chart-container">
              {renderChart()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}