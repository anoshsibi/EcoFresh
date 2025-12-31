import { useState } from 'react'
import Navbar from './Navbar'

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  loginTime: string
}

interface AboutProps {
  userData?: UserData | null
  onLogout?: () => void
}

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
  expertise: string[]
}



export default function About({ userData, onLogout }: AboutProps) {
  const [activeSection, setActiveSection] = useState('mission')

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Anosh Sibi',
      role: '2447211',
      bio: 'Passionate about technology and innovation.',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      expertise: ['Full Stack Developer', 'UI/UX Designer', 'Data Science']
    },
    {
      id: '2',
      name: 'Thushar Ghosh',
      role: '24472',
      bio: 'Expert in real-time data processing and IoT sensor networks for environmental monitoring.',
      imageUrl: 'https://picsum.photos/300/300?random=2',
      expertise: ['IoT Systems', 'Real-time Analytics', 'Machine Learning']
    },
    {
      id: '3',
      name: 'Agno C Benny',
      role: '2447204',
      bio: 'Adept in backend development and data science.',
      imageUrl: 'https://picsum.photos/300/300?random=3',
      expertise: ['Backend Developer', 'Data Science', 'Web Developer']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-green-900">
      <Navbar 
        currentPage="about" 
        onLogout={onLogout}
        userEmail={userData?.email}
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

        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 bg-black/30 rounded-xl p-2 border border-white/10">
            {[
              { id: 'mission', label: 'Our Mission', icon: '🎯' },
              { id: 'team', label: 'Our Team', icon: '👥' }
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-white/10 rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105">
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-white text-center mb-2">{member.name}</h3>
                    <p className="text-blue-400 text-sm text-center mb-3 font-mono">{member.role}</p>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed text-center">{member.bio}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise.map(skill => (
                        <span key={skill} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}