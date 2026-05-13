import { ContactsOutlined, HubOutlined, Logout, SendOutlined } from '@mui/icons-material'
import {
    Box,

    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useConnection } from '../contexts/ConnectionContext'

const DRAWER_WIDTH = 240

export const AppLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const { activedConnection } = useConnection()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <Box className="flex min-h-screen">
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        backgroundColor: '#F1F3FF',
                    },

                }}
            >
                <Box className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                    <Typography variant="h6" className="font-bold text-primary">
                        Broadcast
                    </Typography>
                    <Tooltip title="Sair">
                        <IconButton size="small" onClick={handleLogout}>
                            <Logout fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box className="px-4 py-2">
                    <Typography variant="caption" className="text-secondary" noWrap>
                        {user?.email}
                    </Typography>
                </Box>

                <List dense disablePadding>
                    <ListItemButton onClick={() => navigate('/connections')}>
                        <ListItemIcon>
                            <HubOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Conexões" />
                    </ListItemButton>
                    {activedConnection && (
                        <>
                            <ListItemButton onClick={() => navigate(`/connections/${activedConnection.id}/contacts`)}>
                                <ListItemIcon>
                                    <ContactsOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Contatos" />
                            </ListItemButton>
                            <ListItemButton onClick={() => navigate(`/connections/${activedConnection.id}/messages`)}>
                                <ListItemIcon>
                                    <SendOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Mensagens" />
                            </ListItemButton>
                        </>
                    )}
                </List>
            </Drawer>

            <Box component="main" className="flex-1 bg-gray-50 min-h-screen px-4 py-4">
                <Outlet />
            </Box>
        </Box>
    )
}