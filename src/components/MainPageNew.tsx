import Navbar from './Navbar'
import Hero from './Hero'
import Footer from './Footer'
import { useAirQuality } from '../hooks/useAirQuality'

export default function MainPage() {
  const { cities } = useAirQuality()

  const globalStats = {
    totalCities: cities.length,
    avgAQI: cities.length > 0 ? Math.round(cities.reduce((sum, city) => sum + city.aqi, 0) / cities.length) : 0,
    goodAirCities: cities.filter(city => city.aqi <= 50).length,
    poorAirCities: cities.filter(city => city.aqi > 150).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
      <Navbar />
      <Hero />
      
      {/* Air Quality Overview Section */}
      <section id="air-quality" className="py-20 px-5">
        <div className="container max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Global Air Quality Dashboard
            </h2>
            <p className="text-xl text-white/70 max-w-[700px] mx-auto">
              Real-time monitoring of air quality across major cities worldwide
            </p>
          </div>

          {/* Global Statistics */}
          <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-[#00d4ff] mb-2">{globalStats.totalCities}</div>
              <div className="text-white/70 text-sm">Cities Monitored</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-[#22c55e] mb-2">{globalStats.avgAQI}</div>
              <div className="text-white/70 text-sm">Global Avg AQI</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-[#10b981] mb-2">{globalStats.goodAirCities}</div>
              <div className="text-white/70 text-sm">Good Air Quality</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-[#ef4444] mb-2">{globalStats.poorAirCities}</div>
              <div className="text-white/70 text-sm">Poor Air Quality</div>
            </div>
          </div>

          {/* Ways to Improve Air Quality */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">Ways to Improve Air Quality</h3>
            <div className="improvement-cards grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">🚗</div>
                <h4 className="text-xl font-bold text-white mb-4">Reduce Vehicle Emissions</h4>
                <ul className="text-white/70 space-y-2">
                  <li>• Use public transportation</li>
                  <li>• Walk or bike for short distances</li>
                  <li>• Carpool or rideshare</li>
                  <li>• Consider electric vehicles</li>
                  <li>• Maintain your vehicle properly</li>
                </ul>
              </div>

              <div className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">🏠</div>
                <h4 className="text-xl font-bold text-white mb-4">Home & Energy</h4>
                <ul className="text-white/70 space-y-2">
                  <li>• Use energy-efficient appliances</li>
                  <li>• Switch to renewable energy</li>
                  <li>• Improve home insulation</li>
                  <li>• Use LED lighting</li>
                  <li>• Avoid burning wood or trash</li>
                </ul>
              </div>

              <div className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">🌱</div>
                <h4 className="text-xl font-bold text-white mb-4">Plant & Protect</h4>
                <ul className="text-white/70 space-y-2">
                  <li>• Plant trees and maintain gardens</li>
                  <li>• Support urban green spaces</li>
                  <li>• Use native plants</li>
                  <li>• Avoid chemical pesticides</li>
                  <li>• Create green roofs/walls</li>
                </ul>
              </div>

              <div className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">♻️</div>
                <h4 className="text-xl font-bold text-white mb-4">Reduce & Recycle</h4>
                <ul className="text-white/70 space-y-2">
                  <li>• Recycle properly</li>
                  <li>• Reduce plastic consumption</li>
                  <li>• Compost organic waste</li>
                  <li>• Choose reusable products</li>
                  <li>• Buy local and sustainable</li>
                </ul>
              </div>

              <div className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">🏭</div>
                <h4 className="text-xl font-bold text-white mb-4">Industrial Action</h4>
                <ul className="text-white/70 space-y-2">
                  <li>• Support clean industries</li>
                  <li>• Advocate for regulations</li>
                  <li>• Report pollution violations</li>
                  <li>• Choose eco-friendly products</li>
                  <li>• Invest in green companies</li>
                </ul>
              </div>

              <div className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">👥</div>
                <h4 className="text-xl font-bold text-white mb-4">Community Action</h4>
                <ul className="text-white/70 space-y-2">
                  <li>• Join environmental groups</li>
                  <li>• Educate others</li>
                  <li>• Participate in clean-up drives</li>
                  <li>• Vote for environmental policies</li>
                  <li>• Volunteer for green initiatives</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Health Precautions and Do's & Don'ts */}
          <div className="health-precautions grid md:grid-cols-2 gap-8 mb-16">
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">🛡️ Health Precautions</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-red-400 font-semibold mb-2">High Pollution Days</div>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Stay indoors, especially during peak hours</li>
                    <li>• Keep windows and doors closed</li>
                    <li>• Use air purifiers if available</li>
                    <li>• Wear N95 masks when going outside</li>
                    <li>• Avoid outdoor exercise</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="text-orange-400 font-semibold mb-2">Moderate Pollution</div>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Limit prolonged outdoor activities</li>
                    <li>• Exercise indoors when possible</li>
                    <li>• Take frequent breaks if working outside</li>
                    <li>• Stay hydrated</li>
                    <li>• Monitor symptoms closely</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-green-400 font-semibold mb-2">Good Air Quality</div>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Perfect for all outdoor activities</li>
                    <li>• Great time for exercise and sports</li>
                    <li>• Open windows for fresh air</li>
                    <li>• Enjoy nature and outdoor spaces</li>
                    <li>• Plan outdoor events</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">✅ Do's & ❌ Don'ts</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                    <span>✅</span> DO's
                  </h4>
                  <ul className="text-white/70 text-sm space-y-2">
                    <li>• Check air quality daily before going out</li>
                    <li>• Use air purifiers in your home</li>
                    <li>• Plant air-purifying indoor plants</li>
                    <li>• Keep your living spaces well-ventilated</li>
                    <li>• Follow local air quality alerts</li>
                    <li>• Stay hydrated to help your body process toxins</li>
                    <li>• Eat antioxidant-rich foods</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                    <span>❌</span> DON'Ts
                  </h4>
                  <ul className="text-white/70 text-sm space-y-2">
                    <li>• Don't ignore air quality warnings</li>
                    <li>• Don't exercise outdoors during high pollution</li>
                    <li>• Don't burn leaves, trash, or wood unnecessarily</li>
                    <li>• Don't smoke or allow smoking indoors</li>
                    <li>• Don't use harsh chemicals or aerosols</li>
                    <li>• Don't idle your vehicle unnecessarily</li>
                    <li>• Don't ignore respiratory symptoms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Understanding AQI */}
          <div className="aqi-understanding glass-effect rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Understanding Air Quality Index (AQI)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-[#10b981]/20 border border-[#10b981]/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#10b981] mx-auto mb-2"></div>
                <div className="text-white font-semibold">0-50</div>
                <div className="text-[#10b981] font-medium">Good</div>
                <div className="text-white/60 text-xs mt-1">Air quality is satisfactory</div>
              </div>
              <div className="text-center p-4 bg-[#22c55e]/20 border border-[#22c55e]/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#22c55e] mx-auto mb-2"></div>
                <div className="text-white font-semibold">51-100</div>
                <div className="text-[#22c55e] font-medium">Moderate</div>
                <div className="text-white/60 text-xs mt-1">Acceptable for most people</div>
              </div>
              <div className="text-center p-4 bg-[#f97316]/20 border border-[#f97316]/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#f97316] mx-auto mb-2"></div>
                <div className="text-white font-semibold">101-150</div>
                <div className="text-[#f97316] font-medium">Unhealthy for Sensitive</div>
                <div className="text-white/60 text-xs mt-1">May affect sensitive groups</div>
              </div>
              <div className="text-center p-4 bg-[#ef4444]/20 border border-[#ef4444]/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#ef4444] mx-auto mb-2"></div>
                <div className="text-white font-semibold">151-200</div>
                <div className="text-[#ef4444] font-medium">Unhealthy</div>
                <div className="text-white/60 text-xs mt-1">Health warnings for everyone</div>
              </div>
              <div className="text-center p-4 bg-[#dc2626]/20 border border-[#dc2626]/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#dc2626] mx-auto mb-2"></div>
                <div className="text-white font-semibold">201+</div>
                <div className="text-[#dc2626] font-medium">Very Unhealthy</div>
                <div className="text-white/60 text-xs mt-1">Emergency conditions</div>
              </div>
            </div>
          </div>

          {/* Key Pollutants */}
          <div className="key-pollutants glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Key Air Pollutants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-xl">
                <div className="text-[#00d4ff] text-2xl font-bold mb-2">PM2.5</div>
                <div className="text-white/70 text-sm mb-3">Fine particulate matter that can penetrate deep into lungs and bloodstream</div>
                <div className="text-white/60 text-xs">Sources: Vehicle exhaust, industrial emissions, wildfires</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl">
                <div className="text-[#00d4ff] text-2xl font-bold mb-2">PM10</div>
                <div className="text-white/70 text-sm mb-3">Larger particles that can cause respiratory issues and eye irritation</div>
                <div className="text-white/60 text-xs">Sources: Dust storms, construction, road dust</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl">
                <div className="text-[#00d4ff] text-2xl font-bold mb-2">O₃</div>
                <div className="text-white/70 text-sm mb-3">Ground-level ozone that can trigger asthma and reduce lung function</div>
                <div className="text-white/60 text-xs">Sources: Vehicle exhaust + sunlight, industrial processes</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}