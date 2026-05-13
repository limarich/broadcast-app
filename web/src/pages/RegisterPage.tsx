import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, TextField } from "@mui/material"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { VisibilityOff, Visibility, EmailOutlined, LockOutlined, EnhancedEncryptionOutlined } from "@mui/icons-material"

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
            navigate('/login')
        } catch {
            setError('E-mail inválido ou já cadastrado.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex justify-start w-full border-b border-gray-200 p-2">
                <h1 className="text-2xl font-bold text-primary">Broadcast</h1>
            </header>

            <section className="flex flex-1 items-center justify-center bg-gray-50">
                <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md flex flex-col gap-6 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold text-neutral">Crie sua conta</h2>
                        <p className="text-sm text-secondary">Informe seus dados para fazer parte da melhor plataforma de broadcast do Brasil!</p>
                    </div>

                    {error && <Alert severity="error">{error}</Alert>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <TextField
                            label="E-mail"
                            type="email"
                            variant="outlined"
                            fullWidth
                            placeholder="email@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            slotProps={
                                {
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlined fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }
                                }
                            }
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
                    </form>
                    <FormControlLabel
                        control={<Checkbox size="small" />}
                        value={acceptedTerms}
                        onChange={(e) => setAcceptedTerms((prev) => !prev)}
                        label={<span className="text-sm text-secondary">Ao se cadastrar, você aceita nossos <Link to="/terms" className="text-primary font-medium hover:underline">termos de uso</Link> e <Link to="/privacy" className="text-primary font-medium hover:underline">política de privacidade</Link>.</span>}
                    />

                    <p className="text-sm text-center text-secondary">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Fazer login
                        </Link>
                    </p>
                </div>

                <div className="absolute bottom-6 flex gap-6 text-xs text-secondary">
                    <span className="cursor-pointer hover:underline">Política de privacidade</span>
                    <span className="cursor-pointer hover:underline">Termos de uso</span>
                    <span className="cursor-pointer hover:underline">FAQ</span>
                </div>
            </section>
        </div>
    )
}