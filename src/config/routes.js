import Dashboard from '@/components/pages/Dashboard'
import Customers from '@/components/pages/Customers'
import Leads from '@/components/pages/Leads'
import Tasks from '@/components/pages/Tasks'
import Reports from '@/components/pages/Reports'
import Settings from '@/components/pages/Settings'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
    component: Customers
  },
  leads: {
    id: 'leads',
    label: 'Leads',
    path: '/leads',
    icon: 'Target',
    component: Leads
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
}

export const routeArray = Object.values(routes)
export default routes