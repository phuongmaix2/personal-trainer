import { lazy, Suspense } from 'react'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'

const CustomersPage = lazy(() => import('./pages/CustomersPage'))
const TrainingsPage = lazy(() => import('./pages/TrainingsPage'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'))

const navigationItems = [
    {
        label: 'Customers',
        path: '/customers',
        icon: <GroupsOutlinedIcon fontSize="small" />,
    },
    {
        label: 'Trainings',
        path: '/trainings',
        icon: <FitnessCenterOutlinedIcon fontSize="small" />,
    },
    {
        label: 'Calendar',
        path: '/calendar',
        icon: <CalendarMonthOutlinedIcon fontSize="small" />,
    },
    {
        label: 'Statistics',
        path: '/statistics',
        icon: <BarChartOutlinedIcon fontSize="small" />,
    },
]

function App() {
    return (
        <>
            <CssBaseline />

            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background:
                        'linear-gradient(120deg, #0f172a 0%, #0f766e 70%, #0891b2 100%)',
                    boxShadow: '0 8px 30px rgba(15, 23, 42, 0.2)',
                }}
            >
                <Toolbar
                    sx={{
                        width: '100%',
                        maxWidth: 1536,
                        minHeight: {
                            xs: 68,
                            md: 80,
                        },
                        mx: 'auto',
                        px: {
                            xs: 1,
                            sm: 2,
                        },
                    }}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 3,
                                display: {
                                    xs: 'none',
                                    sm: 'grid',
                                },
                                placeItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <FitnessCenterOutlinedIcon />
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Typography
                                variant="h6"
                                sx={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
                            >
                                Personal Trainer
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                                Training management
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 0.5,
                            overflowX: 'auto',
                        }}
                    >
                        {navigationItems.map((item) => (
                            <Button
                                key={item.path}
                                component={NavLink}
                                to={item.path}
                                aria-label={item.label}
                                sx={{
                                    minWidth: { xs: 44, sm: 'auto' },
                                    px: { xs: 1, sm: 1.5 },
                                    color: 'rgba(255, 255, 255, 0.88)',
                                    borderRadius: 2.5,
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.14)',
                                    },
                                    '&.active': {
                                        backgroundColor: '#ffffff',
                                        color: '#0f766e',
                                        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.18)',
                                    },
                                }}
                            >
                                {item.icon}
                                <Box
                                    component="span"
                                    sx={{
                                        display: { xs: 'none', sm: 'inline' },
                                        ml: 0.75,
                                    }}
                                >
                                    {item.label}
                                </Box>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="main"
                sx={{
                    minHeight: 'calc(100vh - 80px)',
                    background:
                        'radial-gradient(circle at 8% 0%, rgba(45, 212, 191, 0.18), transparent 28%), #f4f7fb',
                    py: {
                        xs: 3,
                        md: 5,
                    },
                }}
            >
                <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Suspense
                        fallback={
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    py: 10,
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        }
                    >
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to="/customers" replace />}
                            />
                            <Route path="/customers" element={<CustomersPage />} />
                            <Route path="/trainings" element={<TrainingsPage />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/statistics" element={<StatisticsPage />} />
                        </Routes>
                    </Suspense>
                </Container>
            </Box>
        </>
    )
}

export default App
