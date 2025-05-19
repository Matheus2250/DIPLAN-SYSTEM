import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AreaSelection() {
  const navigate = useNavigate();

  // Estilo comum para ambos os cards - MESMO TAMANHO GARANTIDO
  const cardStyle = {
    width: '100%',
    maxWidth: '400px',
    height: '300px', // Altura fixa para garantir mesmo tamanho (reduzida pela remoção da seção)
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
    margin: '0 16px 32px',
    backgroundColor: '#fff',
    verticalAlign: 'top',
  };

  // Estilo para os cabeçalhos
  const headerStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'white',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  };

  // Estilo para a seção de botão
  const footerStyle = {
    padding: '24px',
    textAlign: 'center',
    borderTop: '1px solid #eee',
    boxSizing: 'border-box',
    height: '100px',  // Altura fixa para o rodapé
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
    height: '40px',
    width: '100%',
    maxWidth: '250px',
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
          margin: '0 -16px',
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
              <Typography variant="subtitle1" style={{ margin: 0, padding: '0 20px' }}>
                Divisão de Planejamento e Dados das Contratações Administrativas
              </Typography>
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
              <Typography variant="subtitle1" style={{ margin: 0, padding: '0 20px' }}>
                Divisão de Procedimentos Licitatórios
              </Typography>
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