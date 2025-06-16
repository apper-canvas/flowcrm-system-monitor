import React, { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'
import SearchBar from '@/components/molecules/SearchBar'

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" size={24} />
            </button>
            <div className="flex items-center ml-2 lg:ml-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={18} className="text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">FlowCRM</h1>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <ApperIcon name="Bell" size={20} />
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={18} className="text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-shrink-0 w-64 bg-surface border-r border-gray-200 z-40">
          <div className="flex flex-col w-full overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} className="mr-3" />
                  {route.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={toggleMobileMenu}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-gray-200 z-50 lg:hidden"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center h-16 px-4 border-b border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Zap" size={18} className="text-white" />
                    </div>
                    <h1 className="ml-3 text-xl font-bold text-gray-900">FlowCRM</h1>
                  </div>
                  <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={toggleMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={20} className="mr-3" />
                        {route.label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout