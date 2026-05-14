import { useState } from 'react'
import type { AlertColor } from '@mui/material'

interface ToastState {
    open: boolean
    message: string
    severity: AlertColor
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        open: false,
        message: '',
        severity: 'success',
    })

    const showToast = (message: string, severity: AlertColor = 'success') => {
        setToast({ open: true, message, severity })
    }

    const hideToast = () => {
        setToast((prev) => ({ ...prev, open: false }))
    }

    return { toast, showToast, hideToast }
}
