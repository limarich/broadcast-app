import { ContactsOutlined, HubOutlined, Logout, MenuOutlined, SendOutlined } from '@mui/icons-material'
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useConnection } from '../contexts/ConnectionContext'
import { truncateText } from '../utils/format'

const DRAWER_WIDTH = 240

export const AppLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    const { activeConnection } = useConnection()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const handleNavClick = (path: string) => {
        navigate(path)
        setMobileOpen(false)
    }

    const drawerContent = (
        <>
            <Box className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                <Link to="/connections" onClick={() => setMobileOpen(false)}>
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
                    onClick={() => handleNavClick('/connections')}>
                    <ListItemIcon>
                        <HubOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Conexões" />
                </ListItemButton>
                {!activeConnection && (
                    <Box className="px-4 py-2">
                        <Typography variant="caption" color="text.secondary">
                            Selecione uma conexão para ver contatos e mensagens
                        </Typography>
                    </Box>
                )}
                {activeConnection && (
                    <>
                        <Box className="px-4 pt-3 pb-1">
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                                Conexão: {activeConnection.name}
                            </Typography>
                            <Divider className="mt-1" />
                        </Box>
                        <ListItemButton
                            selected={location.pathname === `/connections/${activeConnection.id}/contacts`}
                            onClick={() => handleNavClick(`/connections/${activeConnection.id}/contacts`)}>
                            <ListItemIcon>
                                <ContactsOutlined fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Contatos" />
                        </ListItemButton>
                        <ListItemButton
                            selected={location.pathname === `/connections/${activeConnection.id}/messages`}
                            onClick={() => handleNavClick(`/connections/${activeConnection.id}/messages`)}>
                            <ListItemIcon>
                                <SendOutlined fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Mensagens" />
                        </ListItemButton>
                    </>
                )}
            </List>
        </>
    )

    return (
        <Box className="flex min-h-screen">
            {/* Mobile AppBar — não visível em md+ */}
            <AppBar
                position="fixed"
                color="default"
                elevation={1}
                sx={{ display: { md: 'none' }, zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                        <MenuOutlined />
                    </IconButton>
                    <Typography variant="h6" className="font-bold text-primary" sx={{ flex: 1, textAlign: 'center' }}>
                        Broadcast
                    </Typography>
                    <Tooltip title="Sair">
                        <IconButton size="small" onClick={handleLogout}>
                            <Logout fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {/* Temporary Drawer para o mobile — não visível em md+ */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        backgroundColor: '#F1F3FF',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Permanent Drawer para o desktop — não visível em xs/sm */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        backgroundColor: '#F1F3FF',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Box
                component="main"
                className="flex-1 bg-gray-50 min-h-screen px-4 py-4"
                sx={{ mt: { xs: '56px', md: 0 } }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}
