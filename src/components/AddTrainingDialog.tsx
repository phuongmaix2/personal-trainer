import { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useNavigate } from 'react-router-dom'
import { addTraining } from '../api/trainingApi'
import type { Customer } from '../types'

type AddTrainingDialogProps = {
    customer: Customer
}

function AddTrainingDialog({
    customer,
}: AddTrainingDialogProps) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Dayjs | null>(dayjs())
    const [activity, setActivity] = useState('')
    const [duration, setDuration] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const isValid =
        date !== null &&
        activity.trim() !== '' &&
        Number(duration) > 0

    const handleOpen = () => {
        setDate(dayjs())
        setActivity('')
        setDuration('')
        setError('')
        setOpen(true)
    }

    const handleClose = () => {
        if (!saving) {
            setOpen(false)
        }
    }

    const handleSave = async () => {
        if (!date) {
            return
        }

        setSaving(true)
        setError('')

        try {
            const trainingId = await addTraining({
                date: date.toISOString(),
                activity: activity.trim(),
                duration: Number(duration),
                customer: customer._links.self.href,
            })

            setOpen(false)
            navigate('/trainings', {
                state: { highlightedTrainingId: trainingId },
            })
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to add training'

            setError(message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <Tooltip title="Add training">
                <IconButton
                    onClick={handleOpen}
                    aria-label="Add training"
                    color="primary"
                    size="small"
                >
                    <AddCircleOutlinedIcon />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Add training for {customer.firstname}{' '}
                    {customer.lastname}
                </DialogTitle>

                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ mt: 1, mb: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date and time"
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Box>

                    <TextField
                        label="Activity"
                        value={activity}
                        onChange={(event) => setActivity(event.target.value)}
                        required
                        fullWidth
                        margin="dense"
                    />

                    <TextField
                        label="Duration in minutes"
                        value={duration}
                        onChange={(event) => setDuration(event.target.value)}
                        type="number"
                        required
                        fullWidth
                        margin="dense"
                        slotProps={{
                            htmlInput: {
                                min: 1,
                            },
                        }}
                    />
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

export default AddTrainingDialog
