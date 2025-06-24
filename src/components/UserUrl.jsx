import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useQuery } from '@tanstack/react-query'
import { getAllUserUrls } from '../api/user.api'

const UserUrl = () => {
  const { data: urls, isLoading, isError, error } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    refetchInterval: 30000, // Refetch every 30 seconds to update click counts
    staleTime: 0, // Consider data stale immediately so it refetches when invalidated
  })
  const [copiedId, setCopiedId] = useState(null)
  const tableRef = useRef(null)
  const rowsRef = useRef([])

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)

    // Find the button and animate it
    const button = rowsRef.current.find(row => row?.dataset?.id === id)?.querySelector('button')
    if (button) {
      gsap.to(button, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      })
    }

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  // Animate table rows when data loads
  useEffect(() => {
    if (urls?.urls && rowsRef.current.length > 0) {
      gsap.fromTo(rowsRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1
        }
      )
    }
  }, [urls])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent absolute top-0 left-0"></div>
        </div>
        <span className="ml-3 text-gray-300 font-medium">Loading your URLs...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl">
          <div className="flex items-center">
            <span className="text-red-400 text-xl mr-3">⚠️</span>
            <div>
              <p className="font-semibold">Error loading your URLs</p>
              <p className="text-sm text-red-400">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!urls.urls || urls.urls.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="text-6xl mb-4">🔗</div>
        <p className="text-xl font-semibold text-gray-300 mb-2">No URLs found</p>
        <p className="text-gray-400">You haven't created any shortened URLs yet. Create your first one above!</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto max-h-96">
        <table ref={tableRef} className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-700 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                🔗 Original URL
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                ⚡ Short URL
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                📊 Clicks
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                🎯 Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {urls.urls.reverse().map((url, index) => (
              <tr
                key={url._id}
                ref={el => rowsRef.current[index] = el}
                data-id={url._id}
                className="hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300 group"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    x: 5,
                    duration: 0.3,
                    ease: "power2.out"
                  })
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    x: 0,
                    duration: 0.3,
                    ease: "power2.out"
                  })
                }}
              >
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-200 truncate max-w-xs font-medium">
                    {url.full_url}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <a
                      href={`http://localhost:3000/${url.short_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-purple-400 hover:underline font-mono bg-gray-700/50 px-2 py-1 rounded-md transition-colors duration-300 group-hover:bg-gray-600/50"
                    >
                      localhost:3000/{url.short_url}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-200">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-cyan-900/50 to-purple-900/50 text-cyan-300 border border-cyan-500/30 group-hover:from-cyan-800/50 group-hover:to-purple-800/50 transition-all duration-300">
                      {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => handleCopy(`http://localhost:3000/${url.short_url}`, url._id)}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                      copiedId === url._id
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-400 hover:to-green-400 shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 shadow-cyan-500/25'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-800`}
                  >
                    {copiedId === url._id ? (
                      <>
                        <span className="mr-1">✓</span>
                        Copied!
                      </>
                    ) : (
                      <>
                        <span className="mr-1">📋</span>
                        Copy
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserUrl