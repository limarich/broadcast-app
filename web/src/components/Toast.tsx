import { Alert, Snackbar } from '@mui/material'
import type { AlertColor } from '@mui/material'

interface ToastProps {
    open: boolean
    message: string
    severity: AlertColor
    onClose: () => void
}

export const Toast = ({ open, message, severity, onClose }: ToastProps) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3500}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%', boxShadow: 4 }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}
