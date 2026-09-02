import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useTheme } from '../shared/theme/useTheme'

export default function App() {
  useTheme() // Inicia el tema al cargar la app

  return <RouterProvider router={router} />
}
