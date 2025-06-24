import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import UrlForm from '../components/UrlForm'
import UserUrl from '../components/UserUrl'

const DashboardPage = () => {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const formSectionRef = useRef(null)
  const urlsSectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([headerRef.current, formSectionRef.current, urlsSectionRef.current], {
        opacity: 0,
        y: 50
      })

      // Create staggered entrance animation
      const tl = gsap.timeline()

      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .to(formSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")
      .to(urlsSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")



    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-300">Manage and track all your shortened URLs</p>
        </div>

        {/* URL Form Section */}
        <div ref={formSectionRef} className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/50 mb-8 hover:shadow-cyan-500/10 transition-shadow duration-500">
          <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center">
            🔗 Create New Short URL
          </h2>
          <UrlForm/>
        </div>

        {/* URLs List Section */}
        <div ref={urlsSectionRef} className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden hover:shadow-purple-500/10 transition-shadow duration-500">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-gray-200 flex items-center">
              📊 Your URLs
            </h2>
            <p className="text-gray-400 text-sm mt-1">Track performance and manage your links</p>
          </div>
          <UserUrl/>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage