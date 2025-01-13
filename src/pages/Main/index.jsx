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
  CircularProgress
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
import { padding, styled } from '@mui/system';
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom'; // Importe as dependências necessárias
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

// Estilos personalizados (mantidos do exemplo anterior)
const StyledAppBar = styled(AppBar)(({ theme, expanded }) => ({
  width: expanded === "true" ? 250 : 64,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  backgroundColor: theme.palette.secondary.main,
  boxShadow: theme.shadows[2],
  zIndex: theme.zIndex.drawer + 1,
  left: 0,
  height: '100%',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  minHeight: '64px !important',
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
  // Estilos para o link dentro do MenuItem
  '& .MuiTypography-root': {
      fontSize: '0.9rem',
  },
  '& a': {
    textDecoration: 'none', // Remove o sublinhado
    color: 'inherit', // Herda a cor do pai (ListItem)
    width: '100%', // Ocupa toda a largura disponível
    display: 'flex', // Para alinhar ícone e texto
    alignItems: 'center', // Alinha verticalmente ao centro
  }
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
}));

const Content = styled(Box)(({ theme, expanded }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: expanded === "true" ? 250 : 64,
  marginTop: 64,
  backgroundColor: theme.palette.background.default,
}));

const NotificationsPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    width: 380,
    maxHeight: 400, // Aumentei a altura máxima
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
    color: theme.palette.text.third, // Cor do texto digitado
    borderColor: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    '&:before': {
      borderColor: theme.palette.primary.contrastText, // Cor da linha antes de focar
    },
    '&:hover:not(.Mui-disabled):before': {
      borderColor: theme.palette.primary.main, // Cor da linha no hover
    },
    '&:after': {
      borderColor: theme.palette.primary.main, // Cor da linha ao focar
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

  const handleToggleSidebar = () => {
    setExpanded(!expanded);
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
        await dispatch(
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

  return (
    <AppContainer container={true}>
      {!user.isLoggedIn ? null : (
        <StyledAppBar
          position="fixed"
          expanded={(() => (expanded ? 'true' : 'false'))()}
        >
          <StyledToolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleToggleSidebar}
              edge="start"
              sx={{ alignSelf: 'flex-end', width: 40, marginBottom: 2 }}
            >
              {expanded ? <ArrowLeft /> : <ArrowRight />}
            </IconButton>
            <StyledAvatar alt="User Name" />
            {expanded && (
              <Typography variant="h6" noWrap color="text.primary">
                {user.user.name}
              </Typography>
            )}

            <Grid
              container
              justifyContent="center"
              spacing={1}
              sx={{ mt: 2, mb: 2 }}
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
                    <ListItem
                      button={"true"}
                      onClick={handleCloseUserMenu}
                      disableripple={"true"}
                    >
                      <ListItemIcon>
                        <Settings color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        style={{ color: 'black' }}
                        primary="Settings"
                      />
                    </ListItem>
                    <ListItem
                      button={"true"}
                      onClick={() => {
                        handleCloseUserMenu();
                        dispatch(auth_actions.Loguot());
                      }}
                      disableripple={"true"}
                    >
                      <ListItemIcon>
                        <ExitToApp color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        style={{ color: 'black' }}
                        primary="Logout"
                      />
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

            <Divider
              sx={{ my: 2, width: '80%', borderColor: 'rgba(255,255,255,0.2)' }}
            />

            <MenuOptions>
              <MenuItem
                button={"true"}
                expanded={(() => (expanded ? 'true' : 'false'))()}
                component={RouterLink}
                to="/calendar"
                disableripple={"true"}
              >
                <MenuItemIcon expanded={(() => (expanded ? 'true' : 'false'))()}>
                  <CalendarMonth />
                </MenuItemIcon>
                {expanded && <MenuItemText primary="Calendario" />}
              </MenuItem>
              {hasPermission(user.user.profile, 'Usuários', 'can_view') ? (
                <MenuItem
                  button={"true"}
                  expanded={(() => (expanded ? 'true' : 'false'))()}
                  component={RouterLink}
                  to="/users"
                  disableripple={"true"}
                >
                  <MenuItemIcon
                    expanded={(() => (expanded ? 'true' : 'false'))()}
                  >
                    <FaUser />
                  </MenuItemIcon>
                  {expanded && <MenuItemText primary="Usuários" />}
                </MenuItem>
              ) : null}
              {hasPermission(user.user.profile, 'perfís', 'can_view') ? (
                <MenuItem
                  button={"true"}
                  expanded={(() => (expanded ? 'true' : 'false'))()}
                  component={RouterLink}
                  to="/profiles"
                  disableripple={"true"}
                >
                  <MenuItemIcon
                    expanded={(() => (expanded ? 'true' : 'false'))()}
                  >
                    <AiFillProfile />
                  </MenuItemIcon>
                  {expanded && <MenuItemText primary="Perfís" />}
                </MenuItem>
              ) : null}
            </MenuOptions>
          </StyledToolbar>
        </StyledAppBar>
      )}
      <Content expanded={(() => (expanded ? 'true' : 'false'))()}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<CalendarPage />} />
          {hasPermission(user.user.profile, 'Usuários', 'can_view') ? (
            <Route path="/users" element={<UsersPage />} />
          ) : null}
          {hasPermission(user.user.profile, 'perfís', 'can_view') ? (
            <Route path="/profiles" element={<ProfilesPage />} />
          ) : null}
        </Routes>
      </Content>
    </AppContainer>
  );
}

export default Home;
