import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { deleteCustomer } from '../api/customerApi'
import type { Customer } from '../types'

type DeleteCustomerDialogProps = {
    customer: Customer
    onCustomerDeleted: () => Promise<void>
}

function DeleteCustomerDialog({
    customer,
    onCustomerDeleted,
}: DeleteCustomerDialogProps) {
    const [open, setOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    const handleOpen = () => {
        setError('')
        setOpen(true)
    }

    const handleClose = () => {
        if (!deleting) {
            setOpen(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        setError('')

        try {
            await deleteCustomer(customer._links.self.href)
            await onCustomerDeleted()
            setOpen(false)
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete customer'

            setError(message)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <Tooltip title="Delete customer">
                <IconButton
                    onClick={handleOpen}
                    aria-label="Delete customer"
                    color="error"
                    size="small"
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete customer?</DialogTitle>

                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <DialogContentText>
                        Are you sure you want to delete{' '}
                        <strong>
                            {customer.firstname} {customer.lastname}
                        </strong>
                        ? Their associated trainings will also be deleted.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} disabled={deleting}>
                        No
                    </Button>

                    <Button
                        onClick={handleDelete}
                        disabled={deleting}
                        color="error"
                        variant="contained"
                    >
                        {deleting ? 'Deleting...' : 'Yes, delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteCustomerDialog