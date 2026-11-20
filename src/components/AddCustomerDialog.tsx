import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { addCustomer } from '../api/customerApi'
import type { CustomerInput } from '../types'

type AddCustomerDialogProps = {
    onCustomerAdded: () => Promise<void>
}

const emptyCustomer: CustomerInput = {
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: '',
}

const fields: {
    name: keyof CustomerInput
    label: string
    type?: string
}[] = [
        { name: 'firstname', label: 'First name' },
        { name: 'lastname', label: 'Last name' },
        { name: 'streetaddress', label: 'Street address' },
        { name: 'postcode', label: 'Postcode' },
        { name: 'city', label: 'City' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone', type: 'tel' },
    ]

function AddCustomerDialog({
    onCustomerAdded,
}: AddCustomerDialogProps) {
    const [open, setOpen] = useState(false)
    const [customer, setCustomer] =
        useState<CustomerInput>(emptyCustomer)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const isValid = Object.values(customer).every(
        (value) => value.trim() !== '',
    )

    const handleOpen = () => {
        setCustomer(emptyCustomer)
        setError('')
        setOpen(true)
    }

    const handleClose = () => {
        if (!saving) {
            setOpen(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setError('')

        try {
            await addCustomer(customer)
            await onCustomerAdded()
            setOpen(false)
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to add customer'

            setError(message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <Button variant="contained" onClick={handleOpen}>
                Add customer
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add customer</DialogTitle>

                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
                            {error}
                        </Alert>
                    )}

                    {fields.map((field, index) => (
                        <TextField
                            key={field.name}
                            label={field.label}
                            type={field.type ?? 'text'}
                            value={customer[field.name]}
                            onChange={(event) =>
                                setCustomer({
                                    ...customer,
                                    [field.name]: event.target.value,
                                })
                            }
                            required
                            fullWidth
                            margin="dense"
                            autoFocus={index === 0}
                        />
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} disabled={saving}>
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={!isValid || saving}
                        variant="contained"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddCustomerDialog