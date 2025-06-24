import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link, useNavigate } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slice/authSlice';
import { logoutUser } from '../api/user.api';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const authRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial navbar animation
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Logo hover animation setup
      const logo = logoRef.current;
      if (logo) {
        logo.addEventListener('mouseenter', () => {
          gsap.to(logo, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        logo.addEventListener('mouseleave', () => {
          gsap.to(logo, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }

      // Auth section animation
      if (authRef.current) {
        gsap.fromTo(authRef.current.children,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1, delay: 0.3 }
        );
      }

    }, navRef);

    return () => ctx.revert();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    // Logout button animation
    const button = authRef.current?.querySelector('button');
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }

    try {
      await logoutUser();
      dispatch(logout());
      navigate({ to: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, clear the local state
      dispatch(logout());
      navigate({ to: '/' });
    }
  };

  return (
    <nav ref={navRef} className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - App Name */}
          <div className="flex items-center">
            <Link
              ref={logoRef}
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-purple-300 transition-all duration-300"
            >
              ⚡ LinkSnap
            </Link>
          </div>

          {/* Right side - Auth buttons */}
          <div ref={authRef} className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-300 font-medium">Welcome, {user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;