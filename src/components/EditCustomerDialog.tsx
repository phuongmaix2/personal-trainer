import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import { updateCustomer } from '../api/customerApi'
import type { Customer, CustomerInput } from '../types'
import {
    digitsOnly,
    isValidEmail,
    isValidPhone,
} from '../utils/customerValidation'

type EditCustomerDialogProps = {
    customer: Customer
    onCustomerUpdated: () => Promise<void>
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

function getCustomerInput(customer: Customer): CustomerInput {
    return {
        firstname: customer.firstname,
        lastname: customer.lastname,
        streetaddress: customer.streetaddress,
        postcode: customer.postcode,
        city: customer.city,
        email: customer.email,
        phone: digitsOnly(customer.phone),
    }
}

function EditCustomerDialog({
    customer,
    onCustomerUpdated,
}: EditCustomerDialogProps) {
    const [open, setOpen] = useState(false)
    const [editedCustomer, setEditedCustomer] =
        useState<CustomerInput>(() => getCustomerInput(customer))
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const emailIsValid = isValidEmail(editedCustomer.email)
    const phoneIsValid = isValidPhone(editedCustomer.phone)
    const isValid =
        Object.values(editedCustomer).every(
            (value) => value.trim() !== '',
        ) &&
        emailIsValid &&
        phoneIsValid

    const handleOpen = () => {
        setEditedCustomer(getCustomerInput(customer))
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
            await updateCustomer(
                customer._links.self.href,
                editedCustomer,
            )
            await onCustomerUpdated()
            setOpen(false)
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to update customer'

            setError(message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <Tooltip title="Edit customer">
                <IconButton
                    onClick={handleOpen}
                    aria-label="Edit customer"
                    size="small"
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit customer</DialogTitle>

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
                            value={editedCustomer[field.name]}
                            onChange={(event) => {
                                const value =
                                    field.name === 'phone'
                                        ? digitsOnly(event.target.value)
                                        : event.target.value

                                setEditedCustomer({
                                    ...editedCustomer,
                                    [field.name]: value,
                                })
                            }}
                            error={
                                (field.name === 'email' &&
                                    editedCustomer.email !== '' &&
                                    !emailIsValid) ||
                                (field.name === 'phone' &&
                                    editedCustomer.phone !== '' &&
                                    !phoneIsValid)
                            }
                            helperText={
                                field.name === 'email' &&
                                editedCustomer.email !== '' &&
                                !emailIsValid
                                    ? 'Enter a valid email address'
                                    : field.name === 'phone' &&
                                        editedCustomer.phone !== '' &&
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

export default EditCustomerDialog
