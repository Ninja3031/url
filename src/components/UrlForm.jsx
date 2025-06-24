import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { createShortUrl } from '../api/shortUrl.api'
import { useSelector } from 'react-redux'
import { queryClient } from '../main'

const UrlForm = () => {

  const [url, setUrl] = useState("https://www.google.com")
  const [shortUrl, setShortUrl] = useState()
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)
  const [customSlug, setCustomSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {isAuthenticated} = useSelector((state) => state.auth)

  const formRef = useRef(null)
  const resultRef = useRef(null)
  const errorRef = useRef(null)
  const buttonRef = useRef(null)

  const handleSubmit = async () => {
    setIsLoading(true)

    // Button loading animation
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    })

    try{
      const shortUrl = await createShortUrl(url,customSlug)
      setShortUrl(shortUrl)
      queryClient.invalidateQueries({queryKey: ['userUrls']})
      setError(null)

      // Animate result appearance
      if (resultRef.current) {
        gsap.fromTo(resultRef.current,
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
        )
      }
    }catch(err){
      setError(err.message)

      // Animate error appearance
      if (errorRef.current) {
        gsap.fromTo(errorRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
        )

        // Shake animation for error
        gsap.to(errorRef.current, {
          x: [-5, 5, -5, 5, 0],
          duration: 0.5,
          ease: "power2.out"
        })
      }
    }
    setIsLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    // Copy button animation
    const copyButton = resultRef.current?.querySelector('button')
    if (copyButton) {
      gsap.to(copyButton, {
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      })
    }

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  // Clear animations when shortUrl changes
  useEffect(() => {
    if (!shortUrl && resultRef.current) {
      gsap.set(resultRef.current, { opacity: 0 })
    }
  }, [shortUrl])

  useEffect(() => {
    if (!error && errorRef.current) {
      gsap.set(errorRef.current, { opacity: 0 })
    }
  }, [error])

  return (
    <div ref={formRef} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-gray-300 mb-2">
            🔗 Enter your URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onInput={(event)=>setUrl(event.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-gray-700/50 hover:bg-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {isAuthenticated && (
          <div>
            <label htmlFor="customSlug" className="block text-sm font-semibold text-gray-300 mb-2">
              ✨ Custom URL (optional)
            </label>
            <input
              type="text"
              id="customSlug"
              value={customSlug}
              onChange={(event) => setCustomSlug(event.target.value)}
              placeholder="my-awesome-link"
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-700/50 hover:bg-gray-700 text-white placeholder-gray-400"
            />
          </div>
        )}

        <button
          ref={buttonRef}
          onClick={handleSubmit}
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? '🔄 Processing...' : '⚡ Shorten URL'}
        </button>

         {error && (
          <div ref={errorRef} className="p-4 bg-red-900/50 border border-red-500/50 text-red-300 rounded-xl">
            <div className="flex items-center">
              <span className="text-red-400 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {shortUrl && (
          <div ref={resultRef} className="mt-8 p-6 bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 rounded-xl border border-emerald-500/50">
            <h2 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
              🎉 Your shortened URL:
            </h2>
            <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <input
                type="text"
                readOnly
                value={shortUrl}
                className="flex-1 p-3 bg-transparent border-none focus:outline-none text-gray-200 font-mono"
              />
               <button
                onClick={handleCopy}
                className={`px-6 py-3 font-semibold transition-all duration-300 ${
                  copied
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
  )
}

export default UrlForm