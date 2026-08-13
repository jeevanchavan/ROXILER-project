import { useAuth } from '../features/auth/hooks/useAuth'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {

    const { user, loading } = useAuth()


    if (loading) {
        return <main>
            <h1>Loading...</h1>
        </main>
    }

    if (!user) {
        return <Navigate to='/' replace />
    }

    return children
}

export default ProtectedRoute