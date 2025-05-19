import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Importações de páginas
import AreaSelection from './pages/auth/AreaSelection';
import DiplanDashboard from './pages/diplan/Dashboard';
import DipliDashboard from './pages/dipli/Dashboard';
import NotFound from './pages/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Redirecionar a raiz para a seleção de área */}
          <Route path="/" element={<Navigate to="/area-selection" replace />} />
          
          {/* Rotas principais */}
          <Route path="/area-selection" element={<AreaSelection />} />
          <Route path="/diplan/*" element={<DiplanDashboard />} />
          <Route path="/dipli/*" element={<DipliDashboard />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;