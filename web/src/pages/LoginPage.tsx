import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, TextField } from "@mui/material"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { VisibilityOff, Visibility } from "@mui/icons-material"

export const LoginPage = () => {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(email, password)
            navigate('/connections')
        } catch {
            setError('E-mail ou senha inválidos.')
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
                        <h2 className="text-xl font-semibold text-neutral">Bem-vindo de volta</h2>
                        <p className="text-sm text-secondary">Acesse sua conta para continuar</p>
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
                        <FormControlLabel
                            control={<Checkbox size="small" />}
                            label={<span className="text-sm text-secondary">Manter-me conectado</span>}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            size="large"
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
                        </Button>
                    </form>

                    <p className="text-sm text-center text-secondary">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-primary font-medium hover:underline">
                            Criar conta
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