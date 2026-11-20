import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { getTrainings } from '../api/trainingApi'
import type { Training } from '../types'

type TrainingRow = Training & {
    customerName: string
    formattedDate: string
}

const columns: GridColDef[] = [
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
]

function TrainingsPage() {
    const [trainings, setTrainings] = useState<Training[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getTrainings()
            .then((data) => setTrainings(data))
            .catch((error: unknown) => {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch trainings'

                setError(message)
            })
            .finally(() => setLoading(false))
    }, [])

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
            <Typography variant="h4" component="h1" gutterBottom>
                Trainings
            </Typography>

            <TextField
                label="Search trainings"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                size="small"
                sx={{ mb: 2, width: 300 }}
            />

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
                />
            </Box>
        </Box>
    )
}

export default TrainingsPage