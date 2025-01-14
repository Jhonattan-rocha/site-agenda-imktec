import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid2 as Grid,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import * as user_actions from '../../store/modules/userReducer/actions';
import * as profile_actions from '../../store/modules/userProfileReducer/actions';
import { useTheme } from '../../styles/AppThemeProvider';
import hasPermission from '../../services/has_permission';
import ConfirmationDialog from '../../GlobalComponents/confirmDialog';

// Estilos
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%'
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.third,
}));

const StyledFab = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(10),
  right: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    top: theme.spacing(9),
    right: theme.spacing(2),
  },
}));

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  '& .MuiInput-root': {
    color: theme.palette.text.third,
    borderColor: theme.palette.primary.contrastText,
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

function UsersPage() {
  const users = useSelector((state) => state.userreducer.users);
  const profiles = useSelector((state) => state.userprofilereducer.profiles);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_id: '',
  });
  const [isMobile, setIsMobile] = useState(false);
  const [update, setUpdate] = useState(true);
  const theme = useTheme();
  const dispatch = useDispatch();
  const current_user = useSelector((state) => state.authreducer);

  useEffect(() => {
    if (update) {
      dispatch(
        user_actions.USERS_REQUEST({ skip: 0, limit: 0, filters: '' })
      );
      dispatch(
        profile_actions.USER_PROFILES_REQUEST({ skip: 0, limit: 0, filters: '' })
      );
      setUpdate(false);
    }
  }, [update]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      profile_id: '',
    });
  };

  const handleInputChange = (event) => {
    try {
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    if (selectedUser) {
      dispatch(
        user_actions.USER_UPDATE_REQUEST({ ...formData, id: selectedUser.id })
      );
    } else {
      const newUser = {
        ...formData,
      };
      dispatch(user_actions.USER_CREATE_REQUEST(newUser));
    }
    handleClose();
    setUpdate(true);
  };

  const handleDelete = (userId) => {
    dispatch(user_actions.USER_DELETE_REQUEST({ id: userId }));
    setUpdate(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      profile_id: user.profile_id,
    });
    handleClickOpen();
    setUpdate(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600); // Define isMobile como true se a largura da tela for menor que 768px (você pode ajustar esse valor)
      
      if (window.innerWidth >= 600) {
        setIsMobile(false); // Fechar a drawer se a tela voltar a ser maior que 600px
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); // Verifica o tamanho da tela ao carregar o componente
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  return (
    <Box p={2}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item={"true"} xs={12} md={10}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography
              style={{ color: theme.palette.text.primary }}
              variant="h4"
            >
              Usuários
            </Typography>
            {hasPermission(current_user.user.profile, 'Usuários', 'can_create') && (
              <StyledFab
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}
                style={{ position: 'relative', top: 0, right: 0 }}
              >
                <Add />
              </StyledFab>
            )}
          </Box>
          <StyledTableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Nome</StyledTableCell>
                  <StyledTableCell style={{ display: isMobile ? "none":"" }}>Email</StyledTableCell>
                  <StyledTableCell style={{ display: isMobile ? "none":"" }}>Perfil</StyledTableCell>
                  <StyledTableCell align="right">Ações</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <StyledTableCell component="th" scope="row">
                      {user.id}
                    </StyledTableCell>
                    <StyledTableCell>{user.name}</StyledTableCell>
                    <StyledTableCell style={{ display: isMobile ? "none":"" }}>{user.email}</StyledTableCell>
                    <StyledTableCell style={{ display: isMobile ? "none":"" }}>
                      {user.profile ? user.profile.name : ''}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Box display={'flex'} flexDirection={'row'}>
                        {hasPermission(
                          current_user.user.profile,
                          'Usuários',
                          'can_update'
                        ) && (
                          <IconButton
                            aria-label="edit"
                            onClick={() => {
                              handleEdit(user);
                              setUpdate(true);
                            }}
                            style={{ width: 40 }}
                          >
                            <Edit />
                          </IconButton>
                        )}
                        {hasPermission(
                          current_user.user.profile,
                          'Usuários',
                          'can_delete'
                        ) && (
                          <ConfirmationDialog 
                          iconChoose={"delete"} 
                          iconColor={theme.palette.danger.delete} 
                          message='Tem certeza que deseja deletar?' 
                          onConfirm={() => {
                              handleDelete(user.id);
                              setUpdate(true);
                          }} iconButton={true} 
                          title='Confirmação de deleção' 
                          cancelButtonText='Não' 
                          confirmButtonText='Sim' 
                          onCancel={() => {}} />
                        )}
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={window.innerWidth < 600}>
        <DialogTitle color={theme.palette.text.third}>
          {selectedUser ? 'Editar Usuário' : 'Adicionar Usuário'}
        </DialogTitle>
        <DialogContent>
          <Grid container display={'flex'} flexDirection={'column'} spacing={2}>
            <Grid item={"true"} xs={12}>
              <TextFieldStyled
                autoFocus
                margin="dense"
                name="name"
                label="Nome"
                type="text"
                fullWidth
                variant="standard"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item={"true"} xs={12}>
              <TextFieldStyled
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            {!selectedUser && (
              <Grid item={"true"} xs={12}>
                <TextFieldStyled
                  margin="dense"
                  name="password"
                  label="Senha"
                  type="password"
                  fullWidth
                  variant="standard"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            )}
            <Grid item={"true"} xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="profile-label" style={{ color: theme.palette.text.third }}>Perfil</InputLabel>
                <Select
                  labelId="profile-label"
                  name="profile_id"
                  value={formData.profile_id}
                  onChange={handleInputChange}
                  style={{ color: theme.palette.text.third }}
                  required
                >
                  {profiles.map((profile) => (
                    <MenuItem
                      key={profile.id}
                      value={profile.id}
                      style={{ color: theme.palette.text.third }}
                    >
                      {profile.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={(e) => {
              handleSubmit(e);
              setUpdate(true);
            }}
          >
            {selectedUser ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UsersPage;