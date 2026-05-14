import { Box, Divider, Link as MuiLink, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export const TermsOfServicePage = () => (
    <Box className="flex flex-col gap-6">
        <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }} color="text.primary">
                Termos de Uso
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Última atualização: 14 de maio de 2025
            </Typography>
        </Stack>

        <Divider />

        <Typography variant="body2" color="text.secondary">
            Ao criar uma conta e utilizar o Broadcast, você concorda com os termos descritos abaixo.
            Leia com atenção antes de prosseguir.
        </Typography>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>1. Sua conta</Typography>
            <Typography variant="body2" color="text.secondary">
                Você é responsável por manter a confidencialidade das credenciais de acesso à sua conta.
                Qualquer atividade realizada com seu login é de sua responsabilidade. Notifique-nos imediatamente
                em caso de uso não autorizado pelo e-mail{' '}
                <MuiLink href="mailto:security@broadcast.app">security@broadcast.app</MuiLink>.
            </Typography>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>2. Uso aceitável</Typography>
            <Typography variant="body2" color="text.secondary">
                Ao usar o Broadcast, você concorda em <strong>não</strong>:
            </Typography>
            <List dense disablePadding sx={{ pl: 2 }}>
                {[
                    'Enviar mensagens não solicitadas (spam) ou conteúdo abusivo',
                    'Usar a plataforma para atividades ilegais ou que violem direitos de terceiros',
                    'Tentar acessar contas ou dados de outros usuários',
                    'Sobrecarregar intencionalmente a infraestrutura do serviço',
                    'Revender ou sublicenciar o acesso ao Broadcast sem autorização prévia',
                ].map((item) => (
                    <ListItem key={item} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                        <ListItemText primary={<Typography variant="body2" color="text.secondary">{item}</Typography>} />
                    </ListItem>
                ))}
            </List>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>3. Disponibilidade do serviço</Typography>
            <Typography variant="body2" color="text.secondary">
                O Broadcast é disponibilizado "como está". Embora nos esforcemos para garantir alta disponibilidade,
                não garantimos que o serviço estará disponível de forma ininterrupta. Manutenções programadas
                serão comunicadas com antecedência sempre que possível.
            </Typography>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>4. Propriedade intelectual</Typography>
            <Typography variant="body2" color="text.secondary">
                Todo o código, design, marca e conteúdo do Broadcast são propriedade intelectual da empresa.
                O conteúdo que você cria (mensagens, contatos, conexões) permanece de sua propriedade.
                Ao utilizar o serviço, você nos concede uma licença limitada para processar e armazenar
                esses dados com o fim exclusivo de operar a plataforma.
            </Typography>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>5. Encerramento de conta</Typography>
            <Typography variant="body2" color="text.secondary">
                Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos, sem aviso
                prévio em casos graves. Você pode encerrar sua conta a qualquer momento acessando as
                configurações do perfil ou solicitando a exclusão pelo e-mail{' '}
                <MuiLink href="mailto:support@broadcast.app">support@broadcast.app</MuiLink>.
            </Typography>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>6. Lei aplicável</Typography>
            <Typography variant="body2" color="text.secondary">
                Estes Termos são regidos pelas leis brasileiras, em especial a Lei Geral de Proteção de Dados
                (LGPD — Lei 13.709/2018) e o Código de Defesa do Consumidor. Fica eleito o foro da comarca de
                São Paulo/SP para dirimir quaisquer controvérsias.
            </Typography>
        </Stack>

        <Divider />

        <Typography variant="body2" align="center" color="text.secondary">
            <MuiLink component={RouterLink} to="/login" sx={{ fontWeight: 500 }}>Voltar ao login</MuiLink>
        </Typography>
    </Box>
)
