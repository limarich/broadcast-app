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
    Switch,
    Stack,
} from "@mui/material";
import { PersonAddOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMessage, updateMessage } from "../../services/messageService";
import { useAuth } from "../../contexts/AuthContext";
import type { Contact, Message } from "../../types";
import { Timestamp } from "firebase/firestore";

interface MessageDialogProps {
    open: boolean;
    onClose: () => void;
    selectedMessage?: Message | null;
    preselectedContactId?: string | null;
    connectionId: string;
    contacts: Contact[];
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export const MessageDialog = ({ open, onClose, selectedMessage, preselectedContactId, connectionId, contacts, onSuccess, onError }: MessageDialogProps) => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [content, setContent] = useState('')
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
    const [scheduledAt, setScheduledAt] = useState('')
    const [scheduleEnabled, setScheduleEnabled] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (open) {
            setContent(selectedMessage?.content ?? '')
            setErrors({})

            if (selectedMessage) {
                setSelectedContactIds(selectedMessage.contactIds ?? [])
            } else if (preselectedContactId) {
                setSelectedContactIds([preselectedContactId])
            } else {
                setSelectedContactIds([])
            }

            if (selectedMessage?.scheduledAt) {
                const date = selectedMessage.scheduledAt instanceof Timestamp
                    ? selectedMessage.scheduledAt.toDate()
                    : new Date(selectedMessage.scheduledAt as string)
                const iso = date.toISOString().slice(0, 16)
                setScheduledAt(iso)
                setScheduleEnabled(true)
            } else {
                setScheduledAt('')
                setScheduleEnabled(false)
            }
        }
    }, [open, selectedMessage, preselectedContactId])

    const handleToggleContact = (contactId: string) => {
        setSelectedContactIds((prev) =>
            prev.includes(contactId)
                ? prev.filter((id) => id !== contactId)
                : [...prev, contactId]
        )
    }

    const defaultScheduledAt = () => {
        const d = new Date()
        d.setHours(d.getHours() + 1, 0, 0, 0)
        return d.toISOString().slice(0, 16)
    }

    const handleToggleSchedule = (enabled: boolean) => {
        setScheduleEnabled(enabled)
        if (enabled) {
            setScheduledAt(defaultScheduledAt())
        } else {
            setScheduledAt('')
        }
    }

    const validate = () => {
        const next: Record<string, string> = {}

        if (!content.trim()) {
            next.content = 'Conteúdo é obrigatório'
        } else if (content.trim().length < 5) {
            next.content = 'Conteúdo deve ter pelo menos 5 caracteres'
        } else if (content.trim().length > 1000) {
            next.content = 'Conteúdo deve ter no máximo 1000 caracteres'
        }

        if (selectedContactIds.length === 0) {
            next.contacts = 'Selecione pelo menos um destinatário'
        }

        if (scheduleEnabled) {
            if (!scheduledAt) {
                next.scheduledAt = 'Informe a data e hora do agendamento'
            } else if (new Date(scheduledAt) <= new Date()) {
                next.scheduledAt = 'A data de agendamento deve ser no futuro'
            }
        }

        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSave = async () => {
        if (!user || !validate()) return
        setSubmitting(true)
        try {
            const parsedScheduledAt = scheduleEnabled && scheduledAt ? new Date(scheduledAt) : undefined

            if (selectedMessage) {
                await updateMessage({
                    id: selectedMessage.id,
                    content,
                    contactIds: selectedContactIds,
                    scheduledAt: parsedScheduledAt,
                    status: parsedScheduledAt ? 'SCHEDULED' : 'SENT',
                })
                onSuccess?.('Mensagem atualizada com sucesso!')
            } else {
                await addMessage({
                    userId: user.uid,
                    connectionId,
                    content,
                    contactIds: selectedContactIds,
                    scheduledAt: parsedScheduledAt,
                })
                onSuccess?.('Mensagem criada com sucesso!')
            }
            onClose()
        } catch {
            onError?.('Erro ao salvar mensagem. Tente novamente.')
        } finally {
            setSubmitting(false)
        }
    }

    const saveLabel = scheduleEnabled ? 'Agendar envio' : 'Enviar agora'

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { maxHeight: '85vh', mx: { xs: 2, sm: 'auto' }, width: '100%' } }}>
            <DialogTitle>
                <div className="flex flex-col gap-0.5">
                    <span>{selectedMessage ? 'Editar mensagem' : 'Nova mensagem'}</span>
                    <Typography variant="body2" color="text.secondary">
                        {selectedMessage
                            ? 'Edite o conteúdo ou os destinatários da mensagem'
                            : 'Selecione os destinatários e escreva sua mensagem'}
                    </Typography>
                </div>
            </DialogTitle>

            <DialogContent>
                <div className="flex flex-col gap-4 pt-2">
                    <TextField
                        required
                        label="Conteúdo da mensagem"
                        placeholder="Digite sua mensagem..."
                        fullWidth
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value)
                            setErrors(prev => ({ ...prev, content: '' }))
                        }}
                        error={!!errors.content}
                        helperText={errors.content || `${content.length}/1000 caracteres`}
                        slotProps={{ htmlInput: { maxLength: 1000 } }}
                    />

                    <div className="flex flex-col gap-2">
                        <Typography variant="subtitle2">
                            Destinatários{selectedContactIds.length > 0 && (
                                <Typography component="span" variant="caption" color="primary" sx={{ ml: 1 }}>
                                    ({selectedContactIds.length} selecionado{selectedContactIds.length !== 1 ? 's' : ''})
                                </Typography>
                            )}
                        </Typography>

                        {errors.contacts && (
                            <Typography variant="caption" color="error">
                                {errors.contacts}
                            </Typography>
                        )}

                        {contacts.length === 0 ? (
                            <Stack direction="row"
                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 2, py: 1.5, alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Nenhum contato disponível nessa conexão.
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<PersonAddOutlined fontSize="small" />}
                                    onClick={() => {
                                        onClose()
                                        navigate(`/connections/${connectionId}/contacts`)
                                    }}
                                >
                                    Adicionar
                                </Button>
                            </Stack>
                        ) : (
                            <Box
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                    px: 1.5,
                                    py: 0.5,
                                }}
                            >
                                <FormGroup>
                                    {contacts.map((contact) => (
                                        <FormControlLabel
                                            key={contact.id}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={selectedContactIds.includes(contact.id)}
                                                    onChange={() => {
                                                        handleToggleContact(contact.id)
                                                        setErrors(prev => ({ ...prev, contacts: '' }))
                                                    }}
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
                            </Box>
                        )}
                    </div>

                    <Divider />

                    <div className="flex flex-col gap-3">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={scheduleEnabled}
                                    onChange={(e) => handleToggleSchedule(e.target.checked)}
                                    size="small"
                                />
                            }
                            label={
                                <Typography variant="subtitle2">
                                    Agendar envio
                                </Typography>
                            }
                        />

                        {scheduleEnabled && (
                            <TextField
                                label="Data e hora do envio"
                                type="datetime-local"
                                fullWidth
                                value={scheduledAt}
                                onChange={(e) => {
                                    setScheduledAt(e.target.value)
                                    setErrors(prev => ({ ...prev, scheduledAt: '' }))
                                }}
                                error={!!errors.scheduledAt}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { min: new Date().toISOString().slice(0, 16) },
                                }}
                                helperText={errors.scheduledAt || 'A mensagem será enviada automaticamente nesse horário'}
                            />
                        )}
                    </div>
                </div>
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
                    {submitting ? <CircularProgress size={20} /> : saveLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
