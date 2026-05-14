import { Add, ContactsOutlined, DeleteOutlined, EditOutlined, NavigateNextOutlined, Person, SendOutlined } from '@mui/icons-material'
import {
    Box,
    Breadcrumbs,
    Button,
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
    Tooltip,
    Typography,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import type { Contact } from '../types'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useNavigate, useParams } from 'react-router-dom'
import { useContacts } from '../hooks/useContacts'
import { ContactDialog } from '../components/contacts/ContactDialog'
import { deleteContact } from '../services/contactService'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/Toast'
import { useConnection } from '../contexts/ConnectionContext'
import { formatPhoneNumber, formatDate } from '../utils/format'

export const ContactsPage = () => {
    const { user } = useAuth()
    const { connectionId } = useParams<{ connectionId: string }>()
    const { contacts, loading } = useContacts(user?.uid ?? '', connectionId ?? '');
    const { activedConnection } = useConnection()
    const navigate = useNavigate()

    const { toast, showToast, hideToast } = useToast()

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const paginatedContacts = contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    const handleEditContact = (contact: Contact) => {
        setSelectedContact(contact);
        setDialogOpen(true);
    }

    const handleDeleteContact = (contact: Contact) => {
        setSelectedContact(contact);
        setConfirmDialogOpen(true);
    }

    const handleConfirmDelete = async () => {
        if (!selectedContact || !user || !connectionId) return;

        try {
            setDeleting(true);
            await deleteContact({ id: selectedContact.id, connectionId, userId: user.uid });
            setConfirmDialogOpen(false);
            showToast('Contato excluído com sucesso!')
        } catch (error) {
            console.error("Erro ao excluir contato:", error);
            showToast('Erro ao excluir contato. Tente novamente.', 'error')
        } finally {
            setDeleting(false);
            setSelectedContact(null);
        }
    }

    return (
        <Box className="p-8 flex flex-col gap-6">
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
                    {activedConnection?.name ?? '...'}
                </Typography>
            </Breadcrumbs>
            <Box className="flex items-center justify-between">
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Contatos</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gerencie seus contatos
                    </Typography>
                </Box>
                <Button variant="contained"
                    startIcon={<Add />}
                    onClick={() => setDialogOpen(true)}
                >
                    Novo contato
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ minHeight: 480, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Criado em</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && Array.from({ length: 4 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton variant="text" width="55%" /></TableCell>
                                <TableCell><Skeleton variant="text" width="45%" /></TableCell>
                                <TableCell><Skeleton variant="text" width="35%" /></TableCell>
                                <TableCell align="right">
                                    <Skeleton variant="circular" width={28} height={28} sx={{ display: 'inline-block', mr: 0.5 }} />
                                    <Skeleton variant="circular" width={28} height={28} sx={{ display: 'inline-block' }} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {!loading && contacts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Box className="flex flex-col items-center gap-2 py-8 text-center">
                                        <ContactsOutlined sx={{ fontSize: 40, color: 'text.disabled' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhum contato encontrado
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            Crie seu primeiro contato para começar
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                        {!loading && paginatedContacts.map((contact) => (
                            <TableRow key={contact.id} hover>
                                <TableCell>
                                    <Box className="flex items-center gap-2">
                                        <Person fontSize="small" color="primary" />
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {contact.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatPhoneNumber(contact.phone)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(contact.createdAt)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Enviar mensagem">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/connections/${connectionId}/messages`, {
                                                    state: { preselectedContactId: contact.id }
                                                })
                                            }}
                                        >
                                            <SendOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton size="small" onClick={() => handleEditContact(contact)}>
                                            <EditOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <IconButton size="small" color="error" onClick={() => handleDeleteContact(contact)}>
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
                    count={contacts.length}
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
            <ContactDialog open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedContact(null);
                }}
                selectedContact={selectedContact}
                connectionId={connectionId || ""}
                onSuccess={(msg) => showToast(msg)}
                onError={(msg) => showToast(msg, 'error')}
            />
            <ConfirmDialog
                open={confirmDialogOpen}
                title="Excluir contato?"
                description="Tem certeza que deseja excluir esse contato? Essa ação não pode ser desfeita."
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                submitting={deleting}
                destructive
            />
            <Toast {...toast} onClose={hideToast} />
        </Box>
    )
}