import { Add, ArrowForwardOutlined, DeleteOutlined, EditOutlined, HubOutlined } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
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
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/Toast'
import { truncateText, formatDate } from '../utils/format'

export const ConnectionsPage = () => {
    const { user } = useAuth()
    const { connections, loading } = useConnections(user?.uid ?? '');
    const { onActiveConnectionChange } = useConnection()
    const navigate = useNavigate()

    const { toast, showToast, hideToast } = useToast()

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const paginatedConnections = connections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
            showToast('Conexão excluída com sucesso!')
        } catch {
            showToast('Erro ao excluir conexão. Tente novamente.', 'error')
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

            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ minHeight: 480, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Criado em</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                                    <TableCell><Skeleton variant="text" width="40%" /></TableCell>
                                    <TableCell><Skeleton variant="rounded" width={80} height={28} /></TableCell>
                                    <TableCell align="right">
                                        <Skeleton variant="circular" width={28} height={28} sx={{ display: 'inline-block', mr: 0.5 }} />
                                        <Skeleton variant="circular" width={28} height={28} sx={{ display: 'inline-block' }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && connections.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4}>
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
                            {!loading && paginatedConnections.map((connection) => (
                                <TableRow
                                    key={connection.id}
                                    hover
                                    onClick={() => handleSelectConnection(connection)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>
                                        <Box className="flex items-center gap-2">
                                            <HubOutlined fontSize="small" color="primary" />
                                            <Tooltip title={connection.name.length > 40 ? connection.name : ''}>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {truncateText(connection.name, 40)}
                                                </Typography>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(connection.createdAt)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            endIcon={<ArrowForwardOutlined fontSize="small" />}
                                            onClick={(e) => { e.stopPropagation(); handleSelectConnection(connection) }}
                                            sx={{ mr: 1 }}
                                        >
                                            Acessar
                                        </Button>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditConnection(connection) }}>
                                                <EditOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Excluir">
                                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteConnection(connection) }}>
                                                <DeleteOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
                <TablePagination
                    component="div"
                    count={connections.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10))
                        setPage(0)
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Itens por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                />
            </TableContainer>
            <ConnectionDialog open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedConnection(null);
                }}
                selectedConnection={selectedConnection}
                onSuccess={(msg) => showToast(msg)}
                onError={(msg) => showToast(msg, 'error')}
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
            <Toast {...toast} onClose={hideToast} />
        </Box>
    )
}