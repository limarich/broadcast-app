import {
    Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel,
    IconButton, InputAdornment, Link as MuiLink, Snackbar, Stack,
    TextField, Typography
} from "@mui/material"
import { useEffect, useState } from "react"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { VisibilityOff, Visibility, EmailOutlined, LockOutlined } from "@mui/icons-material"
import { FirebaseError } from "firebase/app"
import { ResetPasswordDialog } from "../components/auth/ResetPasswordDialog"

export const LoginPage = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation();
    const { email: prefilledEmail = '' } = location.state || {};

    const [email, setEmail] = useState(prefilledEmail)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false);

    const [resetOpen, setResetOpen] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(email, password, rememberMe)
            navigate('/connections')
        } catch (e) {
            if (e instanceof FirebaseError) {
                switch (e.code) {
                    case 'auth/invalid-credential':
                        setError('E-mail ou senha inválidos.')
                        break
                    case 'auth/too-many-requests':
                        setError('Muitas tentativas. Tente novamente mais tarde.')
                        break
                    default:
                        setError('Ocorreu um erro. Tente novamente.')
                }
            }
        }
        finally {
            setLoading(false)
        }
    }

    const handleOpenReset = () => {
        setResetOpen(true)
    }

    useEffect(() => {
        if (location.state?.email) {
            window.history.replaceState({}, '')
        }
    }, [])

    return (
        <Box className="flex flex-col gap-4">
            <Stack spacing={0.5}>
                <Typography variant="h6" sx={{ fontWeight: 600 }} color="text.primary">Bem-vindo de volta</Typography>
                <Typography variant="body2" color="text.secondary">Acesse sua conta para continuar</Typography>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                <TextField
                    label="E-mail"
                    type="email"
                    variant="outlined"
                    fullWidth
                    placeholder="email@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                <TextField
                    label="Senha"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlined fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                />
                <Box className="flex items-center justify-between">
                    <FormControlLabel
                        control={<Checkbox size="small" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                        label={<Typography variant="body2" color="text.secondary" component="span">Manter-me conectado</Typography>}
                    />
                    <MuiLink
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={handleOpenReset}
                        sx={{ fontWeight: 500 }}
                    >
                        Esqueci minha senha
                    </MuiLink>
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    size="large"
                >
                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
                </Button>
            </Stack>

            <Typography variant="body2" align="center" color="text.secondary">
                Não tem uma conta?{' '}
                <MuiLink component={RouterLink} to="/register" sx={{ fontWeight: 500 }}>Criar conta</MuiLink>
            </Typography>

            <ResetPasswordDialog
                open={resetOpen}
                onClose={() => setResetOpen(false)}
                initialEmail={email}
            />

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
        </Box>
    )
}
