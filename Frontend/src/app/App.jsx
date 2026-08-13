import './App.css'
import { routes } from './app.routes'
import { RouterProvider } from 'react-router'
import { AuthProvider } from '../features/auth/state/auth.context'

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  )
}

export default App