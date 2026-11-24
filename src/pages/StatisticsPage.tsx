import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { getTrainings } from '../api/trainingApi'

type ActivityStatistics = {
    activity: string
    minutes: number
}

function StatisticsPage() {
    const [statistics, setStatistics] = useState<
        ActivityStatistics[]
    >([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getTrainings()
            .then((trainings) => {
                const minutesByActivity = trainings.reduce<
                    Record<string, number>
                >((totals, training) => {
                    const activity =
                        training.activity.trim() || 'Unknown'

                    totals[activity] =
                        (totals[activity] ?? 0) + training.duration

                    return totals
                }, {})

                const data = Object.entries(minutesByActivity)
                    .map(([activity, minutes]) => ({
                        activity,
                        minutes,
                    }))
                    .sort((first, second) =>
                        second.minutes - first.minutes,
                    )

                setStatistics(data)
                setError('')
            })
            .catch((error: unknown) => {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch statistics'

                setError(message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const totalMinutes = statistics.reduce(
        (total, item) => total + item.minutes,
        0,
    )

    return (
        <Box>
            <Paper
                sx={{
                    p: { xs: 2.5, md: 3 },
                    mb: 3,
                    borderRadius: 4,
                    color: '#ffffff',
                    background:
                        'linear-gradient(135deg, #0f172a 0%, #0f766e 100%)',
                    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)',
                }}
            >
                <Typography
                    variant="overline"
                    sx={{ color: '#99f6e4', fontWeight: 800, letterSpacing: 1.4 }}
                >
                    Performance insights
                </Typography>
                <Typography variant="h4" component="h1">
                    Training Statistics
                </Typography>
                <Typography sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.76)' }}>
                    Total training time
                </Typography>
                <Typography sx={{ mt: 0.25, fontSize: '2rem', fontWeight: 800 }}>
                    {totalMinutes.toLocaleString()} minutes
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
            ) : statistics.length === 0 ? (
                <Alert severity="info">
                    No training data available.
                </Alert>
            ) : (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        height: Math.max(420, statistics.length * 50),
                        borderColor: '#e2e8f0',
                        borderRadius: 3,
                        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={statistics}
                            layout="vertical"
                            margin={{
                                top: 10,
                                right: 30,
                                bottom: 30,
                                left: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                allowDecimals={false}
                                label={{
                                    value: 'Minutes',
                                    position: 'insideBottom',
                                    offset: -15,
                                }}
                            />
                            <YAxis
                                type="category"
                                dataKey="activity"
                                width={120}
                            />
                            <Tooltip />
                            <Bar
                                dataKey="minutes"
                                name="Minutes"
                                fill="#0f766e"
                                radius={[0, 6, 6, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            )}
        </Box>
    )
}

export default StatisticsPage
