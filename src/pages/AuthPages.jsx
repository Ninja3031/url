import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

const AuthPage = () => {
    const [login, setLogin] = useState(true)
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const formRef = useRef(null)
    const footerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set([headerRef.current, formRef.current, footerRef.current], {
                opacity: 0,
                y: 30
            })

            // Create entrance animation
            const tl = gsap.timeline()

            tl.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            })
            .to(formRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.4")
            .to(footerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.3")



        }, containerRef)

        return () => ctx.revert()
    }, [])

    // Animate form transition when switching between login/register
    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(formRef.current,
                { opacity: 0, x: login ? -20 : 20 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
            )
        }
    }, [login])

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div ref={headerRef} className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    Welcome to LinkSnap
                </h1>
                <p className="text-gray-300">
                    {login ? 'Sign in to manage your URLs' : 'Create an account to get started'}
                </p>
            </div>

            {/* Auth Form */}
            <div ref={formRef} className="w-full max-w-md">
                {login ? <LoginForm state={setLogin} /> : <RegisterForm state={setLogin} />}
            </div>

            {/* Footer */}
            <div ref={footerRef} className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                    Secure, fast, and reliable URL shortening service
                </p>
            </div>
        </div>
    )
}

export default AuthPage