import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Contact } from "../../types";
import { addContact, updateContact } from "../../services/contactService";
import { formatPhoneNumber } from "../../utils/format";

interface ContactDialogProps {
    open: boolean;
    onClose: () => void;
    selectedContact?: Contact | null;
    connectionId: string;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

const PHONE_REGEX = /^\+?[\d\s\-()\[\]]{8,20}$/

export const ContactDialog = ({ open, onClose, selectedContact, connectionId, onSuccess, onError }: ContactDialogProps) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { user } = useAuth()

    useEffect(() => {
        if (open) {
            setName(selectedContact?.name ?? '')
            setPhone(formatPhoneNumber(selectedContact?.phone ?? ''))
            setErrors({})
        }
    }, [open, selectedContact])

    const validate = () => {
        const next: Record<string, string> = {}

        if (!name.trim()) {
            next.name = 'Nome é obrigatório'
        } else if (name.trim().length < 2) {
            next.name = 'Nome deve ter pelo menos 2 caracteres'
        } else if (name.trim().length > 50) {
            next.name = 'Nome deve ter no máximo 50 caracteres'
        }

        if (!phone.trim()) {
            next.phone = 'Telefone é obrigatório'
        } else if (!PHONE_REGEX.test(phone.trim())) {
            next.phone = 'Telefone inválido. Use o formato: (99) 99999-9999'
        }

        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSave = async () => {
        if (!user || !validate()) return;
        setSubmitting(true)
        try {
            if (selectedContact) {
                await updateContact({ id: selectedContact.id, name, phone });
                onSuccess?.('Contato atualizado com sucesso!')
            } else {
                await addContact({ userId: user.uid, name, phone, connectionId });
                onSuccess?.('Contato criado com sucesso!')
            }
            onClose()
        } catch {
            onError?.('Erro ao salvar contato. Tente novamente.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { maxHeight: '85vh', mx: { xs: 2, sm: 'auto' }, width: '100%' } }}>
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
                    onChange={(e) => {
                        setName(e.target.value)
                        setErrors(prev => ({ ...prev, name: '' }))
                    }}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    required
                    label="Telefone"
                    placeholder="Ex: (11) 91234-5678"
                    fullWidth
                    margin="normal"
                    value={phone}
                    onChange={(e) => {
                        setPhone(formatPhoneNumber(e.target.value))
                        setErrors(prev => ({ ...prev, phone: '' }))
                    }}
                    error={!!errors.phone}
                    helperText={errors.phone}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={submitting}
                    variant="contained"
                >
                    {submitting ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
