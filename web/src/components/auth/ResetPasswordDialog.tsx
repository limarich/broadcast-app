import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    Snackbar,
    TextField,
} from "@mui/material"
import { EmailOutlined } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { FirebaseError } from "firebase/app"
import { useAuth } from "../../contexts/AuthContext"

interface ResetPasswordDialogProps {
    open: boolean
    onClose: () => void
    initialEmail?: string
}

export const ResetPasswordDialog = ({ open, onClose, initialEmail = '' }: ResetPasswordDialogProps) => {
    const { resetPassword } = useAuth()

    const [email, setEmail] = useState(initialEmail)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successOpen, setSuccessOpen] = useState(false)

    const handleClose = () => {
        if (loading) return
        setError('')
        onClose()
    }

    useEffect(() => {
        if (!open) {
            setEmail(initialEmail)
            setError('')
            setSuccessOpen(false)
            setLoading(false)
        }
    }, [initialEmail, open])

    const handleSubmit = async () => {
        if (!email) return
        setLoading(true)
        setError('')
        try {
            await resetPassword(email)
            onClose()
            setSuccessOpen(true)
        } catch (e) {
            if (e instanceof FirebaseError) {
                switch (e.code) {
                    case 'auth/user-not-found':
                    case 'auth/invalid-email':
                        setError('Nenhuma conta encontrada com esse e-mail.')
                        break
                    case 'auth/too-many-requests':
                        setError('Muitas tentativas. Aguarde alguns minutos.')
                        break
                    default:
                        setError('Erro ao enviar e-mail. Tente novamente.')
                }
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Recuperar senha</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Informe o e-mail da sua conta e enviaremos um link para redefinir sua senha.
                        <br />
                        <strong className="text-primary">Não esqueça de verificar a pasta de spam!</strong>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        label="E-mail"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        error={!!error}
                        helperText={error}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined fontSize="small" />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!email || loading}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Enviar link'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={successOpen}
                autoHideDuration={6000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSuccessOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%', boxShadow: 4 }}
                >
                    E-mail de recuperação enviado! Verifique sua caixa de entrada.
                </Alert>
            </Snackbar>
        </>
    )
}