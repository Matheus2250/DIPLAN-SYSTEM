import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Paper,
  Tabs,
  Tab,
  Button,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useNavigate } from 'react-router-dom';

// Componente para dados fictícios
const dataMock = {
  licitacoes: [
    { id: 1, numero: 'LIC-2025-001', modalidade: 'Pregão', objeto: 'Aquisição de notebooks', valor: 250000.00, status: 'Em andamento', prazo: '30/06/2025' },
    { id: 2, numero: 'LIC-2025-002', modalidade: 'Dispensa', objeto: 'Serviços de manutenção', valor: 45000.00, status: 'Concluída', prazo: '15/05/2025' },
    { id: 3, numero: 'LIC-2025-003', modalidade: 'Pregão', objeto: 'Material de escritório', valor: 30000.00, status: 'Planejamento', prazo: '10/08/2025' },
    { id: 4, numero: 'LIC-2025-004', modalidade: 'Concorrência', objeto: 'Reforma predial', valor: 1200000.00, status: 'Em andamento', prazo: '20/09/2025' },
  ],
  documentos: [
    { id: 1, nome: 'Edital LIC-2025-001.pdf', tipo: 'Edital', tamanho: '2.5 MB', data: '10/04/2025', status: 'Aprovado' },
    { id: 2, nome: 'Termo de Referência LIC-2025-003.docx', tipo: 'TR', tamanho: '1.8 MB', data: '15/04/2025', status: 'Em revisão' },
    { id: 3, nome: 'Contrato LIC-2025-002.pdf', tipo: 'Contrato', tamanho: '3.2 MB', data: '20/04/2025', status: 'Pendente' },
  ]
};

function DipliDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluída':
      case 'Aprovado':
        return 'success';
      case 'Em andamento':
      case 'Em revisão':
        return 'primary';
      case 'Planejamento':
      case 'Pendente':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ 
  display: 'flex', 
  minHeight: '100vh', 
  height: '100%', 
  bgcolor: '#f5f7fa',
  overflow: 'auto'  // Importante para garantir o scroll
}}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: 'none'
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          p: 2
        }}>
          <Typography variant="h6" color="secondary" sx={{ fontWeight: 700 }}>
            DIPLI
          </Typography>
        </Box>
        <List component="nav" sx={{ p: 2 }}>
          <ListItem button selected>
            <ListItemIcon>
              <DashboardIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Licitações" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Documentos" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Relatórios" />
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItem button onClick={() => navigate('/')}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </List>
      </Drawer>

      {/* Drawer móvel */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            p: 2
          }}>
            <Typography variant="h6" color="secondary" sx={{ fontWeight: 700 }}>
              DIPLI
            </Typography>
          </Box>
          <List component="nav" sx={{ p: 2 }}>
            <ListItem button selected onClick={toggleDrawer}>
              <ListItemIcon>
                <DashboardIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Licitações" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Documentos" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Relatórios" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={() => navigate('/')}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo principal */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)', bgcolor: 'background.paper' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                Administrador
              </Typography>
              <Avatar sx={{ bgcolor: theme.palette.secondary.dark }}>
                <PersonIcon fontSize="small" />
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Dashboard DIPLI
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Visão geral das licitações, documentos e processos internos
          </Typography>

          {/* Cards de resumo */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  bgcolor: 'secondary.50',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                      <AssignmentTurnedInIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Licitações Ativas
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="secondary.main">
                        24
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  bgcolor: 'primary.50',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                      <ReceiptIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Valor em Contratos
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="primary.main">
                        R$ 850K
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  bgcolor: 'success.50',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                      <EventIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Concluídas (2025)
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        8
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  bgcolor: 'warning.50',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                      <PriorityHighIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Documentos Pendentes
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="warning.main">
                        12
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Conteúdo baseado nas abas */}
          <Paper sx={{ mt: 4, borderRadius: 2, overflow: 'hidden' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
              sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}
            >
              <Tab label="Visão Geral" />
              <Tab label="Licitações" />
              <Tab label="Documentos" />
              <Tab label="Relatórios" />
            </Tabs>

            {/* Aba Visão Geral */}
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Licitações Recentes
                    </Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Número</TableCell>
                            <TableCell>Modalidade</TableCell>
                            <TableCell>Objeto</TableCell>
                            <TableCell>Valor (R$)</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Prazo</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataMock.licitacoes.map((licitacao) => (
                            <TableRow key={licitacao.id}>
                              <TableCell>{licitacao.numero}</TableCell>
                              <TableCell>{licitacao.modalidade}</TableCell>
                              <TableCell>{licitacao.objeto}</TableCell>
                              <TableCell>{licitacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={licitacao.status} 
                                  color={getStatusColor(licitacao.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{licitacao.prazo}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Documentos Recentes
                    </Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Tamanho</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataMock.documentos.map((documento) => (
                            <TableRow key={documento.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AttachFileIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                  {documento.nome}
                                </Box>
                              </TableCell>
                              <TableCell>{documento.tipo}</TableCell>
                              <TableCell>{documento.tamanho}</TableCell>
                              <TableCell>{documento.data}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={documento.status} 
                                  color={getStatusColor(documento.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Button size="small" color="secondary">Visualizar</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Atividades Pendentes
                    </Typography>
                    <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 1, bgcolor: 'warning.50' }}>
                            <PriorityHighIcon color="warning" sx={{ mr: 2 }} />
                            <Box>
                              <Typography variant="subtitle2">
                                Revisão de Termo de Referência
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                LIC-2025-003 - Aguardando revisão até 25/04/2025
                              </Typography>
                            </Box>
                            <Box sx={{ ml: 'auto' }}>
                              <Button variant="outlined" color="secondary" size="small">
                                Revisar
                              </Button>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 1, bgcolor: 'error.50' }}>
                            <PriorityHighIcon color="error" sx={{ mr: 2 }} />
                            <Box>
                              <Typography variant="subtitle2">
                                Aprovação de Contrato
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                LIC-2025-002 - Urgente - Vence em 2 dias
                              </Typography>
                            </Box>
                            <Box sx={{ ml: 'auto' }}>
                              <Button variant="outlined" color="error" size="small">
                                Aprovar
                              </Button>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 1, bgcolor: 'primary.50' }}>
                            <PriorityHighIcon color="primary" sx={{ mr: 2 }} />
                            <Box>
                              <Typography variant="subtitle2">
                                Cadastro de Fornecedores
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                LIC-2025-001 - Atualizar dados de fornecedores
                              </Typography>
                            </Box>
                            <Box sx={{ ml: 'auto' }}>
                              <Button variant="outlined" color="primary" size="small">
                                Atualizar
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Aba Licitações */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Buscar licitações por número, objeto ou modalidade..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ maxWidth: 500 }}
                  />
                </Box>
                <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Número</TableCell>
                        <TableCell>Modalidade</TableCell>
                        <TableCell>Objeto</TableCell>
                        <TableCell>Valor (R$)</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Prazo</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataMock.licitacoes.map((licitacao) => (
                        <TableRow key={licitacao.id}>
                          <TableCell>{licitacao.numero}</TableCell>
                          <TableCell>{licitacao.modalidade}</TableCell>
                          <TableCell>{licitacao.objeto}</TableCell>
                          <TableCell>{licitacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <Chip 
                              label={licitacao.status} 
                              color={getStatusColor(licitacao.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{licitacao.prazo}</TableCell>
                          <TableCell align="center">
                            <Button size="small" color="secondary">Detalhes</Button>
                            <Button size="small" color="primary">Editar</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Aba Documentos */}
            {tabValue === 2 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <TextField
                    placeholder="Buscar documentos..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ maxWidth: 400 }}
                  />
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<AttachFileIcon />}
                  >
                    Novo Documento
                  </Button>
                </Box>
                
                <Grid container spacing={3}>
                  {dataMock.documentos.map((documento) => (
                    <Grid item xs={12} sm={6} md={4} key={documento.id}>
                      <Card sx={{ 
                        borderRadius: 2, 
                        boxShadow: 'none', 
                        border: '1px solid #e0e0e0',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 2
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <Avatar 
                              variant="rounded" 
                              sx={{ 
                                bgcolor: 'secondary.50', 
                                color: 'secondary.main',
                                mr: 2
                              }}
                            >
                              <DescriptionIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" noWrap>{documento.nome}</Typography>
                              <Typography variant="body2" color="text.secondary">{documento.tipo} • {documento.tamanho}</Typography>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 1.5 }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Atualizado: {documento.data}
                            </Typography>
                            <Chip 
                              label={documento.status} 
                              color={getStatusColor(documento.status)}
                              size="small"
                            />
                          </Box>
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button 
                              variant="outlined" 
                              color="secondary" 
                              size="small" 
                              fullWidth
                            >
                              Visualizar
                            </Button>
                            <Button 
                              variant="outlined" 
                              color="primary" 
                              size="small" 
                              fullWidth
                            >
                              Baixar
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Aba Relatórios */}
            {tabValue === 3 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Relatórios Disponíveis
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        boxShadow: 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'secondary.light', 
                              color: 'secondary.dark',
                              mr: 2
                            }}
                          >
                            <BarChartIcon />
                          </Avatar>
                          <Typography variant="h6" color="secondary.dark">
                            Relatório de Licitações
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Relatório completo das licitações por status, modalidade e valores totais.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button variant="outlined" color="secondary" size="small">
                            PDF
                          </Button>
                          <Button variant="outlined" color="primary" size="small">
                            Excel
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        boxShadow: 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.light', 
                              color: 'primary.dark',
                              mr: 2
                            }}
                          >
                            <AssignmentIcon />
                          </Avatar>
                          <Typography variant="h6" color="primary.dark">
                            Documentos Pendentes
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Lista de documentos pendentes de aprovação e seus respectivos prazos.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button variant="outlined" color="secondary" size="small">
                            PDF
                          </Button>
                          <Button variant="outlined" color="primary" size="small">
                            Excel
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        boxShadow: 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'success.light', 
                              color: 'success.dark',
                              mr: 2
                            }}
                          >
                            <ReceiptIcon />
                          </Avatar>
                          <Typography variant="h6" color="success.dark">
                            Análise de Processos
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Análise de eficiência dos processos de contratação e tempos médios.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button variant="outlined" color="secondary" size="small">
                            PDF
                          </Button>
                          <Button variant="outlined" color="primary" size="small">
                            Excel
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Container>
        
        <Box component="footer" sx={{ p: 3, mt: 'auto', bgcolor: '#f0f2f5', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Container>
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Sistema de Gerenciamento de Contratações | Versão 1.0
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default DipliDashboard;