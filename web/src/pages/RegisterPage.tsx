import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, Link as MuiLink, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { VisibilityOff, Visibility, EmailOutlined, LockOutlined, EnhancedEncryptionOutlined } from "@mui/icons-material"
import { FirebaseError } from "firebase/app"

export const RegisterPage = () => {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [acceptedTerms, setAcceptedTerms] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError('')

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.')
            return
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.')
            return
        }

        if (!acceptedTerms) {
            setError('Você precisa aceitar os termos de uso para continuar.')
            return
        }

        setLoading(true)
        try {
            await register(email, password)
            navigate('/verify-email', { state: { email } });
        } catch (e) {
            if (e instanceof FirebaseError) {
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        setError('E-mail já cadastrado.')
                        break
                    case 'auth/invalid-email':
                        setError('E-mail inválido.')
                        break
                    case 'auth/too-many-requests':
                        setError('Muitas tentativas. Tente novamente mais tarde.')
                        break
                    default:
                        setError('Ocorreu um erro. Tente novamente.')
                }
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box className="flex flex-col gap-4">
            <Stack spacing={0.5}>
                <Typography variant="h6" sx={{ fontWeight: 600 }} color="text.primary">Crie sua conta</Typography>
                <Typography variant="body2" color="text.secondary">Informe seus dados para fazer parte da melhor plataforma de broadcast do Brasil!</Typography>
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
                <TextField
                    label="Confirme a Senha"
                    variant="outlined"
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EnhancedEncryptionOutlined fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    size="large"
                >
                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Criar Conta'}
                </Button>
            </Stack>

            <FormControlLabel
                control={
                    <Checkbox
                        size="small"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                }
                label={
                    <Typography variant="body2" color="text.secondary" component="span">
                        Ao se cadastrar, você aceita nossos{' '}
                        <MuiLink component={RouterLink} to="/terms" sx={{ fontWeight: 500 }}>termos de uso</MuiLink>
                        {' '}e{' '}
                        <MuiLink component={RouterLink} to="/privacy" sx={{ fontWeight: 500 }}>política de privacidade</MuiLink>.
                    </Typography>
                }
            />

            <Typography variant="body2" align="center" color="text.secondary">
                Já tem uma conta?{' '}
                <MuiLink component={RouterLink} to="/login" sx={{ fontWeight: 500 }}>Fazer login</MuiLink>
            </Typography>
        </Box>
    )
}
