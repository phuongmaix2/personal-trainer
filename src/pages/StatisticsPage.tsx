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
            <Typography variant="h4" component="h1" gutterBottom>
                Training Statistics
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
                Total training time: {totalMinutes} minutes
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
                                fill="#1976d2"
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