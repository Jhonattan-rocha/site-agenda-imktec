import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress
} from '@mui/material';
import { FaUser } from 'react-icons/fa';
import { MdPassword } from 'react-icons/md';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/modules/authReducer/actions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

// Componente estilizado para o Paper
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.secondary.main, // Cor de fundo do seu tema
  color: theme.palette.primary.contrastText, // Cor do texto do seu tema
  borderRadius: theme.shape.borderRadius,
  minWidth: 300,
  alignSelf: 'flex-tart',
}));

// Componente estilizado para o TextField
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.primary.contrastText,
    '& fieldset': {
      borderColor: theme.palette.primary.contrastText,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.secondary,
  }
}));

// Componente estilizado para o Button
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.authreducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      toast.error('Email ou senha não podem ser vazios');
      return;
    }
    setIsLoading(true);
    try {
      dispatch(actions.Login({ username, password })); // Aguarda a conclusão do login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false); 
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLogin();
    }
  };

  useEffect(() => {
    if(user.isLoggedIn){
      navigate('/calendar');
    }
  }, [user, navigate]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: 'background.default',
      }}
    >
      <StyledPaper elevation={6}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <StyledTextField
            label="Usuário"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser />
                  </InputAdornment>
                ),
              }
            }}
          />
          <StyledTextField
            label="Senha"
            variant="outlined"
            fullWidth
            type={type}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MdPassword />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      style={{ width: 40 }}
                      onClick={() =>
                        setType(type === 'password' ? 'text' : 'password')
                      }
                      edge="end"
                    >
                      {type === 'password' ? (
                        <AiOutlineEye />
                      ) : (
                        <AiOutlineEyeInvisible />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
          />
          <Typography align="center" sx={{ cursor: 'pointer', textDecoration: 'underline', mt: 1, color: 'text.secondary' }}>
            Esqueci minha senha
          </Typography>
          <StyledButton
            variant="contained"
            fullWidth
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </StyledButton>
        </Box>
      </StyledPaper>
    </Container>
  );
}

export default Login;