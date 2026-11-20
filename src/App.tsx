import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import CustomersPage from './pages/CustomersPage'
import TrainingsPage from './pages/TrainingsPage'

function App() {
    return (
        <>
            <CssBaseline />

            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Personal Trainer
                    </Typography>

                    <Button
                        component={NavLink}
                        to="/customers"
                        sx={{
                            color: '#ffffff',
                            mx: 0.5,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            },
                            '&.active': {
                                backgroundColor: '#ffffff',
                                color: '#1976d2',
                            },
                        }}
                    >
                        Customers
                    </Button>

                    <Button
                        component={NavLink}
                        to="/trainings"
                        sx={{
                            color: '#ffffff',
                            mx: 0.5,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            },
                            '&.active': {
                                backgroundColor: '#ffffff',
                                color: '#1976d2',
                            },
                        }}
                    >
                        Trainings
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/customers" replace />}
                    />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/trainings" element={<TrainingsPage />} />
                </Routes>
            </Container>
        </>
    )
}

export default App