import { Link as MuiLink, Paper, Stack, Typography } from "@mui/material"
import { Link, Outlet } from "react-router-dom"

export const AuthLayout = () => (
    <div className="min-h-screen flex flex-col">
        <header className="flex justify-start w-full border-b border-gray-200 p-2">
            <Link to={'/'}>
                <Typography variant="h6" className="font-bold text-primary">Broadcast</Typography>
            </Link>
        </header>

        <section className="relative flex flex-1 flex-col items-center justify-center bg-gray-50 py-12 px-4 gap-6 sm:gap-0">
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                }}
                className="w-full max-w-xl max-h-[80vh] overflow-y-auto p-4 sm:p-8 mx-4"
            >
                <Stack spacing={3}>
                    <Outlet />
                </Stack>
            </Paper>

            {/* Mobile footer — exibido abaixo do card, não visível em sm+ */}
            <div className="flex gap-6 sm:hidden">
                <MuiLink href="/privacy" underline="hover" variant="caption" color="text.secondary">Política de privacidade</MuiLink>
                <MuiLink href="/terms" underline="hover" variant="caption" color="text.secondary">Termos de uso</MuiLink>
                <MuiLink href="/faq" underline="hover" variant="caption" color="text.secondary">FAQ</MuiLink>
            </div>

            {/* Desktop footer — posicionado no rodapé, não visível em mobile */}
            <div className="absolute bottom-6 hidden sm:flex gap-6">
                <MuiLink href="/privacy" underline="hover" variant="caption" color="text.secondary">Política de privacidade</MuiLink>
                <MuiLink href="/terms" underline="hover" variant="caption" color="text.secondary">Termos de uso</MuiLink>
                <MuiLink href="/faq" underline="hover" variant="caption" color="text.secondary">FAQ</MuiLink>
            </div>
        </section>
    </div>
)
