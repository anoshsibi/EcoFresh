import React, { useState } from 'react'
import Navbar from './Navbar'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
  expertise: string[]
}

interface CommunityStats {
  members: string
  cities: string
  countries: string
  reports: string
}

export default function About() {
  const [activeSection, setActiveSection] = useState('mission')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [joinForm, setJoinForm] = useState({
    name: '',
    email: '',
    location: '',
    interests: [] as string[]
  })
  const [donationAmount, setDonationAmount] = useState('25')

  // const navigateTo = (hash: string) => {
  //   if (hash === '') {
  //     window.location.hash = ''
  //   } else {
  //     window.location.hash = hash
  //   }
  // }

  const communityStats: CommunityStats = {
    members: '125,000+',
    cities: '500+',
    countries: '45',
    reports: '1M+'
  }

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      role: 'Founder & Environmental Scientist',
      bio: 'Leading researcher in atmospheric science with 15+ years of experience in air quality monitoring.',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      expertise: ['Air Quality Research', 'Environmental Policy', 'Data Science']
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      role: 'CTO & Data Engineer',
      bio: 'Expert in real-time data processing and IoT sensor networks for environmental monitoring.',
      imageUrl: 'https://picsum.photos/300/300?random=2',
      expertise: ['IoT Systems', 'Real-time Analytics', 'Machine Learning']
    },
    {
      id: '3',
      name: 'Dr. Emily Johnson',
      role: 'Health Impact Researcher',
      bio: 'Public health specialist focusing on the correlation between air quality and community health.',
      imageUrl: 'https://picsum.photos/300/300?random=3',
      expertise: ['Public Health', 'Epidemiology', 'Community Outreach']
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Community Manager',
      bio: 'Passionate about building communities and driving environmental awareness initiatives.',
      imageUrl: 'https://picsum.photos/300/300?random=4',
      expertise: ['Community Building', 'Environmental Advocacy', 'Social Media']
    }
  ]

  const interestOptions = [
    'Air Quality Monitoring',
    'Environmental Advocacy',
    'Health Research',
    'Policy Development',
    'Community Education',
    'Data Analysis',
    'Volunteer Work',
    'Local Initiatives'
  ]

  const donationProjects = [
    {
      title: 'Sensor Network Expansion',
      description: 'Deploy air quality sensors in underserved communities',
      goal: '$50,000',
      current: '$32,500'
    },
    {
      title: 'Educational Programs',
      description: 'Fund air quality awareness programs in schools',
      goal: '$25,000',
      current: '$18,750'
    },
    {
      title: 'Research Grants',
      description: 'Support independent air quality research projects',
      goal: '$75,000',
      current: '$45,200'
    }
  ]

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      alert('Welcome to the EcoFresh community! Check your email for confirmation.')
      setShowJoinModal(false)
      setJoinForm({ name: '', email: '', location: '', interests: [] })
    }, 1000)
  }

  const handleDonation = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate payment processing
    setTimeout(() => {
      alert(`Thank you for your $${donationAmount} donation! Your contribution will help improve air quality monitoring.`)
      setShowDonationModal(false)
      setDonationAmount('25')
    }, 1500)
  }

  const toggleInterest = (interest: string) => {
    setJoinForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-green-900">
      <Navbar 
        currentPage="about" 
        onJoinCommunity={() => setShowJoinModal(true)}
        onDonate={() => setShowDonationModal(true)}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">EcoFresh</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Empowering communities with real-time air quality data to build a cleaner, healthier future for everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="bg-black/30 rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-blue-400">{communityStats.members}</div>
              <div className="text-gray-300">Community Members</div>
            </div>
            <div className="bg-black/30 rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-green-400">{communityStats.cities}</div>
              <div className="text-gray-300">Cities Monitored</div>
            </div>
            <div className="bg-black/30 rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-purple-400">{communityStats.countries}</div>
              <div className="text-gray-300">Countries</div>
            </div>
            <div className="bg-black/30 rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-yellow-400">{communityStats.reports}</div>
              <div className="text-gray-300">Data Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 bg-black/30 rounded-xl p-2 border border-white/10">
            {[
              { id: 'mission', label: 'Our Mission', icon: '🎯' },
              { id: 'team', label: 'Our Team', icon: '👥' },
              { id: 'impact', label: 'Our Impact', icon: '🌍' },
              { id: 'technology', label: 'Technology', icon: '⚡' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {activeSection === 'mission' && (
            <div className="bg-black/30 rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">Democratizing Air Quality Data</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    We believe everyone deserves access to accurate, real-time air quality information. Our platform 
                    makes complex environmental data accessible and actionable for individuals, communities, and policymakers.
                  </p>
                  <h3 className="text-xl font-semibold text-green-400 mb-4">Building Healthier Communities</h3>
                  <p className="text-gray-300 leading-relaxed">
                    By providing actionable insights and fostering community engagement, we help people make informed 
                    decisions about their health and advocate for cleaner air in their neighborhoods.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-500/30">
                    <h4 className="text-lg font-semibold text-white mb-2">🌟 Vision</h4>
                    <p className="text-gray-300">A world where clean air is accessible to all, powered by data-driven decisions and community action.</p>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-6 border border-green-500/30">
                    <h4 className="text-lg font-semibold text-white mb-2">🎯 Goals</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Expand monitoring to 1000+ cities</li>
                      <li>• Build 1M+ member community</li>
                      <li>• Reduce urban pollution by 20%</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'team' && (
            <div className="bg-black/30 rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Meet Our Team</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-white/10 rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105">
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-white text-center mb-1">{member.name}</h3>
                    <p className="text-blue-400 text-sm text-center mb-3">{member.role}</p>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{member.bio}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.expertise.map(skill => (
                        <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'impact' && (
            <div className="bg-black/30 rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Impact</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {donationProjects.map((project, index) => (
                  <div key={index} className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-green-400">{project.current} / {project.goal}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(parseInt(project.current.replace(/[$,]/g, '')) / parseInt(project.goal.replace(/[$,]/g, ''))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Environmental Impact</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• 15% reduction in pollution exposure alerts</li>
                    <li>• 50+ policy changes influenced by our data</li>
                    <li>• 200+ community clean air initiatives</li>
                    <li>• 500,000+ health-conscious decisions made</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">👥 Community Growth</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• 300% increase in community engagement</li>
                    <li>• 50+ local environmental groups formed</li>
                    <li>• 10,000+ volunteers mobilized</li>
                    <li>• 25+ universities partnered</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'technology' && (
            <div className="bg-black/30 rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Technology</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-500/30">
                    <h3 className="text-xl font-semibold text-white mb-3">⚡ Real-time Processing</h3>
                    <p className="text-gray-300">Advanced algorithms process millions of data points every minute from our global sensor network.</p>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-6 border border-green-500/30">
                    <h3 className="text-xl font-semibold text-white mb-3">🤖 AI Predictions</h3>
                    <p className="text-gray-300">Machine learning models predict air quality trends up to 7 days in advance with 85% accuracy.</p>
                  </div>
                  <div className="bg-purple-500/20 rounded-xl p-6 border border-purple-500/30">
                    <h3 className="text-xl font-semibold text-white mb-3">📱 Mobile First</h3>
                    <p className="text-gray-300">Responsive design ensures critical air quality information is accessible anywhere, anytime.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Tech Stack</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['React', 'TypeScript', 'Node.js', 'Python', 'TensorFlow', 'AWS', 'MongoDB', 'Redis'].map(tech => (
                        <span key={tech} className="bg-gray-700 text-gray-300 px-3 py-2 rounded text-sm text-center">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Data Sources</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Government monitoring stations</li>
                      <li>• Community sensor networks</li>
                      <li>• Satellite imagery analysis</li>
                      <li>• Weather pattern integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Join Community Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowJoinModal(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-gray-900 rounded-2xl border border-white/20 max-w-2xl w-full shadow-2xl">
              <button
                onClick={() => setShowJoinModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200"
              >
                ✕
              </button>
              
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Join Our Community</h2>
                <p className="text-gray-300 mb-6">Connect with like-minded individuals working towards cleaner air for all.</p>
                
                <form onSubmit={handleJoinSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={joinForm.name}
                        onChange={(e) => setJoinForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={joinForm.email}
                        onChange={(e) => setJoinForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={joinForm.location}
                      onChange={(e) => setJoinForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Interests (select all that apply)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map(interest => (
                        <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={joinForm.interests.includes(interest)}
                            onChange={() => toggleInterest(interest)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-300 text-sm">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg transition-all duration-300 font-semibold"
                  >
                    Join Community
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDonationModal(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-gray-900 rounded-2xl border border-white/20 max-w-2xl w-full shadow-2xl">
              <button
                onClick={() => setShowDonationModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200"
              >
                ✕
              </button>
              
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Support Clean Air Initiatives</h2>
                <p className="text-gray-300 mb-6">Your donation helps expand air quality monitoring and education programs worldwide.</p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {donationProjects.map((project, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <h3 className="text-sm font-semibold text-white mb-2">{project.title}</h3>
                      <div className="text-xs text-gray-300 mb-2">{project.description}</div>
                      <div className="text-green-400 text-sm">{project.current} / {project.goal}</div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleDonation} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Donation Amount</label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {['10', '25', '50', '100'].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setDonationAmount(amount)}
                          className={`py-2 px-4 rounded-lg border transition-all ${
                            donationAmount === amount
                              ? 'bg-green-600 border-green-500 text-white'
                              : 'bg-white/10 border-white/20 text-gray-300 hover:border-white/40'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-300 mr-2">$</span>
                      <input
                        type="number"
                        min="1"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                        placeholder="Custom amount"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                    <h3 className="text-white font-semibold mb-2">💚 Your Impact</h3>
                    <p className="text-green-300 text-sm">
                      ${donationAmount} can fund air quality monitoring for {Math.floor(parseInt(donationAmount || '0') / 5)} days
                      in an underserved community.
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-300 font-semibold"
                  >
                    Donate ${donationAmount}
                  </button>
                  
                  <p className="text-xs text-gray-400 text-center">
                    Secure payment processing. Your donation is tax-deductible.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}