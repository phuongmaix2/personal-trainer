import { useEffect, useState, useCallback } from 'react'
import dayjs from 'dayjs'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { getTrainings } from '../api/trainingApi'
import type { Training } from '../types'
import DeleteTrainingDialog from '../components/DeleteTrainingDialog'

type TrainingRow = Training & {
    customerName: string
    formattedDate: string
}


function TrainingsPage() {
    const [trainings, setTrainings] = useState<Training[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchTrainings = useCallback(() => {
        return getTrainings()
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

    useEffect(() => {
        void fetchTrainings()
    }, [fetchTrainings])

    const columns: GridColDef<TrainingRow>[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            minWidth: 170,
            renderCell: (params) =>
                dayjs(params.row.date).format('DD.MM.YYYY HH:mm'),
        },
        {
            field: 'activity',
            headerName: 'Activity',
            flex: 1,
        },
        {
            field: 'duration',
            headerName: 'Duration (min)',
            width: 140,
        },
        {
            field: 'customerName',
            headerName: 'Customer',
            flex: 1,
            minWidth: 170,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <DeleteTrainingDialog
                    training={params.row}
                    onTrainingDeleted={fetchTrainings}
                />
            ),
        },
    ]

    const rows: TrainingRow[] = trainings.map((training) => ({
        ...training,
        customerName: `${training.customer.firstname} ${training.customer.lastname}`,
        formattedDate: dayjs(training.date).format(
            'DD.MM.YYYY HH:mm',
        ),
    }))

    const filteredTrainings = rows.filter((training) => {
        const searchText = search.toLowerCase()

        return [
            training.activity,
            training.duration.toString(),
            training.customerName,
            training.formattedDate,
        ].some((value) => value.toLowerCase().includes(searchText))
    })

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
                    Session log
                </Typography>
                <Typography variant="h4" component="h1">
                    Trainings
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    {trainings.length} scheduled training sessions
                </Typography>

                <TextField
                    label="Search trainings"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    size="small"
                    sx={{
                        mt: 3,
                        width: { xs: '100%', sm: 360 },
                        backgroundColor: '#ffffff',
                    }}
                />
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredTrainings}
                    columns={columns}
                    loading={loading}
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                                page: 0,
                            },
                        },
                    }}
                    sx={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: 3,
                        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: '#f8fafc',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 700,
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#f0fdfa',
                        },
                    }}
                />
            </Box>
        </Box>
    )
}

export default TrainingsPage
