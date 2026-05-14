import { Box, Divider, Link as MuiLink, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export const PrivacyPolicyPage = () => (
    <Box className="flex flex-col gap-6">
        <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }} color="text.primary">
                Política de Privacidade
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Última atualização: 14 de maio de 2025
            </Typography>
        </Stack>

        <Divider />

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>1. Dados que coletamos</Typography>
            <Typography variant="body2" color="text.secondary">
                Coletamos as seguintes informações ao utilizar o Broadcast:
            </Typography>
            <List dense disablePadding sx={{ pl: 2 }}>
                {[
                    'Endereço de e-mail (utilizado para autenticação e comunicações)',
                    'Dados de uso: páginas visitadas, ações realizadas no app e horários de acesso',
                    'Informações de conexões e contatos cadastrados por você na plataforma',
                    'Conteúdo das mensagens criadas e agendadas por você',
                ].map((item) => (
                    <ListItem key={item} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                        <ListItemText primary={<Typography variant="body2" color="text.secondary">{item}</Typography>} />
                    </ListItem>
                ))}
            </List>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>2. Como usamos seus dados</Typography>
            <Typography variant="body2" color="text.secondary">
                Utilizamos o Firebase Authentication (Google) para gerenciar login e autenticação de forma segura.
                Seus dados de contatos, conexões e mensagens são armazenados no Firebase Firestore e acessados
                exclusivamente por você. Não utilizamos seus dados para fins publicitários.
            </Typography>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>3. Compartilhamento com terceiros</Typography>
            <Typography variant="body2" color="text.secondary">
                O Broadcast <strong>não vende, aluga ou compartilha</strong> seus dados pessoais com terceiros,
                exceto quando exigido por lei ou para cumprimento de obrigação legal. Os únicos serviços de
                terceiros utilizados são os da Google (Firebase), sujeitos à{' '}
                <MuiLink href="https://policies.google.com/privacy" target="_blank" rel="noopener">
                    Política de Privacidade do Google
                </MuiLink>.
            </Typography>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>4. Seus direitos (LGPD)</Typography>
            <Typography variant="body2" color="text.secondary">
                Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:
            </Typography>
            <List dense disablePadding sx={{ pl: 2 }}>
                {[
                    'Acessar os dados que temos sobre você',
                    'Solicitar a correção de dados incorretos',
                    'Solicitar a exclusão da sua conta e de todos os seus dados',
                    'Revogar o consentimento de uso de dados a qualquer momento',
                ].map((item) => (
                    <ListItem key={item} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                        <ListItemText primary={<Typography variant="body2" color="text.secondary">{item}</Typography>} />
                    </ListItem>
                ))}
            </List>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>5. Retenção de dados</Typography>
            <Typography variant="body2" color="text.secondary">
                Seus dados são mantidos enquanto sua conta estiver ativa. Ao solicitar a exclusão da conta,
                todos os dados pessoais serão removidos de nossos sistemas em até 30 dias.
            </Typography>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>6. Contato</Typography>
            <Typography variant="body2" color="text.secondary">
                Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato pelo e-mail:{' '}
                <MuiLink href="mailto:privacy@broadcast.app">privacy@broadcast.app</MuiLink>
            </Typography>
        </Stack>

        <Divider />

        <Typography variant="body2" align="center" color="text.secondary">
            <MuiLink component={RouterLink} to="/login" sx={{ fontWeight: 500 }}>Voltar ao login</MuiLink>
        </Typography>
    </Box>
)
