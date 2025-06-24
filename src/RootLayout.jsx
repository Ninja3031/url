import { useEffect } from 'react'
import Navbar from './components/NavBar'
import { Outlet } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from './api/user.api'
import { login } from './store/slice/authSlice'

const RootLayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await getCurrentUser()
        if (response?.user) {
          dispatch(login(response.user))
        }
      } catch (error) {
        // User is not authenticated, which is fine
        console.log('User not authenticated')
      }
    }

    initializeAuth()
  }, [dispatch])

  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default RootLayout