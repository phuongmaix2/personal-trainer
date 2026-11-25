import { useEffect, useState, useCallback } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
} from '@mui/x-data-grid'
import { getCustomers } from '../api/customerApi'
import type { Customer } from '../types'
import Stack from '@mui/material/Stack'
import AddCustomerDialog from '../components/AddCustomerDialog'
import EditCustomerDialog from '../components/EditCustomerDialog'
import DeleteCustomerDialog from '../components/DeleteCustomerDialog'
import AddTrainingDialog from '../components/AddTrainingDialog'
import DownloadIcon from '@mui/icons-material/Download'
import Button from '@mui/material/Button'
import { exportCustomersToCsv } from '../utils/exportCustomers'

function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [highlightedCustomerId, setHighlightedCustomerId] =
        useState<string | null>(null)
    const [paginationModel, setPaginationModel] =
        useState<GridPaginationModel>({ page: 0, pageSize: 10 })

    const fetchCustomers = useCallback(() => {
        return getCustomers()
            .then((data) => {
                setCustomers(data)
                setError('')
                return data
            })
            .catch((error: unknown) => {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch customers'

                setError(message)
                throw error
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        void fetchCustomers().catch(() => undefined)
    }, [fetchCustomers])

    const refreshCustomers = useCallback(async () => {
        await fetchCustomers()
    }, [fetchCustomers])

    const handleCustomerAdded = async (createdCustomer: Customer) => {
        const data = await fetchCustomers()
        const createdCustomerId = createdCustomer._links?.self?.href
        const rowIndex = data.findIndex((customer) =>
            createdCustomerId
                ? customer._links.self.href === createdCustomerId
                : customer.email === createdCustomer.email &&
                  customer.phone === createdCustomer.phone,
        )
        const customerId =
            rowIndex >= 0
                ? data[rowIndex]._links.self.href
                : createdCustomerId

        if (rowIndex >= 0) {
            setPaginationModel((current) => ({
                ...current,
                page: Math.floor(rowIndex / current.pageSize),
            }))
        }

        if (customerId) {
            setHighlightedCustomerId(customerId)
            window.setTimeout(() => setHighlightedCustomerId(null), 3000)
        }
    }

    const columns: GridColDef<Customer>[] = [
        { field: 'firstname', headerName: 'First name', flex: 1 },
        { field: 'lastname', headerName: 'Last name', flex: 1 },
        {
            field: 'streetaddress',
            headerName: 'Street address',
            flex: 1.5,
        },
        { field: 'postcode', headerName: 'Postcode', width: 110 },
        { field: 'city', headerName: 'City', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <>
                    <AddTrainingDialog customer={params.row} />

                    <EditCustomerDialog
                        customer={params.row}
                        onCustomerUpdated={refreshCustomers}
                    />

                    <DeleteCustomerDialog
                        customer={params.row}
                        onCustomerDeleted={refreshCustomers}
                    />
                </>
            ),
        },
    ]

    const filteredCustomers = customers.filter((customer) => {
        const searchText = search.toLowerCase()

        return [
            customer.firstname,
            customer.lastname,
            customer.streetaddress,
            customer.postcode,
            customer.city,
            customer.email,
            customer.phone,
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
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{
                        gap: 2,
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', sm: 'center' },
                    }}
                >
                    <Box>
                        <Typography
                            variant="overline"
                            sx={{ color: '#0f766e', fontWeight: 800, letterSpacing: 1.4 }}
                        >
                            Client directory
                        </Typography>
                        <Typography variant="h4" component="h1">
                            Customers
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            {customers.length} customers ready to train
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => exportCustomersToCsv(customers)}
                            disabled={loading || customers.length === 0}
                        >
                            Export CSV
                        </Button>

                        <AddCustomerDialog onCustomerAdded={handleCustomerAdded} />
                    </Box>
                </Stack>

                <TextField
                    label="Search customers"
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
                    rows={filteredCustomers}
                    columns={columns}
                    getRowId={(row) => row._links.self.href}
                    loading={loading}
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    getRowClassName={(params) =>
                        params.id === highlightedCustomerId
                            ? 'newly-added-row'
                            : ''
                    }
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
                        '@keyframes highlightNewRow': {
                            '0%': { backgroundColor: '#5eead4' },
                            '100%': { backgroundColor: '#ffffff' },
                        },
                        '& .newly-added-row': {
                            animation: 'highlightNewRow 3s ease-out',
                        },
                    }}
                />
            </Box>
        </Box>
    )
}

export default CustomersPage    
