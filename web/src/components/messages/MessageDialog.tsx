import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    CircularProgress,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    Box,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { addMessage, updateMessage } from "../../services/messageService";
import { useAuth } from "../../contexts/AuthContext";
import type { Contact, Message } from "../../types";

interface MessageDialogProps {
    open: boolean;
    onClose: () => void;
    selectedMessage?: Message | null;
    connectionId: string;
    contacts: Contact[];
}

export const MessageDialog = ({ open, onClose, selectedMessage, connectionId, contacts }: MessageDialogProps) => {
    const { user } = useAuth()

    const [content, setContent] = useState('')
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
    const [scheduledAt, setScheduledAt] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const [dateKey, setDateKey] = useState(0)
    const [isDateFocused, setIsDateFocused] = useState(false)

    const handleClearDate = () => {
        setScheduledAt('')
        setDateKey((prev) => prev + 1)
        setIsDateFocused(false)
    }

    useEffect(() => {
        if (open) {
            setContent(selectedMessage?.content ?? '')
            setSelectedContactIds(selectedMessage?.contactIds ?? [])
            if (selectedMessage?.scheduledAt) {
                const date = typeof (selectedMessage.scheduledAt as any).toDate === 'function'
                    ? (selectedMessage.scheduledAt as any).toDate()
                    : new Date(selectedMessage.scheduledAt as any)
                setScheduledAt(date.toISOString().slice(0, 16))
            } else {
                setScheduledAt('')
            }
        }
    }, [open, selectedMessage])

    const handleToggleContact = (contactId: string) => {
        setSelectedContactIds((prev) =>
            prev.includes(contactId)
                ? prev.filter((id) => id !== contactId)
                : [...prev, contactId]
        )
    }

    const handleSave = async () => {
        if (!user) return
        setSubmitting(true)
        try {
            const parsedScheduledAt = scheduledAt ? new Date(scheduledAt) : undefined

            if (selectedMessage) {
                await updateMessage({
                    id: selectedMessage.id,
                    content,
                    contactIds: selectedContactIds,
                    scheduledAt: parsedScheduledAt,
                })
            } else {
                await addMessage({
                    userId: user.uid,
                    connectionId,
                    content,
                    contactIds: selectedContactIds,
                    scheduledAt: parsedScheduledAt,
                })
            }
            onClose()
        } finally {
            setSubmitting(false)
        }
    }

    const isValid = content.trim().length > 0 && selectedContactIds.length > 0

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {selectedMessage ? 'Editar mensagem' : 'Nova mensagem'}
            </DialogTitle>
            <DialogContent>
                <Box className="flex flex-col gap-4 pt-2">
                    <TextField
                        required
                        label="Conteúdo da mensagem"
                        placeholder="Digite sua mensagem..."
                        fullWidth
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Destinatários
                        </Typography>
                        {contacts.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                Nenhum contato disponível nessa conexão.
                            </Typography>
                        ) : (
                            <FormGroup>
                                {contacts.map((contact) => (
                                    <FormControlLabel
                                        key={contact.id}
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={selectedContactIds.includes(contact.id)}
                                                onChange={() => handleToggleContact(contact.id)}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">
                                                {contact.name}{' '}
                                                <Typography component="span" variant="caption" color="text.secondary">
                                                    {contact.phone}
                                                </Typography>
                                            </Typography>
                                        }
                                    />
                                ))}
                            </FormGroup>
                        )}
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Agendamento (opcional)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                            <TextField
                                key={dateKey}
                                type={scheduledAt || isDateFocused ? "datetime-local" : "text"}
                                fullWidth
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                onFocus={() => setIsDateFocused(true)}
                                onBlur={() => setIsDateFocused(false)}
                                placeholder="Clique para agendar (opcional)"
                                slotProps={{
                                    inputLabel: { shrink: (scheduledAt || isDateFocused) ? true : undefined },
                                    htmlInput: (scheduledAt || isDateFocused) ? { min: new Date().toISOString().slice(0, 16) } : {}
                                }}
                                helperText="Deixe em branco para enviar imediatamente"
                            />
                            <Tooltip title="Limpar agendamento">
                                <IconButton
                                    color="error"
                                    onClick={handleClearDate}
                                    sx={{ mt: 0.5 }}
                                >
                                    <Clear />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={!isValid || submitting}
                    variant="contained"
                >
                    {submitting ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}