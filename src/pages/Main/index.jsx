import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid2 as Grid,
  Box,
  TextField,
  CircularProgress,
  Drawer,
} from '@mui/material';
import {
  AccountCircle,
  Notifications,
  Settings,
  ExitToApp,
  ArrowLeft,
  ArrowRight,
  CalendarMonth,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import Login from '../Login';
import CalendarPage from '../Calendar';
import { useDispatch, useSelector } from 'react-redux';
import UsersPage from '../Users';
import { FaUser } from 'react-icons/fa';
import ProfilesPage from '../Profiles';
import { AiFillProfile } from 'react-icons/ai';
import * as auth_actions from '../../store/modules/authReducer/actions';
import * as generic_actions from '../../store/modules/genericReducer/actions';
import hasPermission from '../../services/has_permission';

// Estilos personalizados
const StyledAppBar = styled(AppBar)(({ theme, expanded, isMobile }) => ({
  width: isMobile === "true" ? '100%' : expanded === "true" ? 250 : 64,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  backgroundColor: theme.palette.secondary.main,
  boxShadow: theme.shadows[2],
  zIndex: theme.zIndex.drawer + 1,
  left: 0,
  height: isMobile === "true" ? 'auto' : '100%', // Altura automática em dispositivos móveis
}));

const StyledToolbar = styled(Toolbar)(({ theme, isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile === "true" ? 'row' : 'column', // Linha em dispositivos móveis, coluna em desktop
  alignItems: isMobile === "true" ? "flex-end":'center',
  padding: theme.spacing(2),
  minHeight: '64px !important',
  justifyContent: isMobile === "true" ? 'space-between' : 'center', // Espaço entre os itens em dispositivos móveis
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginBottom: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const MenuOptions = styled(List)(({ theme }) => ({
  width: '100%',
  paddingTop: 0,
}));

const MenuItem = styled(ListItem)(({ theme, expanded }) => ({
  justifyContent: expanded === "true" ? 'initial' : 'center',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiTypography-root': {
    fontSize: '0.9rem',
  },
  '& a': {
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  textAlign: 'center'
}));

const MenuItemIcon = styled(ListItemIcon)(({ theme, expanded }) => ({
  minWidth: 0,
  marginRight: expanded === "true" ? theme.spacing(2) : 'auto',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const MenuItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: theme.typography.fontWeightMedium,
}));

const AppContainer = styled(Grid)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  backgroundColor: theme.palette.background.default,
  overflowX: 'hidden' // Evitar barra de rolagem horizontal
}));

const Content = styled(Box)(({ theme, expanded, isMobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: isMobile === "true" ? 0 : expanded === "true" ? 250 : 64, // Sem margem esquerda em dispositivos móveis
  marginTop: isMobile === "true" ? 56 : 64, // Margem superior ajustada para dispositivos móveis
  backgroundColor: theme.palette.background.default,
}));

const NotificationsPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    width: 380,
    maxHeight: 400,
    overflow: 'auto',
  },
}));

const NotificationsList = styled(List)(({ theme }) => ({
  padding: 0,
}));

const NotificationItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  color: theme.palette.text.third
}));

const NotificationText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.third
  },
  '& .MuiListItemText-secondary': {
    fontSize: '0.8rem',
    color: theme.palette.text.third,
  },
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiInput-root': {
    color: theme.palette.text.third,
    borderColor: theme.palette.primary.contrastText,
    padding: theme.spacing(1),
    '&:before': {
      borderColor: theme.palette.primary.contrastText,
    },
    '&:hover:not(.Mui-disabled):before': {
      borderColor: theme.palette.primary.main,
    },
    '&:after': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.third,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.third,
  },
}));

const LoadingMore = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 250,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 250,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.secondary.main, // Cor de fundo do menu
    color: theme.palette.text.primary, // Cor do texto do menu
  },
}));

