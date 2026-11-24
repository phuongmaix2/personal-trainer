import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { addCustomer } from '../api/customerApi'
import type { Customer, CustomerInput } from '../types'
import {
    digitsOnly,
    isValidEmail,
    isValidPhone,
} from '../utils/customerValidation'

type AddCustomerDialogProps = {
    onCustomerAdded: (customer: Customer) => Promise<void>
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

    const emailIsValid = isValidEmail(customer.email)
    const phoneIsValid = isValidPhone(customer.phone)
    const isValid =
        Object.values(customer).every((value) => value.trim() !== '') &&
        emailIsValid &&
        phoneIsValid

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
            const createdCustomer = await addCustomer(customer)
            await onCustomerAdded(createdCustomer)
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
                            onChange={(event) => {
                                const value =
                                    field.name === 'phone'
                                        ? digitsOnly(event.target.value)
                                        : event.target.value

                                setCustomer({
                                    ...customer,
                                    [field.name]: value,
                                })
                            }}
                            error={
                                (field.name === 'email' &&
                                    customer.email !== '' &&
                                    !emailIsValid) ||
                                (field.name === 'phone' &&
                                    customer.phone !== '' &&
                                    !phoneIsValid)
                            }
                            helperText={
                                field.name === 'email' &&
                                customer.email !== '' &&
                                !emailIsValid
                                    ? 'Enter a valid email address'
                                    : field.name === 'phone' &&
                                        customer.phone !== '' &&
                                        !phoneIsValid
                                      ? 'Use 7–15 digits only'
                                      : undefined
                            }
                            required
                            fullWidth
                            margin="dense"
                            autoFocus={index === 0}
                            slotProps={{
                                htmlInput: {
                                    maxLength:
                                        field.name === 'email' ? 100 : 60,
                                    inputMode:
                                        field.name === 'phone'
                                            ? 'numeric'
                                            : undefined,
                                },
                            }}
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
