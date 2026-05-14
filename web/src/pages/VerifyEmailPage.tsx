import { MarkEmailUnreadOutlined } from "@mui/icons-material"
import { Alert, Box, Button } from "@mui/material"
import { useLocation, Link as RouterLink } from "react-router-dom"

export const VerifyEmailPage = () => {
    const { state } = useLocation()

    return (
        <Box className="flex flex-col gap-4">
            <Alert severity="info" icon={<MarkEmailUnreadOutlined />}>
                Enviamos um e-mail de verificação para <strong>{state?.email}</strong>.
                Confirme antes de acessar o app.
            </Alert>
            <Button
                component={RouterLink}
                to="/login"
                state={{ email: state?.email }}
                variant="contained"
                fullWidth
            >
                Ir para o login
            </Button>
        </Box>
    )
}