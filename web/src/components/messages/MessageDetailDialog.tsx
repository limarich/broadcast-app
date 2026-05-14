import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Chip,
    Divider,
    Box,
    Stack,
} from "@mui/material";
import { CloseOutlined, ScheduleOutlined, SendOutlined } from "@mui/icons-material";
import type { Contact, Message } from "../../types";
import { formatDate } from "../../utils/format";

interface MessageDetailDialogProps {
    open: boolean;
    onClose: () => void;
    message: Message | null;
    contacts: Contact[];
}

export const MessageDetailDialog = ({ open, onClose, message, contacts }: MessageDetailDialogProps) => {
    if (!message) return null

    const resolveContactName = (id: string) =>
        contacts.find((c) => c.id === id)?.name ?? null

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { maxHeight: '85vh', mx: { xs: 2, sm: 'auto' }, width: '100%' } }}>
            <DialogTitle>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                        <span>Detalhes da mensagem</span>
                        <Typography variant="body2" color="text.secondary">
                            {message.status === 'SCHEDULED' ? 'Mensagem agendada' : 'Mensagem enviada'}
                        </Typography>
                    </div>
                    <IconButton size="small" onClick={onClose}>
                        <CloseOutlined fontSize="small" />
                    </IconButton>
                </div>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ pt: 1 }}>
                    <div>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Status
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                            {message.status === 'SCHEDULED' ? (
                                <Chip icon={<ScheduleOutlined />} label="Agendada" size="small" color="warning" variant="outlined" />
                            ) : (
                                <Chip icon={<SendOutlined />} label="Enviada" size="small" color="success" variant="outlined" />
                            )}
                        </Box>
                    </div>

                    <Divider />

                    <div>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Conteúdo
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {message.content}
                        </Typography>
                    </div>

                    <Divider />

                    <div>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Destinatários ({message.contactIds.length})
                        </Typography>
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                            {message.contactIds.length === 0 ? (
                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                    Sem destinatários
                                </Typography>
                            ) : message.contactIds.map((id) => {
                                const name = resolveContactName(id)
                                return (
                                    <Typography key={id} variant="body2" color={name ? 'text.primary' : 'text.disabled'} sx={name ? undefined : { fontStyle: 'italic' }}>
                                        {name ?? 'Contato removido'}
                                    </Typography>
                                )
                            })}
                        </Stack>
                    </div>

                    {(message.scheduledAt || message.sentAt) && (
                        <>
                            <Divider />
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                {message.scheduledAt && (
                                    <div>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Agendado para
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {formatDate(message.scheduledAt, true)}
                                        </Typography>
                                    </div>
                                )}
                                {message.sentAt && (
                                    <div>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Enviado em
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {formatDate(message.sentAt, true)}
                                        </Typography>
                                    </div>
                                )}
                            </Stack>
                        </>
                    )}

                    <Divider />

                    <div>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Criado em
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {formatDate(message.createdAt, true)}
                        </Typography>
                    </div>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
