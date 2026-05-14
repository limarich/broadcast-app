import { Add, DeleteOutlined, EditOutlined, FilterListOutlined, NavigateNextOutlined, ScheduleOutlined, SendOutlined } from '@mui/icons-material'
import {
    Box,
    Breadcrumbs,
    Button,
    Chip,
    IconButton,
    Link,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useConnection } from '../contexts/ConnectionContext'
import { useMessages } from '../hooks/useMessages'
import { useContacts } from '../hooks/useContacts'
import { deleteMessage } from '../services/messageService'
import { ConfirmDialog } from '../components/ConfirmDialog'
import type { Message } from '../types'
import { MessageDialog } from '../components/messages/MessageDialog'
import { MessageDetailDialog } from '../components/messages/MessageDetailDialog'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/Toast'
import { formatDate, truncateText } from '../utils/format'

type FilterStatus = 'ALL' | 'SCHEDULED' | 'SENT'

export const MessagesPage = () => {
    const { user } = useAuth()
    const { connectionId } = useParams<{ connectionId: string }>()
    const { messages, loading } = useMessages(user?.uid ?? '', connectionId ?? '')
    const { contacts } = useContacts(user?.uid ?? '', connectionId ?? '')
    const { activeConnection } = useConnection()
    const navigate = useNavigate()
    const location = useLocation()

    const { toast, showToast, hideToast } = useToast()

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [filter, setFilter] = useState<FilterStatus>('ALL')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [preselectedContactId, setPreselectedContactId] = useState<string | null>(null)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleViewMessage = (message: Message) => {
        setSelectedMessage(message)
        setDetailDialogOpen(true)
    }

    const handleEditMessage = (message: Message) => {
        setSelectedMessage(message)
        setDialogOpen(true)
    }

    const handleDeleteMessage = (message: Message) => {
        setSelectedMessage(message)
        setConfirmDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedMessage) return
        try {
            setDeleting(true)
            await deleteMessage({ id: selectedMessage.id })
            setConfirmDialogOpen(false)
            showToast('Mensagem excluída com sucesso!')
        } catch {
            showToast('Erro ao excluir mensagem. Tente novamente.', 'error')
        } finally {
            setDeleting(false)
            setSelectedMessage(null)
        }
    }

    const filteredMessages = messages.filter((message) => {
        if (filter === 'ALL') return true
        return message.status === filter
    })

    const paginatedMessages = filteredMessages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    const resolveContactNames = (contactIds: string[]) => {
        if (contactIds.length === 0) return null
        return contactIds.map((id) => contacts.find((c) => c.id === id)?.name ?? null)
    }

    useEffect(() => { setPage(0) }, [filter])

    useEffect(() => {
        if (location.state?.preselectedContactId) {
            setSelectedMessage(null)
            setPreselectedContactId(location.state.preselectedContactId)
            setDialogOpen(true)
            window.history.replaceState({}, '')
        }
    }, [location.state])

    return (
        <Box className="p-4 md:p-8 flex flex-col gap-6">
            <Breadcrumbs separator={<NavigateNextOutlined fontSize="small" />}>
                <Link
                    component="button"
                    variant="body2"
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate('/connections')}
                >
                    Conexões
                </Link>
                <Typography variant="body2" color="text.primary" className='hover:underline cursor-pointer'>
                    {activeConnection?.name ?? '...'}
                </Typography>
            </Breadcrumbs>
            <Box className="flex items-center justify-between">
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Mensagens</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Envie e agende mensagens para seus contatos
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setSelectedMessage(null)
                        setPreselectedContactId(null)
                        setDialogOpen(true)
                    }}
                >
                    Nova mensagem
                </Button>
            </Box>

            <Box className="flex items-center gap-2">
                <FilterListOutlined fontSize="small" color="action" />
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={(_, value) => value && setFilter(value)}
                    size="small"
                >
                    <ToggleButton value="ALL">Todas</ToggleButton>
                    <ToggleButton value="SCHEDULED">Agendadas</ToggleButton>
                    <ToggleButton value="SENT">Enviadas</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ minHeight: 480, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1, overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 420 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Conteúdo</TableCell>
                                <TableCell>Destinatários</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Agendado para</TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Enviado em</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                                    <TableCell><Skeleton variant="text" width="55%" /></TableCell>
                                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" width="50%" /></TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" width="50%" /></TableCell>
                                    <TableCell align="right">
                                        <Skeleton variant="circular" width={28} height={28} sx={{ display: 'inline-block', mr: 0.5 }} />
                                        <Skeleton variant="circular" width={28} height={28} sx={{ display: 'inline-block' }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && filteredMessages.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Box className="flex flex-col items-center gap-2 py-8 text-center">
                                            <SendOutlined sx={{ fontSize: 40, color: 'text.disabled' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Nenhuma mensagem encontrada
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled">
                                                {filter === 'ALL'
                                                    ? 'Crie sua primeira mensagem para começar'
                                                    : `Nenhuma mensagem com status "${filter === 'SCHEDULED' ? 'agendada' : 'enviada'}"`
                                                }
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && paginatedMessages.map((message) => (
                                <TableRow key={message.id} hover onClick={() => handleViewMessage(message)} sx={{ cursor: 'pointer' }}>
                                    <TableCell sx={{ maxWidth: 220 }}>
                                        <Tooltip title={message.content.length > 60 ? message.content : ''}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {truncateText(message.content, 60)}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 180 }}>
                                        {(() => {
                                            const names = resolveContactNames(message.contactIds)
                                            if (!names) return (
                                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                                    Sem destinatários
                                                </Typography>
                                            )
                                            return (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                >
                                                    {names.map((name, i) => (
                                                        <span key={i}>
                                                            {i > 0 && ', '}
                                                            {name ?? (
                                                                <Typography component="span" variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                                                    Contato removido
                                                                </Typography>
                                                            )}
                                                        </span>
                                                    ))}
                                                </Typography>
                                            )
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        {message.status === 'SCHEDULED' ? (
                                            <Chip
                                                icon={<ScheduleOutlined />}
                                                label="Agendada"
                                                size="small"
                                                color="warning"
                                                variant="outlined"
                                                style={{ padding: '0 4px' }}
                                            />
                                        ) : (
                                            <Chip
                                                icon={<SendOutlined />}
                                                label="Enviada"
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                                style={{ padding: '0 4px' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {message.scheduledAt ? formatDate(message.scheduledAt, true) : '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {message.sentAt ? formatDate(message.sentAt, true) : '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                                        <Tooltip title="Editar">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditMessage(message)}
                                                    disabled={message.status === 'SENT'}
                                                >
                                                    <EditOutlined fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Excluir">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteMessage(message)}
                                            >
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
                    count={filteredMessages.length}
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

            <MessageDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                    setSelectedMessage(null)
                    setPreselectedContactId(null)
                }}
                selectedMessage={selectedMessage}
                preselectedContactId={preselectedContactId}
                connectionId={connectionId ?? ''}
                contacts={contacts}
                onSuccess={(msg) => showToast(msg)}
                onError={(msg) => showToast(msg, 'error')}
            />

            <MessageDetailDialog
                open={detailDialogOpen}
                onClose={() => {
                    setDetailDialogOpen(false)
                    setSelectedMessage(null)
                }}
                message={selectedMessage}
                contacts={contacts}
            />

            <ConfirmDialog
                open={confirmDialogOpen}
                title="Excluir mensagem?"
                description="Tem certeza que deseja excluir essa mensagem? Essa ação não pode ser desfeita."
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                submitting={deleting}
                destructive
            />
            <Toast {...toast} onClose={hideToast} />
        </Box>
    )
}