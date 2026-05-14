import { Box, Link as MuiLink, Paper, Stack, Typography } from "@mui/material"
import { Outlet } from "react-router-dom"

export const AuthLayout = () => (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box
            component="header"
            sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', borderBottom: 1, borderColor: 'grey.200', p: 1 }}
        >
            <Typography variant="h6" className="font-bold text-primary">Broadcast</Typography>
        </Box>

        <Box
            component="section"
            sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 448,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                }}
            >
                <Stack spacing={3}>
                    <Outlet />
                </Stack>
            </Paper>

            <Box sx={{ position: 'absolute', bottom: 24, display: 'flex', gap: 3 }}>
                <MuiLink href="#" underline="hover" variant="caption" color="text.secondary">Política de privacidade</MuiLink>
                <MuiLink href="#" underline="hover" variant="caption" color="text.secondary">Termos de uso</MuiLink>
                <MuiLink href="#" underline="hover" variant="caption" color="text.secondary">FAQ</MuiLink>
            </Box>
        </Box>
    </Box>
)
