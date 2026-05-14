import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <Box
            sx={{
                '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                animation: 'fadeIn 0.3s ease-in',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
        >
            <CircularProgress size={36} />
            <Typography variant="body2" color="text.secondary">
                Preparando tudo para você
            </Typography>
        </Box>
    );

    return user ? children : <Navigate to="/login" />;
};