function Home() {
  const user = useSelector((state) => state.authreducer);
  const generics = useSelector((state) => state.genericreducer?.generics);
  const [expanded, setExpanded] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const observer = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (!isMobile) {
      setExpanded(!expanded);
    } else {
      setIsDrawerOpen(!isDrawerOpen);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
    setSearchText('');
    setSkip(0);
    setNotifications([]);
    setHasMore(true);
    setIsLoading(false);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate('/login');
    }
  }, [user, navigate]);

  const lastNotificationRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip((prevSkip) => prevSkip + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setSkip(0);
    setNotifications([]);
    setHasMore(true);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (anchorElNotifications && hasMore) {
        setIsLoading(true);
        dispatch(
          generic_actions.GENERICS_REQUEST({
            skip: skip,
            limit: 10,
            filters: `message+ct+${searchText}`,
            model: 'Notification',
          })
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, [anchorElNotifications, skip, searchText]);

  useEffect(() => {
    if (generics && generics['Notification']) {
      const newNotifications = generics['Notification'].map((notification) => ({
        ...notification.values,
        id: notification.id
      }));
      const uniqueNotifications = [
        ...notifications,
        ...newNotifications.filter(
          (newNot) => !notifications.some((not) => not.id === newNot.id)
        ),
      ];
      uniqueNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotifications(uniqueNotifications);
      setHasMore(generics['Notification'].length === 10);
    }
  }, [generics]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
      if(window.innerWidth < 600){
        setIsDrawerOpen(false);
        setExpanded(false);
      }
      if (window.innerWidth >= 600) {
        setIsDrawerOpen(false); // Fechar a drawer se a tela voltar a ser maior que 600px
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <AppContainer container={true}>
      {!user.isLoggedIn ? null : (
        <>
          {/* Drawer (Menu Lateral para Mobile) */}
          <StyledDrawer
            variant="temporary"
            open={isDrawerOpen}
            onClose={handleToggleSidebar}
            ModalProps={{
              keepMounted: true, // Melhor desempenho em mobile
            }}
          >
            <StyledToolbar ismobile={isMobile.toString()}>
              <IconButton
                color="inherit"
                aria-label="close drawer"
                onClick={handleToggleSidebar}
                edge="start"
                sx={{ alignSelf: 'flex-end', width: 40, marginBottom: 2 }}
              >
                <ArrowLeft />
              </IconButton>
              <StyledAvatar alt="User Name" />
              <Typography variant="h6" noWrap color="text.primary">
                {user.user.name}
              </Typography>
            </StyledToolbar>

            {/* Conteúdo do Drawer (MenuOptions) */}
            <MenuOptions>
              <MenuItem
                button={"true"}
                expanded="true"
                component={RouterLink}
                to="/calendar"
                disableripple={"true"}
                onClick={handleToggleSidebar} // Fechar o menu ao clicar
              >
                <MenuItemIcon expanded="true">
                  <CalendarMonth />
                </MenuItemIcon>
                <MenuItemText primary="Calendario" />
              </MenuItem>
              {hasPermission(user.user.profile, 'Usuários', 'can_view') ? (
                <MenuItem
                  button={"true"}
                  expanded="true"
                  component={RouterLink}
                  to="/users"
                  disableripple={"true"}
                  onClick={handleToggleSidebar}
                >
                  <MenuItemIcon expanded="true">
                    <FaUser />
                  </MenuItemIcon>
                  <MenuItemText primary="Usuários" />
                </MenuItem>
              ) : null}
              {hasPermission(user.user.profile, 'perfís', 'can_view') ? (
                <MenuItem
                  button="true"
                  expanded="true"
                  component={RouterLink}
                  to="/profiles"
                  disableripple={"true"}
                  onClick={handleToggleSidebar}
                >
                  <MenuItemIcon expanded="true">
                    <AiFillProfile />
                  </MenuItemIcon>
                  <MenuItemText primary="Perfís" />
                </MenuItem>
              ) : null}
            </MenuOptions>
          </StyledDrawer>

          {/* AppBar (Principalmente para Desktop) */}
          <StyledAppBar
            position="fixed"
            expanded={expanded.toString()}
            ismobile={isMobile.toString()}
          >
            <StyledToolbar ismobile={isMobile.toString()}>
              {/* Botão do Menu Hamburguer para Mobile */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleToggleSidebar}
                  edge="start"
                  sx={{ marginRight: 2, width: 40, margin: 'auto', alignSelf: 'center' }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Estrutura para Desktop */}
              {!isMobile && (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleToggleSidebar}
                    edge="start"
                    sx={{ alignSelf: 'flex-end', width: 40, marginBottom: 1 }}
                  >
                    {expanded ? <ArrowLeft /> : <ArrowRight />}
                  </IconButton>
                  <StyledAvatar alt="User Name" />
                  {expanded && (
                    <Typography variant="h6" noWrap color="text.primary">
                      {user.user.name}
                    </Typography>
                  )}
                </>
              )}

              <Grid
                container
                justifyContent={isMobile ? 'flex-end' : 'center'}
                spacing={1}
                sx={{ mt: isMobile ? 0 : 2, mb: isMobile ? 0 : 2, flexGrow: 1 }}
              >
                <Grid item={"true"}>
                  <Tooltip title="Open user menu" arrow>
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0, width: 40 }}
                    >
                      <AccountCircle color="primary" fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Popover
                    open={Boolean(anchorElUser)}
                    anchorEl={anchorElUser}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <List>
                      <ListItem button onClick={handleCloseUserMenu} disableripple={"true"}>
                        <ListItemIcon>
                          <Settings color="primary" />
                        </ListItemIcon>
                        <ListItemText style={{ color: 'black' }} primary="Settings" />
                      </ListItem>
                      <ListItem
                        button="true"
                        onClick={() => {
                          handleCloseUserMenu();
                          dispatch(auth_actions.Loguot());
                        }}
                        disableripple={"true"}
                      >
                        <ListItemIcon>
                          <ExitToApp color="primary" />
                        </ListItemIcon>
                        <ListItemText style={{ color: 'black' }} primary="Logout" />
                      </ListItem>
                    </List>
                  </Popover>
                </Grid>
                <Grid item={"true"}>
                  <Tooltip title="Notifications" arrow>
                    <IconButton
                      onClick={handleOpenNotifications}
                      sx={{ p: 0, width: 40 }}
                    >
                      <Notifications color="primary" fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <NotificationsPopover
                    open={Boolean(anchorElNotifications)}
                    anchorEl={anchorElNotifications}
                    onClose={handleCloseNotifications}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <SearchInput
                      placeholder="Pesquisar notificações..."
                      value={searchText}
                      onChange={handleSearchChange}
                      fullWidth
                      variant="standard"
                    />
                    <NotificationsList>
                      {notifications.map((notification, index) => {
                        if (notifications.length === index + 1) {
                          return (
                            <NotificationItem
                              ref={lastNotificationRef}
                              key={notification.id}
                            >
                              <NotificationText
                                primary={notification.message}
                                secondary={new Date(
                                  notification.date
                                ).toLocaleString()}
                              />
                            </NotificationItem>
                          );
                        } else {
                          return (
                            <NotificationItem key={notification.id}>
                              <NotificationText
                                primary={notification.message}
                                secondary={new Date(
                                  notification.date
                                ).toLocaleString()}
                              />
                            </NotificationItem>
                          );
                        }
                      })}
                      {isLoading && (
                        <LoadingMore>
                          <CircularProgress size={24} />
                        </LoadingMore>
                      )}
                      {!isLoading && notifications.length === 0 && (
                        <NotificationItem>
                          <NotificationText primary="Nenhuma notificação encontrada." />
                        </NotificationItem>
                      )}
                    </NotificationsList>
                  </NotificationsPopover>
                </Grid>
              </Grid>

              {/* Condicional para o Divider e MenuOptions */}
              {!isMobile && (
                <>
                  <Divider
                    sx={{
                      my: 2,
                      width: '80%',
                      borderColor: 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <MenuOptions>
                    <MenuItem
                      button="true"
                      expanded={expanded.toString()}
                      component={RouterLink}
                      to="/calendar"
                      disableripple={"true"}
                    >
                      <MenuItemIcon expanded={expanded.toString()}>
                        <CalendarMonth />
                      </MenuItemIcon>
                      {expanded && <MenuItemText primary="Calendario" />}
                    </MenuItem>
                    {hasPermission(user.user.profile, 'Usuários', 'can_view') && (
                      <MenuItem
                        button="true"
                        expanded={expanded.toString()}
                        component={RouterLink}
                        to="/users"
                        disableripple={"true"}
                      >
                        <MenuItemIcon expanded={expanded.toString()}>
                          <FaUser />
                        </MenuItemIcon>
                        {expanded && <MenuItemText primary="Usuários" />}
                      </MenuItem>
                    )}
                    {hasPermission(user.user.profile, 'perfís', 'can_view') && (
                      <MenuItem
                        button="true"
                        expanded={expanded.toString()}
                        component={RouterLink}
                        to="/profiles"
                        disableripple={"true"}
                      >
                        <MenuItemIcon expanded={expanded.toString()}>
                          <AiFillProfile />
                        </MenuItemIcon>
                        {expanded && <MenuItemText primary="Perfís" />}
                      </MenuItem>
                    )}
                  </MenuOptions>
                </>
              )}
            </StyledToolbar>
          </StyledAppBar>
        </>
      )}

      <Content expanded={expanded.toString()} ismobile={isMobile.toString()}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<CalendarPage />} />
          {hasPermission(user.user.profile, 'Usuários', 'can_view') && (
            <Route path="/users" element={<UsersPage />} />
          )}
          {hasPermission(user.user.profile, 'perfís', 'can_view') && (
            <Route path="/profiles" element={<ProfilesPage />} />
          )}
        </Routes>
      </Content>
    </AppContainer>
  );
}

export default Home;
