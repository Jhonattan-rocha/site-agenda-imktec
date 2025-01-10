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
  InputLabel
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import * as user_actions from '../../store/modules/userReducer/actions';
import * as profile_actions from '../../store/modules/userProfileReducer/actions';
import { useTheme } from '../../styles/AppThemeProvider';

// Estilos
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.third
}));

const StyledFab = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
}));

const TextFieldStyled = styled(TextField)(({ theme }) => ({
    '& .MuiInput-root': {
      color: theme.palette.text.third, // Cor do texto digitado
      borderColor: theme.palette.primary.contrastText,
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

function UsersPage(){
  const users = useSelector(state => state.userreducer.users);
  const profiles = useSelector(state => state.userprofilereducer.profiles)
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_id: '',
  });
  const [update, setUpdate] = useState(true);
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if(update){
        dispatch(user_actions.USERS_REQUEST({skip: 0, limit: 0, filters: ""}));
        dispatch(profile_actions.USER_PROFILES_REQUEST({skip: 0, limit: 0, filters: ""}));
        setUpdate(false);
    }
  }, [update])

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
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (selectedUser) {
      dispatch(user_actions.USER_UPDATE_REQUEST({...selectedUser}));
    } else {
      const newUser = {
        ...formData
      };
      dispatch(user_actions.USER_UPDATE_REQUEST(newUser));
    }
    handleClose();
    setUpdate(true);
  };

  const handleDelete = (userId) => {
    dispatch(user_actions.USER_DELETE_REQUEST({id: userId}));
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
  };

  return (
    <Box p={2}>
      <Typography style={{ color: theme.palette.text.primary}} variant="h4" gutterBottom>
        Usuários
      </Typography>
      <StyledFab
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
      >
        <Add />
      </StyledFab>
      <StyledTableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Nome</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Perfil</StyledTableCell>
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
                <StyledTableCell>{user.email}</StyledTableCell>
                <StyledTableCell>{user.profile ? user.profile.name : ''}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton style={{ width: 40 }} aria-label="edit" onClick={() => handleEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(user.id)}
                    style={{ width: 40 }}
                  >
                    <Delete />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedUser ? 'Editar Usuário' : 'Adicionar Usuário'}
        </DialogTitle>
        <DialogContent>
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
          />
          <TextFieldStyled
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={handleInputChange}
          />
          {selectedUser ? (
            null
          ): (
            <TextFieldStyled
            margin="dense"
            name="password"
            label="Senha"
            type="password"
            fullWidth
            variant="standard"
            value={formData.password}
            onChange={handleInputChange}
          />
          )}
          <FormControl fullWidth margin="dense">
            <InputLabel id="profile-label">Perfil</InputLabel>
            <Select
              labelId="profile-label"
              name="profile_id"
              value={formData.profile_id}
              onChange={handleInputChange}
            >
                {profiles.map((profile) => (
                <MenuItem key={profile.id} value={profile.id}>
                    {profile.name}
                </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {selectedUser ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
