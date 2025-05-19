import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Paper,
  Tabs,
  Tab,
  Button,
  Grid
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

function DipliDashboard() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Box sx={{ backgroundColor: 'secondary.main', color: 'white', py: 2 }}>
        <Container>
          <Typography variant="h4">DIPLI - Dashboard</Typography>
          <Typography variant="subtitle1">
            Diretoria de Planejamento Interno
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mt: 4 }}>
        <Paper sx={{ mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            centered
          >
            <Tab label="Visão Geral" />
            <Tab label="Licitações" />
            <Tab label="Documentos" />
            <Tab label="Relatórios" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Licitações</Typography>
                <Typography variant="h3" color="secondary">24</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total de licitações ativas
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Em andamento</Typography>
                <Typography variant="h3" color="secondary">12</Typography>
                <Typography variant="body2" color="textSecondary">
                  Licitações em processamento
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Valor Total</Typography>
                <Typography variant="h3" color="secondary">R$ 850K</Typography>
                <Typography variant="body2" color="textSecondary">
                  Orçamento em licitações
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Documentos Pendentes</Typography>
                <Typography variant="h3" color="error">8</Typography>
                <Typography variant="body2" color="textSecondary">
                  Documentos aguardando revisão
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tabValue === 2 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Gestão de Documentos
            </Typography>
            <Typography variant="body1" paragraph>
              Acesse e gerencie os documentos relacionados às licitações.
            </Typography>
            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 5, 
                mb: 3,
                backgroundColor: '#fafafa',
              }}
            >
              <DescriptionIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nenhum documento recente
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Selecione "Ver Todos" para acessar o repositório de documentos
              </Typography>
            </Box>
            <Button variant="contained" color="secondary" size="large">
              Ver Todos os Documentos
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default DipliDashboard;