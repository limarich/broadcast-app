import { Add, ContactsOutlined, DeleteOutlined, EditOutlined, Person } from '@mui/icons-material'
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
import { useState } from 'react'
import type { Contact } from '../types'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useParams } from 'react-router-dom'
import { useContacts } from '../hooks/useContacts'
import { ContactDialog } from '../components/contacts/ContactDialog'
import { deleteContact } from '../services/contactService'

export const ContactsPage = () => {
    const { user } = useAuth()
    const { connectionId } = useParams<{ connectionId: string }>()
    const { contacts } = useContacts(user?.uid ?? '', connectionId ?? '');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleEditContact = (contact: Contact) => {
        setSelectedContact(contact);
        setDialogOpen(true);
    }

    const handleDeleteContact = (contact: Contact) => {
        setSelectedContact(contact);
        setConfirmDialogOpen(true);
    }

    const handleConfirmDelete = async () => {
        if (!selectedContact || !user) return;

        try {
            setDeleting(true);
            await deleteContact({ id: selectedContact.id });
            setConfirmDialogOpen(false);
        } catch (error) {
            console.error("Erro ao excluir contato:", error);
        } finally {
            setDeleting(false);
            setSelectedContact(null);
        }
    }

    return (
        <Box className="p-8 flex flex-col gap-6">
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

            <TableContainer component={Paper} elevation={0} variant="outlined">
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
                        {contacts.length === 0 && (
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
                        {contacts.map((contact) => (
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
                                        {contact.phone}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {contact.createdAt && contact.createdAt.toDate().toLocaleDateString('pt-BR')}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar"
                                        onClick={() => handleEditContact(contact)}
                                    >
                                        <IconButton size="small">
                                            <EditOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir" onClick={() => handleDeleteContact(contact)}>
                                        <IconButton size="small" color="error">
                                            <DeleteOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ContactDialog open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedContact(null);
                }}
                selectedContact={selectedContact}
                connectionId={connectionId}
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
        </Box>
    )
}