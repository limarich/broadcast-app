import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface Props {
    open: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
    onClose: () => void;
    submitting?: boolean;
    destructive?: boolean;
}

export const ConfirmDialog = ({ open, title, description, onConfirm, onClose, submitting, destructive }: Props) => {
    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { maxHeight: '85vh', mx: { xs: 2, sm: 'auto' }, width: '100%' } }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button color={destructive ? 'error' : 'primary'} onClick={onConfirm} disabled={submitting}>
                    {submitting ? <CircularProgress size={20} /> : (destructive ? 'Excluir' : 'Confirmar')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
