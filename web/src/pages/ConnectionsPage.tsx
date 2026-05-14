import { Add, DeleteOutlined, EditOutlined, HubOutlined } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useConnections } from '../hooks/useConnections'
import { useState } from 'react'
import { ConnectionDialog } from '../components/connections/ConnectionDialog'
import type { Connection } from '../types'
import { deleteConnection } from '../services/connectionService'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useConnection } from '../contexts/ConnectionContext'
import { useNavigate } from 'react-router-dom'

export const ConnectionsPage = () => {
    const { user } = useAuth()
    const { connections } = useConnections(user?.uid ?? '');
    const { onActiveConnectionChange } = useConnection()
    const navigate = useNavigate()

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleEditConnection = (connection: Connection) => {
        setSelectedConnection(connection);
        setDialogOpen(true);
    }

    const handleDeleteConnection = (connection: Connection) => {
        setSelectedConnection(connection);
        setConfirmDialogOpen(true);
    }

    const handleSelectConnection = (connection: Connection) => {
        onActiveConnectionChange(connection)
        navigate(`/connections/${connection.id}/contacts`)
    }

    const handleConfirmDelete = async () => {
        if (!selectedConnection || !user) return;

        try {
            setDeleting(true);
            await deleteConnection({ id: selectedConnection.id, userId: user.uid });
            setConfirmDialogOpen(false);
        } catch (error) {
            console.error("Erro ao excluir conexão:", error);
        } finally {
            setDeleting(false);
            setSelectedConnection(null);
        }
    }

    return (
        <Box className="p-8 flex flex-col gap-6">
            <Box className="flex items-center justify-between">
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Conexões</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gerencie seus canais de envio de mensagens
                    </Typography>
                </Box>
                <Button variant="contained"
                    startIcon={<Add />}
                    onClick={() => setDialogOpen(true)}
                >
                    Nova conexão
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Criado em</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {connections.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Box className="flex flex-col items-center gap-2 py-8 text-center">
                                        <HubOutlined sx={{ fontSize: 40, color: 'text.disabled' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhuma conexão encontrada
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            Crie sua primeira conexão para começar
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                        {connections.map((connection) => (
                            <TableRow key={connection.id} hover>
                                <TableCell>
                                    <Box className="flex items-center gap-2">
                                        <HubOutlined fontSize="small" color="primary" />
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {connection.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {connection.createdAt && connection.createdAt.toDate().toLocaleDateString('pt-BR')}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Selecionar conexão">
                                        <IconButton size="small" onClick={() => handleSelectConnection(connection)}>
                                            <HubOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton size="small" onClick={() => handleEditConnection(connection)}>
                                            <EditOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <IconButton size="small" color="error" onClick={() => handleDeleteConnection(connection)}>
                                            <DeleteOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ConnectionDialog open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedConnection(null);
                }}
                selectedConnection={selectedConnection}
            />
            <ConfirmDialog
                open={confirmDialogOpen}
                title="Excluir conexão?"
                description="Tem certeza que deseja excluir essa conexão?"
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                submitting={deleting}
                destructive
            />
        </Box>
    )
}