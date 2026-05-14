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
import { addConnection, updateConnection } from "../../services/connectionService";
import { useAuth } from "../../contexts/AuthContext";
import type { Connection } from "../../types";

interface ConnectionDialogProps {
    open: boolean;
    onClose: () => void;
    selectedConnection?: Connection | null;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export const ConnectionDialog = ({ open, onClose, selectedConnection, onSuccess, onError }: ConnectionDialogProps) => {
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { user } = useAuth()

    useEffect(() => {
        if (open) {
            setName(selectedConnection?.name ?? '')
            setErrors({})
        }
    }, [open, selectedConnection])

    const validate = () => {
        const next: Record<string, string> = {}
        if (!name.trim()) {
            next.name = 'Nome é obrigatório'
        } else if (name.trim().length < 2) {
            next.name = 'Nome deve ter pelo menos 2 caracteres'
        } else if (name.trim().length > 50) {
            next.name = 'Nome deve ter no máximo 50 caracteres'
        }
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSave = async () => {
        if (!user || !validate()) return;
        setSubmitting(true)
        try {
            if (selectedConnection) {
                await updateConnection({ id: selectedConnection.id, name });
                onSuccess?.('Conexão atualizada com sucesso!')
            } else {
                await addConnection({ userId: user.uid, name });
                onSuccess?.('Conexão criada com sucesso!')
            }
            onClose()
        } catch {
            onError?.('Erro ao salvar conexão. Tente novamente.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { maxHeight: '85vh', mx: { xs: 2, sm: 'auto' }, width: '100%' } }}>
            <DialogTitle> {selectedConnection ? 'Editar' : 'Nova'} Conexão </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Digite as informações da sua conexão:
                </DialogContentText>
                <TextField
                    required
                    label="Nome da conexão"
                    placeholder="Ex: WhatsApp"
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
