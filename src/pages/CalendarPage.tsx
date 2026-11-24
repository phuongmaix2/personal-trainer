import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import timeGridPlugin from '@fullcalendar/react/timegrid'
import monarchThemePlugin from '@fullcalendar/react/themes/monarch'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { getTrainings } from '../api/trainingApi'
import type { Training } from '../types'

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/monarch/theme.css'
import '@fullcalendar/react/themes/monarch/palettes/blue.css'

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
            <Typography
                variant="h4"
                component="h1"
                sx={{ mb: 2 }}
            >
                Training Calendar
            </Typography>

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
                    slotMinTime="06:00:00"
                    slotMaxTime="22:00:00"
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }}
                />
            )}
        </Box>
    )
}

export default CalendarPage