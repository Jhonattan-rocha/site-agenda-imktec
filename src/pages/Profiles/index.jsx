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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid2 as Grid,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { styled } from '@mui/system';
import * as profile_actions from '../../store/modules/userProfileReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../styles/AppThemeProvider';
import hasPermission from '../../services/has_permission';
import ConfirmationDialog from '../../GlobalComponents/confirmDialog';

// Estilos
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.third,
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

function ProfilesPage() {
  const profiles = useSelector((state) => state.userprofilereducer.profiles);
  const [open, setOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: [],
  });
  const [update, setUpdate] = useState(true);
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state) => state.authreducer);

  useEffect(() => {
    if (update) {
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
    setSelectedProfile(null);
    setFormData({
      name: '',
      permissions: [],
    });
    setUpdate(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePermissionChange = (entity, field, value) => {
    setFormData((prevData) => {
      let updatedPermissions = prevData.permissions.map((p) =>
        p.entity_name === entity ? { ...p, [field]: value } : p
      );

      const permissionExists = updatedPermissions.some(
        (p) => p.entity_name === entity
      );

      if (!permissionExists) {
        const newPermission = {
          entity_name: entity,
          can_view: false,
          can_create: false,
          can_update: false,
          can_delete: false,
        };
        updatedPermissions.push({ ...newPermission, [field]: value });
      }

      return {
        ...prevData,
        permissions: updatedPermissions,
      };
    });
  };

  const handleSubmit = () => {
    if (selectedProfile) {
      dispatch(
        profile_actions.USER_PROFILES_UPDATE_REQUEST({ ...selectedProfile, ...formData, permissions: formData.permissions })
      );
    } else {
      dispatch(
        profile_actions.USER_PROFILES_CREATE_REQUEST({
          ...formData,
        })
      );
    }
    handleClose();
    setUpdate(true);
  };

  const handleDelete = (profile) => {
    dispatch(profile_actions.USER_PROFILES_DELETE_REQUEST({ ...profile }));
    setUpdate(true);
  };

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setFormData({
      name: profile.name,
      permissions: profile.permissions,
    });
    handleClickOpen();
    setUpdate(true);
  };

  // Lista de entidades para as quais você deseja gerenciar permissões
  const entities = ['Usuários', 'perfís'];

  return (
    <Box p={2}>
      {/* Grid Container para Layout Responsivo */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item="true" xs={12} md={10}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography
              variant="h4"
              style={{ color: theme.palette.text.primary }}
            >
              Perfis
            </Typography>
            {/* Botão Flutuante para Adicionar Perfil */}
            {hasPermission(user.user.profile, 'perfís', 'can_create') && (
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
                  <StyledTableCell align="right">Ações</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <StyledTableCell component="th" scope="row">
                      {profile.id}
                    </StyledTableCell>
                    <StyledTableCell>{profile.name}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Box>
                        {hasPermission(
                          user.user.profile,
                          'perfís',
                          'can_update'
                        ) && (
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(profile)}
                            style={{ width: 40 }}
                          >
                            <Edit />
                          </IconButton>
                        )}
                        {hasPermission(
                          user.user.profile,
                          'perfís',
                          'can_delete'
                        ) && (
                          <ConfirmationDialog
                            iconChoose={"delete"}
                            iconColor={theme.palette.danger.delete}
                            message="Tem certeza que deseja deletar?"
                            onConfirm={() => {
                              handleDelete(profile);
                              setUpdate(true);
                            }}
                            iconButton={true}
                            title="Confirmação de deleção"
                            cancelButtonText="Não"
                            confirmButtonText="Sim"
                            onCancel={() => {}}
                          />
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

      {/* Diálogo para Adicionar/Editar Perfil */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={window.innerWidth < 600}>
        <DialogTitle color={theme.palette.text.third}>
          {selectedProfile ? 'Editar Perfil' : 'Adicionar Perfil'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item="true" xs={12}>
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
            <Grid item="true" xs={12}>
              <Typography variant="h6" style={{ color: theme.palette.text.third }}>
                Permissões
              </Typography>
              <FormGroup>
                {entities.map((entity) => {
                  const permission =
                    formData.permissions.find(
                      (p) => p.entity_name === entity
                    ) || {
                      entity_name: entity,
                      can_view: false,
                      can_create: false,
                      can_update: false,
                      can_delete: false,
                    };

                  return (
                    <Box key={entity} mt={2}>
                      <Typography variant="subtitle1" style={{ color: theme.palette.text.third }}>
                        {entity.charAt(0).toUpperCase() + entity.slice(1)}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item="true" xs={6} sm={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={permission.can_view || false}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    entity,
                                    'can_view',
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label="Visualizar"
                            style={{ color: theme.palette.text.third }}
                          />
                        </Grid>
                        <Grid item="true" xs={6} sm={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={permission.can_create || false}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    entity,
                                    'can_create',
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label="Criar"
                            style={{ color: theme.palette.text.third }}
                          />
                        </Grid>
                        <Grid item="true" xs={6} sm={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={permission.can_update || false}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    entity,
                                    'can_update',
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label="Atualizar"
                            style={{ color: theme.palette.text.third }}
                          />
                        </Grid>
                        <Grid item="true" xs={6} sm={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={permission.can_delete || false}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    entity,
                                    'can_delete',
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label="Deletar"
                            style={{ color: theme.palette.text.third }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {selectedProfile ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfilesPage;