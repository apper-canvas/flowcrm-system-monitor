import { createContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider, useDispatch } from 'react-redux'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import Layout from './Layout'
import { routes, routeArray } from './config/routes'

// Redux slice for user management
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = JSON.parse(JSON.stringify(action.payload))
      state.isAuthenticated = !!action.payload
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

// Configure Redux store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
})

// Create auth context
export const AuthContext = createContext(null)

// Login Component
const Login = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    if (window.ApperSDK && !isInitialized) {
      const { ApperUI } = window.ApperSDK
      ApperUI.showLogin("#authentication")
      setIsInitialized(true)
    }
  }, [isInitialized])

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Welcome Back</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign in to your account</p>
        </div>
        <div id="authentication" className="min-h-[400px]" />
      </div>
    </div>
  )
}

// Signup Component
const Signup = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    if (window.ApperSDK && !isInitialized) {
      const { ApperUI } = window.ApperSDK
      ApperUI.showSignup("#authentication")
      setIsInitialized(true)
    }
  }, [isInitialized])

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Create Account</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign up for your account</p>
        </div>
        <div id="authentication" className="min-h-[400px]" />
      </div>
    </div>
  )
}

// Callback Component
const Callback = () => {
  useEffect(() => {
    if (window.ApperSDK) {
      const { ApperUI } = window.ApperSDK
      ApperUI.showSSOVerify("#authentication-callback")
    }
  }, [])
  
  return <div id="authentication-callback"></div>
}

// Error Page Component
const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Authentication Error</h1>
        <p className="text-surface-700 dark:text-surface-300 mb-6">An error occurred during authentication</p>
      </div>
    </div>
  )
}

// Main App Component
const AppContent = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    if (window.ApperSDK) {
      const { ApperClient, ApperUI } = window.ApperSDK
      
      const client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      ApperUI.setup(client, {
        target: '#authentication',
        clientId: import.meta.env.VITE_APPER_PROJECT_ID,
        view: 'both',
        onSuccess: function (user) {
          setIsInitialized(true)
          let currentPath = window.location.pathname + window.location.search
          let redirectPath = new URLSearchParams(window.location.search).get('redirect')
          const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                             currentPath.includes('/callback') || currentPath.includes('/error')
          
          if (user) {
            if (redirectPath) {
              navigate(redirectPath)
            } else if (!isAuthPage) {
              if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                navigate(currentPath)
              } else {
                navigate('/dashboard')
              }
            } else {
              navigate('/dashboard')
            }
            dispatch(setUser(JSON.parse(JSON.stringify(user))))
          } else {
            if (!isAuthPage) {
              navigate('/login')
            } else if (redirectPath) {
              navigate(`/login?redirect=${redirectPath}`)
            } else if (isAuthPage) {
              navigate(currentPath)
            } else {
              navigate('/login')
            }
            dispatch(clearUser())
          }
        },
        onError: function(error) {
          console.error("Authentication failed:", error)
          setIsInitialized(true)
        }
      })
    }
  }, [navigate, dispatch])
  
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK
        await ApperUI.logout()
        dispatch(clearUser())
        navigate('/login')
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }
  
  if (!isInitialized) {
    return <div className="loading">Initializing application...</div>
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          {routeArray.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </AuthContext.Provider>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <AppContent />
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App