import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
  Grid2 as Grid,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useTheme } from '../../styles/AppThemeProvider';
import PropTypes from 'prop-types';

// Transição para o diálogo
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmationDialog({
  iconChoose,
  iconColor,
  message,
  onConfirm,
  onCancel,
  title = 'Confirmação',
  confirmButtonText = 'Sim',
  cancelButtonText = 'Não',
  iconButton = true
}) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [icons, setIcons] = useState({
    "delete": Delete
  });

  let Icon = icons[iconChoose];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose();
  };

  return (
    <>
      {iconButton ? (
          <IconButton
            aria-label="confirm"
            onClick={(e) => {
                e.stopPropagation();
                handleClickOpen()
            }}
            style={{ color: iconColor, width: 40 }}
          >
            <Icon></Icon>
          </IconButton>
        ):(
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
                e.stopPropagation();
                handleClickOpen();
            }}
          >
            <Icon></Icon>
          </Button>
        )}

      {/* Diálogo de confirmação */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <DialogTitle id="alert-dialog-slide-title" color={theme.palette.text.third}>
          {title}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item="true" xs={12}>
              <DialogContentText id="alert-dialog-slide-description" color={theme.palette.text.third}>
                {message}
              </DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => {
            e.stopPropagation();
            handleCancel();
          }}  variant='contained' color="primary">
            {cancelButtonText}
          </Button>
          <Button onClick={(e) => {
            e.stopPropagation();
            handleConfirm();
          }} variant='contained' color="warning">
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ConfirmationDialog.propTypes = {
    iconChoose: PropTypes.string,
    iconColor: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    title: PropTypes.string,
    confirmButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    iconButton: PropTypes.bool
};

export default ConfirmationDialog;