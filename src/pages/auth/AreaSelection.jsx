import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AreaSelection() {
  const navigate = useNavigate();

  // Estilo comum para ambos os cards
  const cardStyle = {
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
    margin: '0 16px 32px',
    backgroundColor: '#fff',
    verticalAlign: 'top',  // Crucial para alinhamento igual
  };

  // Estilo para os cabeçalhos
  const headerStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'white',
    height: '160px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  };

  // Estilo para a seção de conteúdo
  const contentStyle = {
    padding: '24px',
    height: '180px',  // Altura fixa igual para o conteúdo
    boxSizing: 'border-box',
  };

  // Estilo para a seção de botão
  const footerStyle = {
    padding: '24px',
    textAlign: 'center',
    borderTop: '1px solid #eee',
    boxSizing: 'border-box',
  };

  // Estilo para os botões
  const buttonStyle = {
    padding: '10px 24px',
    borderRadius: '4px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    textTransform: 'uppercase',
    fontSize: '14px',
  };

  return (
    <Box style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '40px 0',
      boxSizing: 'border-box',
    }}>
      <Container>
        {/* Cabeçalho da página */}
        <Box style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Typography variant="h3" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
            Selecione sua Área de Trabalho
          </Typography>
          <Typography variant="h6" style={{ color: '#666', marginBottom: '24px' }}>
            Escolha a área que deseja acessar e gerencie contratações, processos e planejamentos
          </Typography>
          <div style={{ 
            width: '100px', 
            height: '2px', 
            backgroundColor: '#ddd', 
            margin: '0 auto', 
            marginTop: '24px' 
          }}></div>
        </Box>

        {/* Contêiner centralizado para os cards */}
        <Box style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          margin: '0 -16px',  // Compensar margem dos cards
        }}>
          {/* DIPLAN CARD */}
          <div style={cardStyle}>
            {/* Cabeçalho do card */}
            <div style={{...headerStyle, backgroundColor: '#1976d2'}}>
              {/* Ícone simples */}
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                📊
              </div>
              <Typography variant="h4" style={{ fontWeight: 'bold', margin: 0 }}>
                DIPLAN
              </Typography>
              <Typography variant="subtitle1" style={{ margin: 0 }}>
                Diretoria de Planejamento
              </Typography>
            </div>
            
            {/* Conteúdo do card */}
            <div style={contentStyle}>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                Funções Principais:
              </Typography>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <Typography variant="body1">
                    Gerenciamento do Plano de Contratação Anual (PCA)
                  </Typography>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Typography variant="body1">
                    Acompanhamento de contratações e processos
                  </Typography>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Typography variant="body1">
                    Upload e processamento da planilha PCA
                  </Typography>
                </li>
              </ul>
            </div>
            
            {/* Rodapé do card */}
            <div style={footerStyle}>
              <button 
                onClick={() => navigate('/diplan')}
                style={{...buttonStyle, backgroundColor: '#1976d2'}}
              >
                ACESSAR DIPLAN
              </button>
            </div>
          </div>

          {/* DIPLI CARD */}
          <div style={cardStyle}>
            {/* Cabeçalho do card */}
            <div style={{...headerStyle, backgroundColor: '#e91e63'}}>
              {/* Ícone simples */}
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                🏢
              </div>
              <Typography variant="h4" style={{ fontWeight: 'bold', margin: 0 }}>
                DIPLI
              </Typography>
              <Typography variant="subtitle1" style={{ margin: 0 }}>
                Diretoria de Planejamento Interno
              </Typography>
            </div>
            
            {/* Conteúdo do card */}
            <div style={contentStyle}>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                Funções Principais:
              </Typography>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <Typography variant="body1">
                    Controle e acompanhamento de licitações
                  </Typography>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Typography variant="body1">
                    Gestão de documentos e processos internos
                  </Typography>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Typography variant="body1">
                    Fluxo de aprovações e revisões
                  </Typography>
                </li>
              </ul>
            </div>
            
            {/* Rodapé do card */}
            <div style={footerStyle}>
              <button 
                onClick={() => navigate('/dipli')}
                style={{...buttonStyle, backgroundColor: '#e91e63'}}
              >
                ACESSAR DIPLI
              </button>
            </div>
          </div>
        </Box>
      </Container>
      
      {/* Rodapé da página */}
      <Box style={{ 
        marginTop: '40px', 
        padding: '16px',
        backgroundColor: '#e8eaed',
        textAlign: 'center',
      }}>
        <Typography variant="body2" style={{ color: '#666' }}>
          © {new Date().getFullYear()} Sistema de Gerenciamento de Contratações | Todos os direitos reservados
        </Typography>
      </Box>
    </Box>
  );
}

export default AreaSelection;