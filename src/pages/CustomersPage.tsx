import { useEffect, useState, useCallback } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { getCustomers } from '../api/customerApi'
import type { Customer } from '../types'
import Stack from '@mui/material/Stack'
import AddCustomerDialog from '../components/AddCustomerDialog'


const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'First name', flex: 1 },
    { field: 'lastname', headerName: 'Last name', flex: 1 },
    { field: 'streetaddress', headerName: 'Street address', flex: 1.5 },
    { field: 'postcode', headerName: 'Postcode', width: 110 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
]

function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchCustomers = useCallback(() => {
        return getCustomers()
            .then((data) => {
                setCustomers(data)
                setError('')
            })
            .catch((error: unknown) => {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch customers'

                setError(message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        void fetchCustomers()
    }, [fetchCustomers])

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
            <Stack
                direction="row"
                sx={{
                    mb: 2,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1">
                    Customers
                </Typography>

                <AddCustomerDialog onCustomerAdded={fetchCustomers} />
            </Stack>

            <TextField
                label="Search customers"
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
                    rows={filteredCustomers}
                    columns={columns}
                    getRowId={(row) => row._links.self.href}
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

export default CustomersPage    