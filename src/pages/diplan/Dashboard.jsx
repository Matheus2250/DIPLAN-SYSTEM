import { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Button, Table, 
  TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Box, CircularProgress, Alert,
  TablePagination, FormControl, InputLabel, 
  Select, MenuItem, TextField, InputAdornment,
  AppBar, Toolbar, Divider, Card, CardContent,
  IconButton, Grid, Drawer, List, ListItem, 
  ListItemIcon, ListItemText, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Modal, Backdrop, Fade,
  Collapse, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router-dom';
import { uploadService, contratacaoService } from "../../services/api";

// Componente estilizado para o cabeçalho
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

// Componente estilizado para a área de upload
const UploadArea = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  }
}));

// Componente estilizado para cards informativos
const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  }
}));

// Status Badge estilizado
const StatusBadge = styled(Chip)(({ theme, status }) => {
  let color;
  switch (status) {
    case 'Aprovada':
      color = theme.palette.success.main;
      break;
    case 'Pendente':
      color = theme.palette.warning.main;
      break;
    case 'Em análise':
      color = theme.palette.info.main;
      break;
    default:
      color = theme.palette.grey[500];
  }
  
  return {
    backgroundColor: alpha(color, 0.1),
    color: color,
    fontWeight: 600,
    borderRadius: '4px',
  };
});

// Largura do drawer
const drawerWidth = 240;

function DiplanDashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [contratacoes, setContratacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // Iniciar como fechado por padrão
  const [activeSection, setActiveSection] = useState('plano');
  
  // Estado para o diálogo de detalhes
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedContratacao, setSelectedContratacao] = useState(null);
  
  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para filtro e ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dfdFilter, setDfdFilter] = useState('');
  const [objectFilter, setObjectFilter] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Voltar para a tela de seleção de área
  const handleBackToSelection = () => {
    navigate('/area-selection');
  };

  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Toggle filtros avançados
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDfdFilter('');
    setObjectFilter('');
    setPage(0);
  };

  // Abrir diálogo de detalhes
  const handleOpenDetails = (contratacao) => {
    setSelectedContratacao(contratacao);
    setDetailsOpen(true);
  };

  // Fechar diálogo de detalhes
  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  // Estatísticas simuladas
  const stats = {
    total: contratacoes.length,
    aprovadas: contratacoes.filter(c => c.status_contratacao === 'Aprovada').length,
    emAnalise: contratacoes.filter(c => c.status_contratacao === 'Em análise').length,
    pendentes: contratacoes.filter(c => c.status_contratacao === 'Pendente').length,
    valorTotal: contratacoes.reduce((sum, c) => sum + (parseFloat(c.valor_total) || 0), 0)
  };

  // Carregar contratações ao iniciar a página
  useEffect(() => {
    fetchContratacoes();
  }, []);

  // Função para formatar datas
  const formatarDataExibicao = (dataString) => {
    if (!dataString || dataString === '0000-00-00') return '-';
    
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return '-'; // Data inválida
      
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return '-';
    }
  };

  // Função para formatar valores monetários
  const formatarMoeda = (valor) => {
    if (!valor) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função para buscar contratações
  const fetchContratacoes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await contratacaoService.getAll();
      
      if (response.data && Array.isArray(response.data)) {
        setContratacoes(response.data);
      } else {
        setError("Dados recebidos em formato inesperado");
      }
    } catch (err) {
      console.error("Erro ao buscar contratações:", err);
      setError(
        `Não foi possível carregar os dados: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Manipular mudança de arquivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setUploadResult(null); // Limpar resultados anteriores
  };

  // Enviar arquivo para o backend
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const response = await uploadService.uploadPca(file);
      setUploadResult({
        success: true,
        message: "Arquivo processado com sucesso!",
        data: response.data
      });
      
      // Recarregar a lista de contratações
      await fetchContratacoes();
    } catch (err) {
      console.error("Erro ao fazer upload:", err);
      setUploadResult({
        success: false,
        message: err.response?.data?.message || "Erro ao processar arquivo."
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Manipuladores para paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtrar as contratações
  const filteredContratacoes = contratacoes.filter(contratacao => {
    // Filtrar por termo de busca geral (pesquisa rápida)
    const matchesTerm = searchTerm === '' || 
      (contratacao.titulo && contratacao.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contratacao.numero_contratacao && contratacao.numero_contratacao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contratacao.area_requisitante && contratacao.area_requisitante.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtrar por status
    const matchesStatus = statusFilter === '' || 
      (contratacao.status_contratacao && contratacao.status_contratacao === statusFilter);
    
    // Filtrar por número DFD
    const matchesDfd = dfdFilter === '' || 
      (contratacao.numero_dfd && contratacao.numero_dfd.toLowerCase().includes(dfdFilter.toLowerCase()));
    
    // Filtrar por objeto (descrição)
    const matchesObject = objectFilter === '' || 
      (contratacao.objeto && contratacao.objeto.toLowerCase().includes(objectFilter.toLowerCase()));
    
    return matchesTerm && matchesStatus && matchesDfd && matchesObject;
  });

  // Obter contratações da página atual
  const paginatedContratacoes = filteredContratacoes
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Conteúdo do drawer
  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          DIPLAN
        </Typography>
        <IconButton onClick={toggleDrawer}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      
      <List component="nav">
        <ListItem 
          button 
          selected={activeSection === 'plano'} 
          onClick={() => setActiveSection('plano')}
        >
          <ListItemIcon>
            <DashboardIcon color={activeSection === 'plano' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Plano de Contratação Anual" />
        </ListItem>
        
        <ListItem 
          button 
          selected={activeSection === 'importar'} 
          onClick={() => setActiveSection('importar')}
        >
          <ListItemIcon>
            <CloudUploadIcon color={activeSection === 'importar' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Importar PCA" />
        </ListItem>
        
        <ListItem 
          button 
          selected={activeSection === 'contratacoes'} 
          onClick={() => setActiveSection('contratacoes')}
        >
          <ListItemIcon>
            <DescriptionIcon color={activeSection === 'contratacoes' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Contratações" />
        </ListItem>
        
        <ListItem 
          button 
          selected={activeSection === 'relatorios'} 
          onClick={() => setActiveSection('relatorios')}
        >
          <ListItemIcon>
            <BarChartIcon color={activeSection === 'relatorios' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Relatórios" />
        </ListItem>
        
        <Divider sx={{ my: 2 }} />
        
        <ListItem button onClick={handleBackToSelection}>
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary="Voltar à Seleção" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* AppBar fixo no topo */}
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {activeSection === 'plano' && 'Plano de Contratação Anual'}
            {activeSection === 'importar' && 'Importar Planilha PCA'}
            {activeSection === 'contratacoes' && 'Contratações Cadastradas'}
            {activeSection === 'relatorios' && 'Relatórios'}
          </Typography>
          
          <Tooltip title="Voltar para seleção de área">
            <IconButton 
              color="inherit" 
              onClick={handleBackToSelection}
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </StyledAppBar>
      
      {/* Área principal com drawer e conteúdo */}
      <Box sx={{ display: 'flex', flexGrow: 1, pt: 8 }}> {/* pt para compensar a altura da AppBar */}
        {/* Drawer móvel */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            display: 'block',
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
            zIndex: theme => theme.zIndex.appBar - 1
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Conteúdo principal */}
        <Box component="main" sx={{ flexGrow: 1, width: '100%', p: { xs: 2, md: 3 } }}>
          {/* Componente principal baseado na seção ativa */}
          {activeSection === 'plano' && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Plano de Contratação Anual
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Visão geral das contratações e status do sistema
                </Typography>
              </Box>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                  <StatsCard>
                    <CardContent>
                      <Typography variant="overline" color="text.secondary" gutterBottom>
                        Total de Contratações
                      </Typography>
                      <Typography variant="h3" fontWeight="bold" color="primary">
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Contratações registradas no sistema
                      </Typography>
                    </CardContent>
                  </StatsCard>
                </Grid>
                
                <Grid item xs={12} sm={6} lg={3}>
                  <StatsCard>
                    <CardContent>
                      <Typography variant="overline" color="text.secondary" gutterBottom>
                        Contratações Aprovadas
                      </Typography>
                      <Typography variant="h3" fontWeight="bold" color="success.main">
                        {stats.aprovadas}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round((stats.aprovadas / stats.total) * 100) || 0}% do total
                      </Typography>
                    </CardContent>
                  </StatsCard>
                </Grid>
                
                <Grid item xs={12} sm={6} lg={3}>
                  <StatsCard>
                    <CardContent>
                      <Typography variant="overline" color="text.secondary" gutterBottom>
                        Em Análise
                      </Typography>
                      <Typography variant="h3" fontWeight="bold" color="info.main">
                        {stats.emAnalise}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Aguardando revisão e aprovação
                      </Typography>
                    </CardContent>
                  </StatsCard>
                </Grid>
                
                <Grid item xs={12} sm={6} lg={3}>
                  <StatsCard>
                    <CardContent>
                      <Typography variant="overline" color="text.secondary" gutterBottom>
                        Valor Total
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="text.primary">
                        {formatarMoeda(stats.valorTotal)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Soma de todas as contratações
                      </Typography>
                    </CardContent>
                  </StatsCard>
                </Grid>
              </Grid>
              
              <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Contratações Recentes
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Número</TableCell>
                        <TableCell>Título</TableCell>
                        <TableCell>Valor Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredContratacoes.slice(0, 5).map((contratacao) => (
                        <TableRow key={contratacao.id}>
                          <TableCell>{contratacao.numero_contratacao || '-'}</TableCell>
                          <TableCell>{contratacao.titulo || '-'}</TableCell>
                          <TableCell>
                            {contratacao.valor_total ? formatarMoeda(contratacao.valor_total) : '-'}
                          </TableCell>
                          <TableCell>
                            {contratacao.status_contratacao ? (
                              <StatusBadge 
                                label={contratacao.status_contratacao}
                                status={contratacao.status_contratacao}
                                size="small"
                              />
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => handleOpenDetails(contratacao)}
                            >
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button 
                    variant="text" 
                    color="primary"
                    onClick={() => setActiveSection('contratacoes')}
                  >
                    Ver todas
                  </Button>
                </Box>
              </Paper>
              
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => setActiveSection('importar')}
                  sx={{ px: 3, py: 1 }}
                >
                  Importar Planilha PCA
                </Button>
              </Box>
            </>
          )}
          
          {activeSection === 'importar' && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Importar Planilha PCA
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Carregue a planilha do Plano de Contratação Anual para atualizar o sistema
                </Typography>
              </Box>
              
              <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                <UploadArea>
                  <input
                    accept=".xlsx,.xls,.csv"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                    <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      {file ? file.name : 'Clique para selecionar um arquivo'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Formatos aceitos: .xlsx, .xls, .csv
                    </Typography>
                  </label>
                </UploadArea>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!file || isUploading}
                    onClick={handleUpload}
                    startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {isUploading ? 'Processando...' : 'Importar Dados'}
                  </Button>
                </Box>
                
                {uploadResult && (
                  <Alert 
                    severity={uploadResult.success ? "success" : "error"}
                    sx={{ mt: 3 }}
                    variant="filled"
                  >
                    {uploadResult.message}
                    {uploadResult.success && uploadResult.data && (
                      <Box sx={{ mt: 1, fontSize: '0.9em' }}>
                        <div>Registros processados: {uploadResult.data.registros_processados}</div>
                        <div>Contratações criadas: {uploadResult.data.contratacoes_criadas}</div>
                        <div>Contratações atualizadas: {uploadResult.data.contratacoes_atualizadas}</div>
                      </Box>
                    )}
                  </Alert>
                )}
                
                <Box sx={{ 
                  mt: 4, 
                  p: 3, 
                  bgcolor: 'info.50', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'info.200'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <InfoIcon color="info" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Dicas para importação
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • Verifique se a planilha segue o formato padrão PCA
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • Certifique-se de que todos os valores monetários estão formatados corretamente
                      </Typography>
                      <Typography variant="body2">
                        • Em caso de erros, revise o formato das datas (DD/MM/AAAA) e números decimais
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </>
          )}
          
          {activeSection === 'contratacoes' && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Contratações Cadastradas
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Visualize e gerencie todas as contratações registradas no sistema
                </Typography>
              </Box>
              
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                {/* Barra de pesquisa rápida e filtros básicos */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    placeholder="Busca rápida por título, número ou área..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: '250px' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <FormControl sx={{ minWidth: '200px' }} size="small">
                    <InputLabel id="status-filter-label">Filtrar por Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={statusFilter}
                      label="Filtrar por Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Aprovada">Aprovada</MenuItem>
                      <MenuItem value="Pendente">Pendente</MenuItem>
                      <MenuItem value="Em análise">Em análise</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={toggleAdvancedFilters}
                    startIcon={showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {showAdvancedFilters ? "Ocultar Filtros" : "Filtros Avançados"}
                  </Button>

                  <Button 
                    variant="outlined" 
                    startIcon={<RefreshIcon />}
                    onClick={fetchContratacoes}
                    disabled={loading}
                  >
                    Atualizar
                  </Button>
                </Box>
                
                {/* Filtros avançados */}
                <Collapse in={showAdvancedFilters}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mb: 3, 
                      bgcolor: 'background.default',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FilterListIcon fontSize="small" /> Busca Avançada
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Número do DFD"
                          variant="outlined"
                          size="small"
                          value={dfdFilter}
                          onChange={(e) => setDfdFilter(e.target.value)}
                          placeholder="Ex: DFD-2025-0001"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Objeto/Descrição"
                          variant="outlined"
                          size="small"
                          value={objectFilter}
                          onChange={(e) => setObjectFilter(e.target.value)}
                          placeholder="Buscar palavras-chave no objeto"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                          <Button 
                            size="small" 
                            onClick={clearAllFilters}
                          >
                            Limpar Filtros
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="primary"
                            onClick={() => setPage(0)} // Resetar para primeira página ao aplicar filtros
                          >
                            Aplicar Filtros
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Collapse>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Número</TableCell>
                            <TableCell>Título</TableCell>
                            <TableCell>Área Requisitante</TableCell>
                            <TableCell>Início Estimado</TableCell>
                            <TableCell>Conclusão Estimada</TableCell>
                            <TableCell>Valor Total (R$)</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedContratacoes.length > 0 ? (
                            paginatedContratacoes.map((contratacao) => (
                              <TableRow key={contratacao.id}>
                                <TableCell>{contratacao.numero_contratacao || '-'}</TableCell>
                                <TableCell>{contratacao.titulo || '-'}</TableCell>
                                <TableCell>{contratacao.area_requisitante || '-'}</TableCell>
                                <TableCell>{formatarDataExibicao(contratacao.data_inicio_estimada)}</TableCell>
                                <TableCell>{formatarDataExibicao(contratacao.data_conclusao_estimada)}</TableCell>
                                <TableCell>
                                  {contratacao.valor_total ? formatarMoeda(contratacao.valor_total) : '-'}
                                </TableCell>
                                <TableCell>
                                  {contratacao.status_contratacao ? (
                                    <StatusBadge 
                                      label={contratacao.status_contratacao}
                                      status={contratacao.status_contratacao}
                                      size="small"
                                    />
                                  ) : '-'}
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="small" 
                                    variant="outlined"
                                    onClick={() => handleOpenDetails(contratacao)}
                                  >
                                    Detalhes
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} align="center">
                                <Typography variant="body1" sx={{ py: 3 }}>
                                  {filteredContratacoes.length === 0 
                                    ? "Nenhuma contratação encontrada. Importe uma planilha PCA para começar."
                                    : "Nenhuma contratação corresponde aos filtros aplicados."}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {/* Componente de Paginação */}
                    <TablePagination
                      component="div"
                      count={filteredContratacoes.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      labelRowsPerPage="Itens por página:"
                      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    />
                  </>
                )}
              </Paper>
            </>
          )}
          
          {activeSection === 'relatorios' && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Relatórios
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Visualize e exporte relatórios sobre as contratações
                </Typography>
              </Box>
              
              <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  Módulo de relatórios em desenvolvimento
                </Typography>
                <Button variant="contained" disabled>
                  Em breve
                </Button>
              </Paper>
            </>
          )}
        </Box>
      </Box>
      
      {/* Modal de Detalhes da Contratação */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedContratacao && (
          <>
            <DialogTitle sx={{ 
              pb: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }}>
              <Box>
                <Typography variant="h6" component="div">
                  Detalhes da Contratação
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {selectedContratacao.numero_contratacao || 'Sem número'}
                </Typography>
              </Box>
              <IconButton edge="end" color="inherit" onClick={handleCloseDetails}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ pb: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {selectedContratacao.titulo || 'Sem título'}
                </Typography>
                <Chip 
                  label={selectedContratacao.status_contratacao || 'Sem status'} 
                  color={
                    selectedContratacao.status_contratacao === 'Aprovada' ? 'success' :
                    selectedContratacao.status_contratacao === 'Em análise' ? 'info' :
                    selectedContratacao.status_contratacao === 'Pendente' ? 'warning' : 'default'
                  }
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionOutlinedIcon fontSize="small" color="primary" /> Informações Gerais
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Tipo de Contratação
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.tipo_contratacao || 'Não especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Modalidade
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.modalidade || 'Não especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Objeto
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.objeto || 'Não especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Número do DFD
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.numero_dfd || 'Não especificado'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon fontSize="small" color="primary" /> Informações Financeiras
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Valor Total
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" gutterBottom>
                            {selectedContratacao.valor_total ? formatarMoeda(selectedContratacao.valor_total) : 'Não especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Fonte de Recursos
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.fonte_recursos || 'Não especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Valor Empenhado
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.valor_empenhado ? formatarMoeda(selectedContratacao.valor_empenhado) : 'Não especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Natureza da Despesa
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.natureza_despesa || 'Não especificado'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="primary" /> Cronograma
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Data de Início Estimada
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatarDataExibicao(selectedContratacao.data_inicio_estimada)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Data de Conclusão Estimada
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatarDataExibicao(selectedContratacao.data_conclusao_estimada)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Data de Contratação
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatarDataExibicao(selectedContratacao.data_contratacao)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Vigência do Contrato
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.vigencia_contrato || 'Não especificado'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="primary" /> Unidades e Responsáveis
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Área Requisitante
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.area_requisitante || 'Não especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Unidade Gestora
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.unidade_gestora || 'Não especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Responsável Técnico
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.responsavel_tecnico || 'Não especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Gestor do Contrato
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedContratacao.gestor_contrato || 'Não especificado'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                {selectedContratacao.observacoes && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InfoIcon fontSize="small" color="primary" /> Observações
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1">
                          {selectedContratacao.observacoes}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleCloseDetails} color="primary">
                Fechar
              </Button>
              {selectedContratacao.status_contratacao !== 'Aprovada' && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleCloseDetails}
                >
                  Editar Contratação
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default DiplanDashboard;