import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Link as MuiLink, Stack, Typography } from '@mui/material'
import { ExpandMoreOutlined } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

interface FaqItem {
    question: string
    answer: string
}

const faqs: FaqItem[] = [
    {
        question: 'O que é o Broadcast?',
        answer: 'O Broadcast é uma plataforma SaaS para envio e agendamento de mensagens em massa para seus contatos. Você cria conexões (canais de envio), cadastra contatos e gerencia mensagens: tudo em um só lugar.',
    },
    {
        question: 'Como funcionam as Conexões?',
        answer: 'Uma Conexão representa um canal de envio, como um número de WhatsApp ou outro serviço de mensageria. Você pode ter múltiplas conexões ativas e gerenciar contatos e mensagens separadamente para cada uma.',
    },
    {
        question: 'Como funciona o agendamento de mensagens?',
        answer: 'Ao criar ou editar uma mensagem, você pode definir uma data e horário de envio. Mensagens agendadas ficam com status "Agendada" e são enviadas automaticamente no horário configurado. Deixe o campo em branco para enviar imediatamente.',
    },
    {
        question: 'Meus dados estão seguros?',
        answer: 'Sim. Utilizamos Firebase Authentication para autenticação segura e Firebase Firestore para armazenamento de dados. Toda comunicação é criptografada via HTTPS. Não compartilhamos seus dados com terceiros. Consulte nossa Política de Privacidade para mais detalhes.',
    },
    {
        question: 'Como excluo minha conta?',
        answer: 'Para excluir sua conta e todos os dados associados, entre em contato pelo e-mail support@broadcast.app com o assunto "Exclusão de conta". Processamos solicitações em até 7 dias úteis. Todos os dados são removidos em até 30 dias após a confirmação.',
    },
    {
        question: 'O Broadcast é gratuito?',
        answer: 'Durante o período beta, o Broadcast é completamente gratuito e sem limite de uso. Quando lançarmos planos pagos, usuários beta receberão condições especiais de migração com antecedência mínima de 30 dias.',
    },
    {
        question: 'Posso importar contatos de uma planilha?',
        answer: 'No momento, a importação em massa de contatos via planilha está em desenvolvimento e será disponibilizada em breve. Atualmente, os contatos são cadastrados individualmente na plataforma.',
    },
]

export const FaqPage = () => (
    <Box className="flex flex-col gap-6">
        <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }} color="text.primary">
                Perguntas Frequentes
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Encontre respostas para as dúvidas mais comuns sobre o Broadcast.
            </Typography>
        </Stack>

        <Divider />

        <Box className="flex flex-col gap-2">
            {faqs.map(({ question, answer }) => (
                <Accordion key={question} disableGutters elevation={0} variant="outlined">
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {question}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2" color="text.secondary">
                            {answer}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>

        <Divider />

        <Typography variant="body2" align="center" color="text.secondary">
            Ainda tem dúvidas?{' '}
            <MuiLink href="mailto:support@broadcast.app" sx={{ fontWeight: 500 }}>
                Fale conosco
            </MuiLink>
        </Typography>

        <Typography variant="body2" align="center" color="text.secondary">
            <MuiLink component={RouterLink} to="/login" sx={{ fontWeight: 500 }}>Voltar ao login</MuiLink>
        </Typography>
    </Box>
)
