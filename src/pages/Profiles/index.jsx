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
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import * as profile_actions from '../../store/modules/userProfileReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../styles/AppThemeProvider';
import hasPermission from '../../services/has_permission';

// Estilos
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledFab = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    // Coloca o botão no canto inferior direito
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.third
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

function ProfilesPage(){
    const profiles = useSelector(state => state.userprofilereducer.profiles)
    const [open, setOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        permissions: [],
    });
    const [update, setUpdate] = useState(true);
    const dispatch = useDispatch();
    const theme = useTheme();
    const user = useSelector(state => state.authreducer);

    useEffect(() => {
        if(update){
            dispatch(profile_actions.USER_PROFILES_REQUEST({skip: 0, limit: 0, filters: ""}));
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

            const permissionExists = updatedPermissions.some((p) => p.entity_name === entity);

            if (!permissionExists) {
                const newPermission = {
                    entity_name: entity,
                    can_view: false,
                    can_create: false,
                    can_update: false,
                    can_delete: false,
                }
                updatedPermissions.push({...newPermission, [field]: value});
            }

            return {
                ...prevData,
                permissions: updatedPermissions,
            };
        });
    };

    const handleSubmit = () => {
        if (selectedProfile) {
            dispatch(profile_actions.USER_PROFILES_UPDATE_REQUEST({...selectedProfile}));
        } else {
            dispatch(profile_actions.USER_PROFILES_CREATE_REQUEST({
                ...formData,
            }));
        }
        handleClose();
        setUpdate(true);
    };

    const handleDelete = (profile) => {
        dispatch(profile_actions.USER_PROFILES_DELETE_REQUEST({...profile}));
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
        <Typography variant="h4" style={{ color: theme.palette.text.primary}} gutterBottom>
            Perfis
        </Typography>
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
                        {hasPermission(user.user.profile, "perfís", "can_update") ? (
                            <IconButton style={{ width: 40 }} aria-label="edit" onClick={() => handleEdit(profile)}>
                                <Edit />
                            </IconButton>
                        ): null}
                        {hasPermission(user.user.profile, "perfís", "can_delete") ? (
                            <IconButton
                                aria-label="delete"
                                onClick={() => handleDelete(profile)}
                                style={{ width: 40 }}
                            >
                                <Delete />
                            </IconButton>
                        ): null}
                        </StyledTableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        </StyledTableContainer>
        {hasPermission(user.user.profile, "perfís", "can_create") ? (
            <StyledFab
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}
            >
                <Add />
            </StyledFab>
        ): null}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
            {selectedProfile ? 'Editar Perfil' : 'Adicionar Perfil'}
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
                required
            />
            <Typography variant="h6" gutterBottom>
                    Permissões
                </Typography>
                <FormGroup>
                    {entities.map((entity) => {
                        const permission = formData.permissions.find(
                            (p) => p.entity_name === entity
                        ) || {
                            entity_name: entity,
                            can_view: false,
                            can_create: false,
                            can_update: false,
                            can_delete: false,
                        };

                        return (
                            <Box key={entity}>
                                <Typography variant="subtitle1" style={{ color: theme.palette.text.third}} gutterBottom>
                                    {entity.charAt(0).toUpperCase() + entity.slice(1)}
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={permission.can_view || false}
                                            onChange={(e) =>
                                                handlePermissionChange(entity, 'can_view', e.target.checked)
                                            }
                                        />
                                    }
                                    label="Visualizar"
                                    style={{ color: theme.palette.text.third}}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={permission.can_create || false}
                                            onChange={(e) =>
                                                handlePermissionChange(entity, 'can_create', e.target.checked)
                                            }
                                        />
                                    }
                                    label="Criar"
                                    style={{ color: theme.palette.text.third}}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={permission.can_update || false}
                                            onChange={(e) =>
                                                handlePermissionChange(entity, 'can_update', e.target.checked)
                                            }
                                        />
                                    }
                                    label="Atualizar"
                                    style={{ color: theme.palette.text.third}}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={permission.can_delete || false}
                                            onChange={(e) =>
                                                handlePermissionChange(entity, 'can_delete', e.target.checked)
                                            }
                                        />
                                    }
                                    label="Deletar"
                                    style={{ color: theme.palette.text.third}}
                                />
                            </Box>
                        );
                    })}
                </FormGroup>
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
};

export default ProfilesPage;