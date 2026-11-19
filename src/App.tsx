import { Navigate, Route, Routes } from 'react-router-dom'
import CustomersPage from './pages/CustomersPage'
import TrainingsPage from './pages/TrainingsPage'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/customers" replace />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
        </Routes>
    )
}

export default App