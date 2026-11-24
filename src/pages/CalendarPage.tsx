import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import timeGridPlugin from '@fullcalendar/react/timegrid'
import monarchThemePlugin from '@fullcalendar/react/themes/monarch'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { getTrainings } from '../api/trainingApi'
import type { Training } from '../types'

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/monarch/theme.css'
import '@fullcalendar/react/themes/monarch/palettes/green.css'

function CalendarPage() {
    const [trainings, setTrainings] = useState<Training[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getTrainings()
            .then((data) => {
                setTrainings(data)
                setError('')
            })
            .catch((error: unknown) => {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch trainings'

                setError(message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const events = trainings.map((training) => ({
        id: training.id.toString(),
        title: `${training.activity} – ${training.customer.firstname} ${training.customer.lastname}`,
        start: training.date,
        end: dayjs(training.date)
            .add(training.duration, 'minute')
            .toISOString(),
    }))

    return (
        <Box>
            <Paper
                sx={{
                    p: { xs: 2.5, md: 3 },
                    mb: 3,
                    borderRadius: 4,
                    border: '1px solid rgba(15, 118, 110, 0.12)',
                    background:
                        'linear-gradient(135deg, #ffffff 0%, #ecfeff 100%)',
                    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.07)',
                }}
            >
                <Typography
                    variant="overline"
                    sx={{ color: '#0f766e', fontWeight: 800, letterSpacing: 1.4 }}
                >
                    Schedule overview
                </Typography>
                <Typography variant="h4" component="h1">
                    Training Calendar
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Explore every session by month, week or day.
                </Typography>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 8,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Paper
                    variant="outlined"
                    sx={{
                        p: {
                            xs: 1,
                            sm: 2,
                        },
                        borderColor: '#e2e8f0',
                        borderRadius: 3,
                        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                        overflow: 'hidden',
                    }}
                >
                    <FullCalendar
                    plugins={[
                        monarchThemePlugin,
                        dayGridPlugin,
                        timeGridPlugin,
                    ]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        start: 'prev,next today',
                        center: 'title',
                        end: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    buttons={{
                        today: {
                            text: 'Today',
                        },
                        dayGridMonth: {
                            text: 'Month',
                        },
                        timeGridWeek: {
                            text: 'Week',
                        },
                        timeGridDay: {
                            text: 'Day',
                        },
                    }}
                    events={events}
                    firstDay={1}
                    nowIndicator
                    allDaySlot={false}
                    height="auto"
                    slotMinTime="00:00:00"
                    slotMaxTime="24:00:00"
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }}
                    />
                </Paper>
            )}
        </Box>
    )
}

export default CalendarPage
