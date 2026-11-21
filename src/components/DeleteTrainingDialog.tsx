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
import { deleteTraining } from '../api/trainingApi'
import type { Training } from '../types'

type DeleteTrainingDialogProps = {
    training: Training
    onTrainingDeleted: () => Promise<void>
}

function DeleteTrainingDialog({
    training,
    onTrainingDeleted,
}: DeleteTrainingDialogProps) {
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
            await deleteTraining(training.id)
            await onTrainingDeleted()
            setOpen(false)
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete training'

            setError(message)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <Tooltip title="Delete training">
                <IconButton
                    onClick={handleOpen}
                    aria-label="Delete training"
                    color="error"
                    size="small"
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete training?</DialogTitle>

                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <DialogContentText>
                        Are you sure you want to delete{' '}
                        <strong>
                            {training.activity}
                        </strong>
                        {' '}by{' '}
                        <strong>
                            {training.customer.firstname} {training.customer.lastname}
                        </strong>
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

export default DeleteTrainingDialog