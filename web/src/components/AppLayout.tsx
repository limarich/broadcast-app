import { ContactsOutlined, HubOutlined, Logout, SendOutlined } from '@mui/icons-material'
import {
    Box,

    Divider,

    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useConnection } from '../contexts/ConnectionContext'
import { truncateText } from '../utils/format'

const DRAWER_WIDTH = 240

export const AppLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

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
                    <Link to="/connections">
                        <Typography variant="h6" className="font-bold text-primary">
                            Broadcast
                        </Typography>
                    </Link>
                    <Tooltip title="Sair">
                        <IconButton size="small" onClick={handleLogout}>
                            <Logout fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box className="px-4 py-2">
                    <Tooltip title={(user?.email?.length ?? 0) > 28 ? user!.email! : ''}>
                        <Typography variant="caption" className="text-secondary" noWrap>
                            {truncateText(user?.email ?? '', 28)}
                        </Typography>
                    </Tooltip>
                </Box>

                <List dense disablePadding>
                    <ListItemButton
                        selected={location.pathname === '/connections'}
                        onClick={() => navigate('/connections')}>
                        <ListItemIcon>
                            <HubOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Conexões" />
                    </ListItemButton>
                    {!activedConnection && (
                        <Box className="px-4 py-2">
                            <Typography variant="caption" color="text.secondary">
                                Selecione uma conexão para ver contatos e mensagens
                            </Typography>
                        </Box>
                    )}
                    {activedConnection && (
                        <>
                            <Box className="px-4 pt-3 pb-1">
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                                    Conexão: {activedConnection.name}
                                </Typography>
                                <Divider className="mt-1" />
                            </Box>
                            <ListItemButton
                                selected={location.pathname === `/connections/${activedConnection.id}/contacts`}
                                onClick={() => navigate(`/connections/${activedConnection.id}/contacts`)}>
                                <ListItemIcon>
                                    <ContactsOutlined fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Contatos" />
                            </ListItemButton>
                            <ListItemButton
                                selected={location.pathname === `/connections/${activedConnection.id}/messages`}
                                onClick={() => navigate(`/connections/${activedConnection.id}/messages`)}>
                                <ListItemIcon>
                                    <SendOutlined fontSize="small" />
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