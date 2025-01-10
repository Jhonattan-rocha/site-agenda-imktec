import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo } from 'react';

export const useTheme = () => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#1fa99e', // Azul Turquesa
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#0d373e', // Azul Escuro
            contrastText: '#ffffff',
          },
          background: {
            default: '#0d373e', // Azul Escuro como fundo padrão
            paper: '#ffffff',
          },
          text: {
            primary: '#ffffff', // Branco para textos principais
            secondary: '#b5adad', // Cinza Claro para textos secundários
            third: '#000000'
          },
          custom: {
            chatIcon: '#36454F', // Cinza Escuro para o ícone de chat
          },
          error: {
            main: '#f44336', // Vermelho para erros
          },
          warning: {
            main: '#ff9800', // Laranja para avisos
          },
          info: {
            main: '#2196f3', // Azul para informações
          },
          success: {
            main: '#4caf50', // Verde para sucesso
          },
        },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
          h1: {
            fontWeight: 600,
            fontSize: '2.5rem',
          },
          h2: {
            fontWeight: 500,
            fontSize: '2rem',
          },
          h3: {
            fontWeight: 500,
            fontSize: '1.75rem',
          },
          h4: {
            fontWeight: 500,
            fontSize: '1.5rem',
          },
          h5: {
            fontWeight: 500,
            fontSize: '1.25rem',
          },
          h6: {
            fontWeight: 500,
            fontSize: '1rem',
          },
          subtitle1: {
            fontSize: '1rem',
            fontWeight: 400,
          },
          subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          body1: {
            fontSize: '1rem',
            fontWeight: 400,
          },
          body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
          },
          button: {
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none',
          },
          caption: {
            fontSize: '0.75rem',
            fontWeight: 400,
          },
          overline: {
            fontSize: '0.75rem',
            fontWeight: 400,
            textTransform: 'uppercase',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: "0.8em"
                }
            }
          },
        },
        // Outras personalizações
        shape: {
          borderRadius: 8, // Bordas arredondadas
        },
        spacing: 8, // Espaçamento base (8px)
        transitions: {
          easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
          },
          duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
          },
        },
      }),
    []
  );

  return theme;
};

export const AppThemeProvider = ({ children }) => {
  const theme = useTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};