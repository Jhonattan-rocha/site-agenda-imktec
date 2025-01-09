import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function NoPage(){
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: '#ff6f61' }}>
          404
        </Typography>
        <Typography variant="h6" sx={{ marginTop: '16px', color: '#555' }}>
          Oops! A página que você está procurando não foi encontrada.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<FaHome />}
          onClick={handleGoHome}
          sx={{ marginTop: '24px', padding: '10px 24px', borderRadius: '8px', width: 300 }}
        >
          Voltar para Home
        </Button>
      </Box>
    </Container>
  );
};

export default NoPage;
