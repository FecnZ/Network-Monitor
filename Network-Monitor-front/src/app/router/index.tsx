import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layout/MainLayout'
import { HomePage } from '../../pages/home/HomePage'
import { DevicesPage } from '../../pages/devices/DevicesPage'
import { DeviceDetailPage } from '../../pages/devices/DeviceDetailPage'
import { SettingsPage } from '../../pages/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'devices',
        element: <DevicesPage />,
      },
      {
        path: 'devices/:id',
        element: <DeviceDetailPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      }
    ],
  },
])
