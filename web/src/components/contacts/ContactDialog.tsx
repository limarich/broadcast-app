import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Contact } from "../../types";
import { addContact, updateContact } from "../../services/contactService";

interface ContactDialogProps {
    open: boolean;
    onClose: () => void;
    selectedContact?: Contact | null;
    connectionId: string;
}

export const ContactDialog = ({ open, onClose, selectedContact, connectionId }: ContactDialogProps) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [submitting, setSubmitting] = useState(false)

    const { user } = useAuth()

    useEffect(() => {
        if (open) {
            setName(selectedContact?.name ?? '')
            setPhone(selectedContact?.phone ?? '')
        }
    }, [open, selectedContact])

    const handleSave = async () => {
        if (!user) return;
        setSubmitting(true)
        try {
            if (selectedContact) {
                await updateContact({ id: selectedContact.id, name, phone });
            } else {
                await addContact({ userId: user.uid, name, phone, connectionId });
            }
        } finally {
            setSubmitting(false)
            onClose()
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle> {selectedContact ? 'Editar' : 'Nova'} Contato </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Digite as informações do seu contato:
                </DialogContentText>
                <TextField
                    required
                    label="Nome do Contato"
                    placeholder="Ex: Joana da Silva"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    required
                    label="Telefone"
                    placeholder="Ex: (11) 91234-5678"
                    fullWidth
                    margin="normal"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={!name || submitting}
                    variant="contained"
                >
                    {submitting ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
} 