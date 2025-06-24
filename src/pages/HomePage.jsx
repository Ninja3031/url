
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import UrlForm from '../components/UrlForm'

const HomePage = () => {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const featuresRef = useRef(null)
  const formRef = useRef(null)
  const footerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current, featuresRef.current, formRef.current, footerRef.current], {
        opacity: 0,
        y: 50
      })

      // Create timeline for entrance animations
      const tl = gsap.timeline()

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")
      .to(featuresRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1
      }, "-=0.3")
      .to(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.2")
      .to(footerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.3")



      // Add subtle glow animation to title
      gsap.to(titleRef.current, {
        textShadow: "0 0 20px rgba(34, 211, 238, 0.3)",
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-4xl">
        <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
          Shorten Your Links
        </h1>
        <p ref={subtitleRef} className="text-xl text-gray-300 mb-8 leading-relaxed">
          Transform long, complex URLs into clean, shareable links in seconds.
          <br className="hidden sm:block" />
          Track clicks, customize slugs, and manage all your links in one place.
        </p>

        {/* Feature highlights */}
        <div ref={featuresRef} className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center space-x-2 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300">
            <span className="text-emerald-400">✓</span>
            <span className="text-gray-300 font-medium">Free Forever</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300">
            <span className="text-emerald-400">✓</span>
            <span className="text-gray-300 font-medium">Custom URLs</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300">
            <span className="text-emerald-400">✓</span>
            <span className="text-gray-300 font-medium">Click Analytics</span>
          </div>
        </div>
      </div>

      {/* URL Form Card */}
      <div ref={formRef} className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-lg">
        <UrlForm/>
      </div>

      {/* Bottom decoration */}
      <div ref={footerRef} className="mt-16 text-center">
        <p className="text-gray-400 text-sm">
          Join thousands of users who trust LinkSnap for their URL shortening needs
        </p>
      </div>
    </div>
  )
}

export default HomePage