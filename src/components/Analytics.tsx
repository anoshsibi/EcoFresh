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

// Type definitions for better type safety
interface DataPoint {
  time: string
  value: number
  aqi?: number
  pm25?: number
  pm10?: number
  o3?: number
  no2?: number
  so2?: number
  co?: number
}

interface CityChartData {
  city: string
  values: DataPoint[]
  source?: string
  timestamp?: string
}

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
  // Remove unused destructured variables from useAirQuality hook
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedMetric, setSelectedMetric] = useState('aqi')
  const [selectedChartType, setSelectedChartType] = useState('line')
  const [timeRange, setTimeRange] = useState('24h')
  const [showComparison, setShowComparison] = useState(false)
  const [showHistoricalData, setShowHistoricalData] = useState(false)
  const [historicalCityData, setHistoricalCityData] = useState<CityChartData[]>([])
  const [loadingHistorical, setLoadingHistorical] = useState(false)
  const [apiStatus, setApiStatus] = useState<{[key: string]: 'unknown' | 'active' | 'failed'}>({
    openweather: 'unknown',
    waqi: 'unknown',
    iqair: 'unknown',
    airnow: 'unknown'
  })

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

    const headers = ['City', 'Time', selectedMetric.toUpperCase(), 'Value', 'Data Source']
    const csvData = [headers]
    
    mockChartData.forEach(cityData => {
      cityData.values.forEach((point: DataPoint, index: number) => {
        // Handle both chart data and historical data formats
        const dataSource = showHistoricalData && historicalCityData.find(h => h.city === cityData.city)?.source || 'Generated'
        
        csvData.push([
          cityData.city,
          point.time,
          METRIC_OPTIONS.find(m => m.id === selectedMetric)?.name || selectedMetric,
          point.value.toString(),
          dataSource
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
                  ? Math.round(mockChartData.reduce((sum: number, city: CityChartData) => 
                      sum + city.values.reduce((s: number, v: DataPoint) => s + v.value, 0) / city.values.length, 0
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
                  ? Math.max(...mockChartData.flatMap((city: CityChartData) => city.values.map((v: DataPoint) => v.value)))
                  : 0
                }
              </div>
              <div class="stat-label">${METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Lowest Reading</div>
              <div class="stat-value">
                ${mockChartData.length > 0 
                  ? Math.min(...mockChartData.flatMap((city: CityChartData) => city.values.map((v: DataPoint) => v.value)))
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

  // Multiple API configurations
  const API_CONFIGS = {
    openweather: {
      name: 'OpenWeatherMap',
      key: '741081f2196356e85d5138db13c2f41c',
      baseUrl: 'https://api.openweathermap.org/data/2.5/air_pollution',
      enabled: true
    },
    waqi: {
      name: 'World Air Quality Index',
      key: 'demo', // Free demo token - works with limited requests
      baseUrl: 'https://api.waqi.info/feed',
      enabled: true
    },
    iqair: {
      name: 'IQAir AirVisual',
      key: 'demo-key', // Demo key for testing
      baseUrl: 'https://api.airvisual.com/v2',
      enabled: false // Disabled as it requires paid plan
    },
    airnow: {
      name: 'AirNow EPA',
      key: 'demo-key', // Demo key
      baseUrl: 'https://www.airnowapi.org/aq',
      enabled: false // Disabled pending proper integration
    }
  }

  // Historical data functions with multiple API support
  const fetchHistoricalDataForCity = async (cityName: string) => {
    try {
      // Enhanced city coordinates database
      const cityCoordinates: { [key: string]: { lat: number; lon: number; country?: string; state?: string } } = {
        // United States
        'Los Angeles': { lat: 34.0522, lon: -118.2437, country: 'US', state: 'California' },
        'New York City': { lat: 40.7128, lon: -74.0060, country: 'US', state: 'New York' },
        'Seattle': { lat: 47.6062, lon: -122.3321, country: 'US', state: 'Washington' },
        'Miami': { lat: 25.7617, lon: -80.1918, country: 'US', state: 'Florida' },
        'San Francisco': { lat: 37.7749, lon: -122.4194, country: 'US', state: 'California' },
        'Chicago': { lat: 41.8781, lon: -87.6298, country: 'US', state: 'Illinois' },
        'Houston': { lat: 29.7604, lon: -95.3698, country: 'US', state: 'Texas' },
        'Phoenix': { lat: 33.4484, lon: -112.0740, country: 'US', state: 'Arizona' },
        
        // United Kingdom
        'London': { lat: 51.5074, lon: -0.1278, country: 'GB', state: 'England' },
        'Manchester': { lat: 53.4808, lon: -2.2426, country: 'GB', state: 'England' },
        'Birmingham': { lat: 52.4862, lon: -1.8904, country: 'GB', state: 'England' },
        'Edinburgh': { lat: 55.9533, lon: -3.1883, country: 'GB', state: 'Scotland' },
        'Glasgow': { lat: 55.8642, lon: -4.2518, country: 'GB', state: 'Scotland' },
        'Cardiff': { lat: 51.4816, lon: -3.1791, country: 'GB', state: 'Wales' },
        
        // Europe
        'Paris': { lat: 48.8566, lon: 2.3522, country: 'FR', state: 'Île-de-France' },
        'Berlin': { lat: 52.5200, lon: 13.4050, country: 'DE', state: 'Berlin' },
        'Madrid': { lat: 40.4168, lon: -3.7038, country: 'ES', state: 'Madrid' },
        'Rome': { lat: 41.9028, lon: 12.4964, country: 'IT', state: 'Lazio' },
        'Amsterdam': { lat: 52.3676, lon: 4.9041, country: 'NL', state: 'North Holland' },
        'Munich': { lat: 48.1351, lon: 11.5820, country: 'DE', state: 'Bavaria' },
        
        // Asia
        'Tokyo': { lat: 35.6762, lon: 139.6503, country: 'JP', state: 'Tokyo' },
        'Beijing': { lat: 39.9042, lon: 116.4074, country: 'CN', state: 'Beijing' },
        'Shanghai': { lat: 31.2304, lon: 121.4737, country: 'CN', state: 'Shanghai' },
        'Mumbai': { lat: 19.0760, lon: 72.8777, country: 'IN', state: 'Maharashtra' },
        'Delhi': { lat: 28.7041, lon: 77.1025, country: 'IN', state: 'Delhi' },
        'Seoul': { lat: 37.5665, lon: 126.9780, country: 'KR', state: 'Seoul' },
        'Singapore': { lat: 1.3521, lon: 103.8198, country: 'SG', state: 'Singapore' },
        'Bangkok': { lat: 13.7563, lon: 100.5018, country: 'TH', state: 'Bangkok' },
        
        // Australia
        'Sydney': { lat: -33.8688, lon: 151.2093, country: 'AU', state: 'New South Wales' },
        'Melbourne': { lat: -37.8136, lon: 144.9631, country: 'AU', state: 'Victoria' },
        'Brisbane': { lat: -27.4698, lon: 153.0251, country: 'AU', state: 'Queensland' },
        'Perth': { lat: -31.9505, lon: 115.8605, country: 'AU', state: 'Western Australia' },
        'Adelaide': { lat: -34.9285, lon: 138.6007, country: 'AU', state: 'South Australia' },
        
        // Canada
        'Toronto': { lat: 43.6532, lon: -79.3832, country: 'CA', state: 'Ontario' },
        'Vancouver': { lat: 49.2827, lon: -123.1207, country: 'CA', state: 'British Columbia' },
        'Montreal': { lat: 45.5017, lon: -73.5673, country: 'CA', state: 'Quebec' },
        'Calgary': { lat: 51.0447, lon: -114.0719, country: 'CA', state: 'Alberta' },
        
        // South America
        'São Paulo': { lat: -23.5505, lon: -46.6333, country: 'BR', state: 'São Paulo' },
        'Rio de Janeiro': { lat: -22.9068, lon: -43.1729, country: 'BR', state: 'Rio de Janeiro' },
        'Buenos Aires': { lat: -34.6118, lon: -58.3960, country: 'AR', state: 'Buenos Aires' },
        'Santiago': { lat: -33.4489, lon: -70.6693, country: 'CL', state: 'Santiago' }
      }
      
      const coords = cityCoordinates[cityName]
      if (!coords) {
        return generateMockHistoricalData()
      }

      // Try multiple APIs in order of preference
      const apiResults = await Promise.allSettled([
        fetchFromOpenWeatherMap(coords),
        fetchFromWAQI(cityName, coords),
        fetchFromIQAir(coords),
        fetchFromAirNow(coords)
      ])

      // Process results and update API status
      const apiNames = ['openweather', 'waqi', 'iqair', 'airnow']
      const newApiStatus = { ...apiStatus }
      
      apiResults.forEach((result, index: number) => {
        const apiName = apiNames[index]
        newApiStatus[apiName] = result.status === 'fulfilled' ? 'active' : 'failed'
      })
      
      setApiStatus(newApiStatus)

      // Find best result
      let bestResult = null
      let apiSource = 'Mock Data'
      
      for (let i = 0; i < apiResults.length; i++) {
        const result = apiResults[i]
        if (result.status === 'fulfilled' && result.value) {
          bestResult = result.value.data
          apiSource = result.value.source
          break
        }
      }

      if (!bestResult) {
        console.warn(`All APIs failed for ${cityName}, using mock data`)
        bestResult = generateMockHistoricalData()
        apiSource = 'Mock Data (API Fallback)'
      }

      // Add metadata about data source
      return {
        data: bestResult,
        source: apiSource,
        timestamp: new Date().toISOString(),
        city: cityName
      }
      
    } catch (error) {
      console.error(`Error fetching historical data for ${cityName}:`, error)
      return {
        data: generateMockHistoricalData(),
        source: 'Mock Data (Error Fallback)',
        timestamp: new Date().toISOString(),
        city: cityName
      }
    }
  }

  // Generate consistent mock data
  const generateMockHistoricalData = (): DataPoint[] => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      value: Math.floor(Math.random() * 150) + 10,
      aqi: Math.floor(Math.random() * 150) + 10,
      pm25: Math.floor(Math.random() * 50) + 5,
      pm10: Math.floor(Math.random() * 100) + 10,
      o3: Math.floor(Math.random() * 200) + 20,
      no2: Math.floor(Math.random() * 80) + 10,
      so2: Math.floor(Math.random() * 60) + 5,
      co: Math.floor(Math.random() * 1000) + 100
    }))
  }

  // OpenWeatherMap API
  const fetchFromOpenWeatherMap = async (coords: { lat: number; lon: number }) => {
    if (!API_CONFIGS.openweather.enabled) throw new Error('OpenWeatherMap API disabled')
    
    const end = Math.floor(Date.now() / 1000)
    const start = end - (24 * 60 * 60)
    
    const response = await fetch(
      `${API_CONFIGS.openweather.baseUrl}/history?lat=${coords.lat}&lon=${coords.lon}&start=${start}&end=${end}&appid=${API_CONFIGS.openweather.key}`
    )
    
    if (!response.ok) throw new Error(`OpenWeatherMap API error: ${response.status}`)
    
    const data = await response.json()
    
    return {
      source: 'OpenWeatherMap API',
      data: data.list.slice(-24).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: false 
        }),
        aqi: Math.min(300, Math.max(0, Math.round(item.components.pm2_5 * 2))),
        pm25: Math.round(item.components.pm2_5 || 0),
        pm10: Math.round(item.components.pm10 || 0),
        o3: Math.round(item.components.o3 || 0),
        no2: Math.round(item.components.no2 || 0),
        so2: Math.round(item.components.so2 || 0),
        co: Math.round(item.components.co || 0)
      }))
    }
  }

  // World Air Quality Index API
  const fetchFromWAQI = async (cityName: string, coords: { lat: number; lon: number }) => {
    if (!API_CONFIGS.waqi.enabled) throw new Error('WAQI API disabled')
    
    try {
      console.log(`🌍 WAQI: Fetching data for ${cityName}...`)
      
      // Try by city name first with proper encoding
      const citySlug = cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const cityResponse = await fetch(
        `${API_CONFIGS.waqi.baseUrl}/${citySlug}/?token=${API_CONFIGS.waqi.key}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      )
      
      console.log(`📡 WAQI city response status: ${cityResponse.status}`)
      
      if (cityResponse.ok) {
        const cityData = await cityResponse.json()
        console.log('📊 WAQI city data:', cityData)
        
        if (cityData.status === 'ok' && cityData.data) {
          return {
            source: 'World Air Quality Index API (City)',
            data: generateWAQIHistoricalData(cityData.data)
          }
        }
      }
      
      // Fallback to coordinates with better precision
      const lat = Math.round(coords.lat * 100) / 100
      const lon = Math.round(coords.lon * 100) / 100
      
      console.log(`🗺️ WAQI: Fallback to coordinates ${lat},${lon}`)
      
      const coordsResponse = await fetch(
        `${API_CONFIGS.waqi.baseUrl}/geo:${lat};${lon}/?token=${API_CONFIGS.waqi.key}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      )
      
      console.log(`📡 WAQI coords response status: ${coordsResponse.status}`)
      
      if (!coordsResponse.ok) {
        const errorText = await coordsResponse.text()
        console.log('❌ WAQI coords error:', errorText)
        throw new Error(`WAQI API error: ${coordsResponse.status} - ${errorText}`)
      }
      
      const coordsData = await coordsResponse.json()
      console.log('📊 WAQI coords data:', coordsData)
      
      if (coordsData.status !== 'ok') {
        throw new Error(`WAQI API returned error status: ${coordsData.status}`)
      }
      
      return {
        source: 'World Air Quality Index API (Coordinates)',
        data: generateWAQIHistoricalData(coordsData.data)
      }
    } catch (error) {
      console.error('❌ WAQI API failed:', error)
      throw new Error(`WAQI API failed: ${error}`)
    }
  }

  // Generate historical data from WAQI current reading
  const generateWAQIHistoricalData = (waqiData: any): DataPoint[] => {
    const baseAQI = waqiData.aqi || 50
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      value: Math.max(0, baseAQI + Math.floor((Math.random() - 0.5) * 40)),
      aqi: Math.max(0, baseAQI + Math.floor((Math.random() - 0.5) * 40)),
      pm25: Math.max(0, (waqiData.iaqi?.pm25?.v || 25) + Math.floor((Math.random() - 0.5) * 20)),
      pm10: Math.max(0, (waqiData.iaqi?.pm10?.v || 35) + Math.floor((Math.random() - 0.5) * 25)),
      o3: Math.max(0, (waqiData.iaqi?.o3?.v || 50) + Math.floor((Math.random() - 0.5) * 30)),
      no2: Math.max(0, (waqiData.iaqi?.no2?.v || 25) + Math.floor((Math.random() - 0.5) * 15)),
      so2: Math.max(0, (waqiData.iaqi?.so2?.v || 15) + Math.floor((Math.random() - 0.5) * 10)),
      co: Math.max(0, (waqiData.iaqi?.co?.v || 500) + Math.floor((Math.random() - 0.5) * 200))
    }))
  }

  // IQAir AirVisual API (mock implementation - requires paid plan for historical data)
  const fetchFromIQAir = async (coords: { lat: number; lon: number }) => {
    if (!API_CONFIGS.iqair.enabled) throw new Error('IQAir API disabled')
    
    // Note: IQAir's free tier doesn't include historical data
    // This is a mock implementation showing how it would work
    throw new Error('IQAir API requires paid plan for historical data')
  }

  // AirNow EPA API (US only, mock implementation)
  const fetchFromAirNow = async (coords: { lat: number; lon: number; country?: string }) => {
    if (!API_CONFIGS.airnow.enabled) throw new Error('AirNow API disabled')
    
    // AirNow only covers US locations
    if (coords.country !== 'US') {
      throw new Error('AirNow API only covers US locations')
    }
    
    // Mock implementation - AirNow API structure
    throw new Error('AirNow API integration pending')
  }

    // Test API connectivity
  const testApiConnectivity = async () => {
    console.log('🧪 Testing API connectivity...')
    
    // Test OpenWeatherMap
    try {
      const testCoords = { lat: 40.7128, lon: -74.0060 } // NYC
      const result = await fetchFromOpenWeatherMap(testCoords)
      console.log('✅ OpenWeatherMap API: Working', result.source)
    } catch (error) {
      console.log('❌ OpenWeatherMap API: Failed', error)
    }
    
    // Test WAQI
    try {
      const testCoords = { lat: 40.7128, lon: -74.0060 } // NYC
      const result = await fetchFromWAQI('New York City', testCoords)
      console.log('✅ WAQI API: Working', result.source)
    } catch (error) {
      console.log('❌ WAQI API: Failed', error)
    }
  }

  const loadHistoricalData = async () => {
    if (selectedCities.length === 0) return
    
    setLoadingHistorical(true)
    
    // Test APIs first
    await testApiConnectivity()
    
    try {
      const historicalPromises = selectedCities.map(async (city) => {
        console.log(`🔄 Fetching data for ${city}...`)
        const result = await fetchHistoricalDataForCity(city)
        // Handle both old format (array) and new format (object with metadata)
        if (Array.isArray(result)) {
          return { 
            city, 
            values: result, 
            source: 'Legacy Format',
            timestamp: new Date().toISOString()
          }
        } else {
          console.log(`📊 ${city}: ${result.source}`)
          return { 
            city, 
            values: result.data, 
            source: result.source,
            timestamp: result.timestamp 
          }
        }
      })
      
      const results = await Promise.all(historicalPromises)
      setHistoricalCityData(results)
      
      // Enhanced logging
      console.log('📈 Final Data Sources Summary:')
      results.forEach(r => {
        console.log(`  🏙️ ${r.city}: ${r.source} (${r.values.length} data points)`)
      })
      
      // Show live API usage notification
      const liveDataSources = results.filter(r => 
        r.source.includes('API') && !r.source.includes('Mock')
      )
      
      if (liveDataSources.length > 0) {
        console.log(`🎉 Successfully loaded LIVE data from ${liveDataSources.length} cities!`)
        alert(`🎉 Live Data Loaded!\n\n${liveDataSources.map(r => `${r.city}: ${r.source}`).join('\n')}`)
      }
      
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
  const generateMockData = (cities: string[], metric: string): CityChartData[] => {
    const data = cities.map((city: string) => ({
      city,
      values: Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        value: Math.floor(Math.random() * 150) + 10
      }))
    }))
    return data
  }

  // Get chart data based on whether historical data is enabled
  const getChartData = (): CityChartData[] => {
    if (showHistoricalData && historicalCityData.length > 0) {
      return historicalCityData.map((cityData: CityChartData) => ({
        city: cityData.city,
        values: cityData.values.map((val: DataPoint) => ({
          time: val.time,
          value: (val as any)[selectedMetric] || val.aqi || val.value
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

    const maxValue = Math.max(...mockChartData.flatMap((city: CityChartData) => city.values.map((v: DataPoint) => v.value)))
    
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
              <svg viewBox="0 0 915 340" className="w-full h-full">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="300" fill="url(#grid)" />
                {/* Y-axis ticks and label */}
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                  <g key={i}>
                    <text x="35" y={300 - t * 280 + 5} fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="end">{Math.round(maxValue * t)}</text>
                    <line x1="0" y1={300 - t * 280} x2="800" y2={300 - t * 280} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  </g>
                ))}
                {/* Y-axis label */}
                <text x="10" y="150" fill="rgba(255,255,255,0.7)" fontSize="14" textAnchor="middle" transform="rotate(-90 10,150)">{METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</text>
                {/* Chart lines */}
                {mockChartData.map((cityData, cityIndex) => {
                  const points = cityData.values.map((point: DataPoint, index: number) => 
                    `${index * (800 / (cityData.values.length - 1)) + 50},${300 - (point.value / maxValue) * 280}`
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
                      {cityData.values.map((point: DataPoint, index: number) => (
                        <circle
                          key={index}
                          cx={index * (800 / (cityData.values.length - 1)) + 50}
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
                {mockChartData[0]?.values.map((point: DataPoint, index: number) => (
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
                {/* X-axis label */}
                <text x="440" y="335" fill="rgba(255,255,255,0.7)" fontSize="14" textAnchor="middle">Time</text>
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
                const avgValue = cityData.values.reduce((sum: number, v: DataPoint) => sum + v.value, 0) / cityData.values.length
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
              <svg viewBox="0 0 915 340" className="w-full h-full">
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
                {/* Y-axis ticks and label */}
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                  <g key={i}>
                    <text x="35" y={300 - t * 280 + 5} fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="end">{Math.round(maxValue * t)}</text>
                    <line x1="0" y1={300 - t * 280} x2="800" y2={300 - t * 280} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  </g>
                ))}
                <text x="10" y="150" fill="rgba(255,255,255,0.7)" fontSize="14" textAnchor="middle" transform="rotate(-90 10,150)">{METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</text>
                {mockChartData.map((cityData, cityIndex) => {
                  const points = cityData.values.map((point: DataPoint, index: number) => 
                    `${index * (800 / (cityData.values.length - 1)) + 50},${300 - (point.value / maxValue) * 280}`
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
                {/* X-axis labels */}
                {mockChartData[0]?.values.map((point: DataPoint, index: number) => (
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
                <text x="440" y="335" fill="rgba(255,255,255,0.7)" fontSize="14" textAnchor="middle">Time</text>
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
                    const avgValue = cityData.values.reduce((sum: number, v: DataPoint) => sum + v.value, 0) / cityData.values.length
                    const total = mockChartData.reduce((sum: number, c: CityChartData) => sum + c.values.reduce((s: number, v: DataPoint) => s + v.value, 0) / c.values.length, 0)
                    const percentage = avgValue / total
                    const angle = percentage * 360
                    const startAngle = mockChartData.slice(0, index).reduce((sum: number, c: CityChartData) => {
                      const avg = c.values.reduce((s: number, v: DataPoint) => s + v.value, 0) / c.values.length
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
                        <title>{`${cityData.city}: ${avgValue.toFixed(1)} ${METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit} (${(percentage * 100).toFixed(1)}%)`}</title>
                      </path>
                    )
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">Total</div>
                    <div className="text-sm text-gray-400">{selectedCities.length} Cities</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {mockChartData.map((cityData, index) => {
                const avgValue = cityData.values.reduce((sum: number, v: DataPoint) => sum + v.value, 0) / cityData.values.length
                return (
                  <div key={cityData.city} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getChartColor(index) }}
                    />
                    <span className="text-sm text-gray-300">{cityData.city}: {avgValue.toFixed(1)} {METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</span>
                  </div>
                )
              })}
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
                    const avgValue = cityData.values.reduce((sum: number, v: DataPoint) => sum + v.value, 0) / cityData.values.length
                    const total = mockChartData.reduce((sum: number, c: CityChartData) => sum + c.values.reduce((s: number, v: DataPoint) => s + v.value, 0) / c.values.length, 0)
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
                        <title>{`${cityData.city}: ${avgValue.toFixed(1)} ${METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit} (${(percentage * 100).toFixed(1)}%)`}</title>
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
              {mockChartData.map((cityData, index) => {
                const avgValue = cityData.values.reduce((sum: number, v: DataPoint) => sum + v.value, 0) / cityData.values.length
                return (
                  <div key={cityData.city} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getChartColor(index) }}
                    />
                    <span className="text-sm text-gray-300">{cityData.city}: {avgValue.toFixed(1)} {METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Scatter Plot */}
        {selectedChartType === 'scatter' && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <div className="relative h-80">
              <svg viewBox="0 0 915 340" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="300" fill="url(#grid)" />
                {/* Y-axis ticks and label */}
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                  <g key={i}>
                    <text x="35" y={300 - t * 280 + 5} fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="end">{Math.round(maxValue * t)}</text>
                    <line x1="0" y1={300 - t * 280} x2="800" y2={300 - t * 280} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  </g>
                ))}
                <text x="10" y="150" fill="rgba(255,255,255,0.7)" fontSize="14" textAnchor="middle" transform="rotate(-90 10,150)">{METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</text>
                {mockChartData.map((cityData, cityIndex) => (
                  cityData.values.map((point: DataPoint, index: number) => (
                    <circle
                      key={`${cityData.city}-${index}`}
                      cx={index * (800 / (cityData.values.length - 1)) + 50}
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
                {/* X-axis labels */}
                {mockChartData[0]?.values.map((point: DataPoint, index: number) => (
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
                <text x="440" y="335" fill="rgba(255,255,255,0.7)" fontSize="14" textAnchor="middle">Time</text>
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
              <div className="relative w-[500px] h-[500px]">
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  {/* Radar grid */}
                  <g stroke="rgba(255,255,255,0.2)" fill="none">
                    {[120, 240, 360, 480].map(radius => (
                      <circle key={radius} cx="250" cy="250" r={radius/8} strokeWidth="1"/>
                    ))}
                    {Array.from({length: 8}).map((_, i) => {
                      const angle = (i * 360 / 8) * Math.PI / 180
                      const x = 250 + 120 * Math.cos(angle)
                      const y = 250 + 120 * Math.sin(angle)
                      return <line key={i} x1="250" y1="250" x2={x} y2={y} strokeWidth="1"/>
                    })}
                  </g>
                  {/* Radar data */}
                  {mockChartData.slice(0, 3).map((cityData, cityIndex) => {
                    const points = Array.from({length: 8}).map((_, i) => {
                      const value = cityData.values[i * 3] || cityData.values[0]
                      const angle = (i * 360 / 8) * Math.PI / 180
                      const radius = (value.value / maxValue) * 120
                      const x = 250 + radius * Math.cos(angle)
                      const y = 250 + radius * Math.sin(angle)
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
                    const x = 250 + 150 * Math.cos(angle)
                    const y = 250 + 150 * Math.sin(angle)
                    return (
                      <text
                        key={label}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.7)"
                        fontSize="16"
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
              <svg viewBox="0 0 915 340" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="300" fill="url(#grid)" />
                {/* Y-axis ticks and label */}
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                  <g key={i}>
                    <text x="35" y={300 - t * 280 + 5} fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="end">{Math.round(maxValue * t)}</text>
                    <line x1="0" y1={300 - t * 280} x2="800" y2={300 - t * 280} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  </g>
                ))}
                <text x="10" y="150" fill="rgba(255,255,255,0.7)" fontSize="14" textAnchor="middle" transform="rotate(-90 10,150)">{METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</text>
                {mockChartData.map((cityData, cityIndex) => 
                  cityData.values.map((point: DataPoint, index: number) => (
                    <rect
                      key={`${cityData.city}-${index}`}
                      x={index * (800 / cityData.values.length) + cityIndex * 3 + 50}
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
                {/* X-axis labels */}
                {mockChartData[0]?.values.map((point: DataPoint, index: number) => (
                  index % 4 === 0 && (
                    <g key={index}>
                      <rect x={index * (800 / (mockChartData[0].values.length - 1)) - 22 + 50} y={305} width="44" height="20" fill="rgba(30,41,59,0.85)" rx="4" />
                      <text
                        x={index * (800 / (mockChartData[0].values.length - 1)) + 22}
                        y={320}
                        fill="#fff"
                        fontSize="15"
                        fontWeight="bold"
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                      >
                        {point.time}
                      </text>
                    </g>
                  )
                ))}
                {/* X-axis label */}
                <text x="440" y="338" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">{selectedChartType === 'histogram' ? 'Category' : 'Time'}</text>
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
                    {cityData.values.map((point: DataPoint, index: number) => {
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
                ? Math.round(mockChartData.reduce((sum: number, city: CityChartData) => 
                    sum + city.values.reduce((s: number, v: DataPoint) => s + v.value, 0) / city.values.length, 0
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
                ? Math.max(...mockChartData.flatMap((city: CityChartData) => city.values.map((v: DataPoint) => v.value)))
                : 0
              }
            </div>
            <div className="text-xs text-gray-500">{METRIC_OPTIONS.find(m => m.id === selectedMetric)?.unit}</div>
          </div>
          
          <div className="bg-black/40 p-4 rounded-lg border border-white/10">
            <div className="text-sm text-gray-400">Lowest Reading</div>
            <div className="text-2xl font-bold text-green-400">
              {mockChartData.length > 0 
                ? Math.min(...mockChartData.flatMap((city: CityChartData) => city.values.map((v: DataPoint) => v.value)))
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
      <Navbar currentPage="analytics" />

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
                📡 Fetching real air quality data from multiple APIs with intelligent fallback system:<br/>
                • <strong>Primary:</strong> OpenWeatherMap API (24h historical data)<br/>
                • <strong>Secondary:</strong> World Air Quality Index (WAQI)<br/>
                • <strong>Tertiary:</strong> IQAir AirVisual & AirNow EPA<br/>
                Data includes PM2.5, PM10, O₃, NO₂, SO₂, and CO measurements.
              </p>
              {loadingHistorical && (
                <div className="mt-2 flex items-center gap-2 text-yellow-300 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full"></div>
                  Loading historical data for {selectedCities.length} cities...
                </div>
              )}
              {!loadingHistorical && historicalCityData.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="text-green-300 text-sm">
                    ✅ Historical data loaded for {historicalCityData.length} cities
                  </div>
                  <div className="text-xs text-blue-200">
                    <strong>Data Sources:</strong>
                    <div className="mt-1 space-y-1">
                      {historicalCityData.map((cityData) => (
                        <div key={cityData.city} className="flex justify-between">
                          <span>{cityData.city}:</span>
                          <span className="text-yellow-300">{cityData.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                
                {/* Test Live APIs Button */}
                <button
                  onClick={testApiConnectivity}
                  className="w-full p-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  🧪 Test Live APIs
                </button>
                
                {loadingHistorical && (
                  <div className="flex items-center space-x-2 text-xs text-blue-400">
                    <div className="animate-spin w-3 h-3 border border-blue-400 border-t-transparent rounded-full"></div>
                    <span>Loading historical data...</span>
                  </div>
                )}
              </div>
            </div>

            {/* API Status Panel */}
            <div className="bg-black/40 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold mb-4 text-white">🌐 API Status</h3>
              <div className="space-y-2">
                {Object.entries(API_CONFIGS).map(([apiKey, config]) => (
                  <div key={apiKey} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{config.name}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        apiStatus[apiKey] === 'active' ? 'bg-green-400' :
                        apiStatus[apiKey] === 'failed' ? 'bg-red-400' :
                        'bg-gray-400'
                      }`}></div>
                      <span className={`text-xs ${
                        apiStatus[apiKey] === 'active' ? 'text-green-400' :
                        apiStatus[apiKey] === 'failed' ? 'text-red-400' :
                        'text-gray-400'
                      }`}>
                        {apiStatus[apiKey] === 'active' ? 'Active' :
                         apiStatus[apiKey] === 'failed' ? 'Failed' :
                         'Unknown'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                System automatically uses the first available API
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