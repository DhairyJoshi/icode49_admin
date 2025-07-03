import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { loginAPI } from '../api'
import { useContext } from 'react'
import { NotificationContext } from '../components/NotificationProvider'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { showNotification } = useContext(NotificationContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await loginAPI(username, password)
      if (data.status === 'true' || data.statuscode === 200) {
        login({
          ...data.data,
          token: data.token || data.data.token,
          username: username
        })
        showNotification({ message: 'Login successful!', type: 'success' })
        navigate('/')
      } else {
        showNotification({ message: data.message || 'Invalid username or password', type: 'error' })
      }
    } catch (err) {
      showNotification({ message: 'Network error', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-2 font-raleway">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden border border-pink-100">
        {/* Left Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center md:w-1/2 bg-pink-100 relative p-4 lg:p-8">
          <img src="/images/login_bg.svg" alt="Illustration" className="w-48 h-48 lg:w-72 lg:h-72 object-contain mx-auto" />
          <div className="mt-6 lg:mt-8 text-center">
            <h2 className="text-xl lg:text-2xl font-bold text-pink-600 mb-2">Turn your ideas into reality.</h2>
            <p className="text-pink-700 text-sm lg:text-base">Login to access icode49's admin panel</p>
          </div>
        </div>
        {/* Right Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-8 sm:py-12">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-16 mb-2 flex items-center justify-center">
              <img src="/images/logo.png" alt="Logo" className="max-h-full max-w-full object-contain" style={{aspectRatio: '2.5/1'}} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Login to your Account</h2>
            <p className="text-gray-500 text-xs sm:text-sm">See what is going on with your business</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-pink-600"
                placeholder="mail@abc.com"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-pink-600 pr-10"
                  placeholder=""
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-600 focus:outline-none"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    // Provided Eye-slash SVG
                    <svg fill="#000000" width="20" height="20" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>eye-slash</title><path d="M18.822 22.904c-5.215 1.275-10.524-1.051-15.818-6.904 1.337-1.501 2.79-2.843 4.364-4.034l0.076-0.055c0.186-0.138 0.305-0.357 0.305-0.604 0-0.414-0.336-0.75-0.75-0.75-0.166 0-0.32 0.054-0.444 0.146l0.002-0.001c-1.91 1.447-3.588 3.024-5.086 4.761l-0.036 0.042c-0.115 0.131-0.185 0.305-0.185 0.494s0.070 0.363 0.186 0.495l-0.001-0.001c4.803 5.488 9.693 8.254 14.582 8.254 1.123-0.001 2.212-0.142 3.252-0.406l-0.092 0.020c0.332-0.082 0.573-0.377 0.573-0.729 0-0.414-0.336-0.75-0.75-0.75-0.064 0-0.125 0.008-0.184 0.023l0.005-0.001zM16.75 20c-0-0.414-0.336-0.75-0.75-0.75v0c-1.794-0.002-3.248-1.456-3.25-3.25v-0c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0c0.003 2.622 2.128 4.747 4.75 4.75h0c0.414-0 0.75-0.336 0.75-0.75v0zM23.565 22.503c2.701-1.672 5.010-3.665 6.965-5.967l0.034-0.042c0.116-0.131 0.186-0.304 0.186-0.494s-0.070-0.363-0.187-0.495l0.001 0.001c-6.844-7.82-13.822-10.081-20.758-6.76l-7.277-7.276c-0.135-0.131-0.32-0.212-0.523-0.212-0.414 0-0.75 0.336-0.75 0.75 0 0.203 0.081 0.388 0.213 0.523l27.999 28.001c0.136 0.136 0.324 0.22 0.531 0.22 0.415 0 0.751-0.336 0.751-0.751 0-0.207-0.084-0.395-0.22-0.531v0zM28.996 16c-1.852 2.121-4.004 3.919-6.402 5.345l-0.121 0.067-2.636-2.635c0.569-0.767 0.911-1.731 0.912-2.776v-0c-0.003-2.622-2.128-4.747-4.75-4.75h-0c-1.045 0.002-2.009 0.344-2.789 0.921l0.013-0.009-2.29-2.29c6.027-2.647 11.95-0.64 18.062 6.127zM14.301 13.239c0.486-0.307 1.077-0.489 1.711-0.489 1.788 0 3.238 1.45 3.238 3.238 0 0.634-0.182 1.225-0.497 1.724l0.008-0.013z"></path></svg>
                  ) : (
                    // Provided Eye SVG
                    <svg fill="#000000" width="20" height="20" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>eye</title><path d="M30.564 15.506c-9.59-10.957-19.543-10.957-29.129 0-0.115 0.131-0.185 0.305-0.185 0.494s0.070 0.363 0.186 0.495l-0.001-0.001c4.793 5.479 9.693 8.256 14.563 8.256h0.001c4.869 0 9.771-2.777 14.564-8.256 0.116-0.131 0.186-0.304 0.186-0.494s-0.070-0.363-0.187-0.495l0.001 0.001zM3.004 16c8.704-9.626 17.291-9.622 25.992 0-8.703 9.621-17.291 9.621-25.992 0zM16 11.25c-2.623 0-4.75 2.127-4.75 4.75s2.127 4.75 4.75 4.75c2.623 0 4.75-2.127 4.75-4.75v0c-0.003-2.622-2.128-4.747-4.75-4.75h-0zM16 19.25c-1.795 0-3.25-1.455-3.25-3.25s1.455-3.25 3.25-3.25c1.795 0 3.25 1.455 3.25 3.25v0c-0.002 1.794-1.456 3.248-3.25 3.25h-0z"></path></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2 accent-pink-600"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  disabled={loading}
                />
                Remember Me
              </label>
              <button type="button" className="text-sm text-pink-600 hover:underline" disabled={loading}>Forgot Password?</button>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition mb-2"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 