import { useAuth } from '../hooks/useAuth'
import { Navigate, useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {

    const { user, loading } = useAuth()

    const navigate = useNavigate()


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