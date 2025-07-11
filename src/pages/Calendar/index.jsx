import React, { useState, useMemo, useEffect } from 'react';
import {
  Grid2 as Grid,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Drawer,
  TextField,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Checkbox,
  FormControlLabel,
  Avatar,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import {
  CalendarToday,
  ViewWeek,
  ChevronLeft,
  ChevronRight,
  Add,
  Delete,
  CheckCircleOutline,
  RadioButtonUnchecked,
  Update,
  ArrowLeft,
  UpdateRounded,
  PlusOne,
  ControlPointDuplicate
} from '@mui/icons-material';
import { styled } from '@mui/system';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';
import MenuIcon from '@mui/icons-material/Menu';
import { ptBR } from 'date-fns/locale';
import * as event_actions from '../../store/modules/eventsReducer/actions';
import * as task_actions from '../../store/modules/tasksReducer/actions';
import * as user_actions from '../../store/modules/userReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../styles/AppThemeProvider';
import * as generic_actions from '../../store/modules/genericReducer/actions';
import GenericSearch from '../../services/indivialStateSearch';
import ConfirmationDialog from '../../GlobalComponents/confirmDialog';

// Estilos para a Barra Lateral
const drawerWidth = 300;
const countCols = 7;

// Estilos para o Calendário
const CalendarContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
}));

const CalendarHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.third,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Estilos
const CalendarDay = styled('div')(({ theme, isCurrentMonth, isToday, isMobile }) => ({
  backgroundColor: isToday
    ? theme.palette.primary.light
    : isCurrentMonth
    ? theme.palette.background.paper
    : theme.palette.grey[200],
  color: isToday
    ? theme.palette.primary.contrastText
    : theme.palette.text.third,
  padding: theme.spacing(1),
  border: isToday
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8,
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  overflow: 'hidden',
  height: isMobile === "true" ? '50px' : 'auto', // Ajuste para a altura em mobile
}));

const CalendarDayLabel = styled('span')(({ theme, isMobile }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.third,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  fontSize: isMobile === "true" ? '12px' : 'inherit', // Ajuste para o tamanho da fonte em mobile
}));

const CalendarGrid = styled('div')(({ theme, view, isMobile }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${isMobile === "true" ? countCols - 3 : countCols}, 1fr)`,
  gridTemplateRows: view === 'month' ? isMobile === "true" ? 'repeat(9, 50px)' : 'repeat(6, 1fr)' : isMobile === "true" ? 'repeat(1, 50px)': 'repeat(1, 1fr)', // Ajuste para a altura das linhas em mobile
  gap: theme.spacing(0),
  padding: theme.spacing(2),
  flexGrow: 1,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  overflow: isMobile === "true" ? 'scroll' : 'hidden',
  overflowX: 'hidden',
  height: '75vh',
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.third,
    boxShadow: theme.shadows[2],
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const EventList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

// Estilos para o FabButton
const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(2),
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginBottom: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const AvatarsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  gap: theme.spacing(1),
  overflowX: 'auto',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '&::-webkit-scrollbar': {
    height: 8,
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[300],
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  },
}));

function CalendarPage(){
  const user = useSelector(state => state.authreducer);
  const users = useSelector(state => state.userreducer?.users);
  const events = useSelector(state => state.eventsReducer?.events);
  const generics = useSelector(state => state.genericreducer?.generics);
  const [isMobile, setIsMobile] = useState(false);
  const [mainEvents, setMainEvents] = useState([...events]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [update, setUpdate] = useState(true);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [coworker, setCoworker] = useState(users?.length ? users[0]: {});

  const [eventFormData, setEventFormData] = useState({
    name: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    desc: '',
    private: false
  });

  const [taskFormData, setTaskFormData] = useState({
    name: '',
    desc: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    ready: false,
    pendding_notifi: true,
    loop: true,
    time_to_dispatch: 3.0,
    private: false
  });

  const convertDate = (date = new Date(), pattern = "") => {
    try{
      return format(date, pattern);
    }catch(err) {
      return format(new Date(), pattern);
    }
  }

  const handleTaskFormChange = (field, value) => {
    try{
      setTaskFormData({
        ...taskFormData,
        [field]: value,
      });
    }catch(err) {};
  };

  const handleCreateTask = () => {
    const newTask = {
      ...taskFormData,
      event_id: selectedEvent.id,
    };
    dispatch(task_actions.TASKS_CREATE_REQUEST(newTask));
    setTaskFormData({
      name: '',
      desc: '',
      date: convertDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
      ready: false,
      pendding_notifi: true,
      loop: true,
      time_to_dispatch: 3.0,
      private: false
    });
    setIsTaskModalOpen(false);
    setUpdate(true);
  };

  const handleEditTask = () => {
    const updated_task = {
      ...taskFormData,
      event_id: selectedEvent.id,
    };
    dispatch(task_actions.TASKS_UPDATE_REQUEST(updated_task));
    setTaskFormData({
      name: '',
      desc: '',
      date: convertDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
      ready: false,
      pendding_notifi: true,
      loop: true,
      time_to_dispatch: 3.0,
      private: false
    });
    setIsTaskModalOpen(false);
    setUpdate(true);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(task_actions.TASKS_DELETE_REQUEST({id: taskId}));
    if (taskFormData.id === taskId) {
      setTaskFormData({
        name: '',
        desc: '',
        date: convertDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
        ready: false,
        pendding_notifi: true,
        loop: true,
        time_to_dispatch: 3.0,
        private: false
      });
      setIsTaskModalOpen(false);
    }
    setUpdate(true);
  };

  const handleEventFormChange = (field, value) => {
    try{
      setEventFormData({
        ...eventFormData,
        [field]: value,
      });
    }catch(err) {};
  };
  const handleCreateEvent = () => {
    
    dispatch(event_actions.EVENTS_CREATE_REQUEST({
      user_id: user.user.id,
      date: new Date(eventFormData.date),
      name: eventFormData.name,
      desc: eventFormData.desc
    }));

    setEventFormData({
      name: '',
      date: convertDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
      desc: '',
      private: false
    });
    setIsEventModalOpen(false);
    setUpdate(true);
  };

  const handleEditEvent = () => {
      dispatch(event_actions.EVENTS_UPDATE_REQUEST({
        ...eventFormData
      }));
      setEventFormData({
        name: '',
        date: convertDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
        desc: '',
      });
      setIsEventModalOpen(false);
      setUpdate(true);
  };

  const handleDeleteEvent = (eventId) => {
    dispatch(event_actions.EVENTS_DELETE_REQUEST({id: eventId}))
    if (eventFormData.id === eventId) {
      setEventFormData({
        name: '',
        date: convertDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
        desc: '',
        private: false
      });
      setIsEventModalOpen(false);
    }
    setUpdate(true);
  };

  const handleDrawerOpen = (day) => {
    setSelectedDay(day);
    setTimeout(() => {
      setDrawerOpen(true);
    }, 100);
    setSelectedEvent(null);
    setUpdate(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedEvent(null);
    setUpdate(true);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setUpdate(true);
  };

  const handleEventClick = (event, day) => {
    setSelectedEvent(event);
    setTimeout(() => {
      setDrawerOpen(true);
    }, 100);
    setSelectedDay(day);
  };

  const daysInMonth = useMemo(() => {
    if (view === 'month') {
      let date_aux = endOfMonth(currentDate);
      let qtd_days_ins_calendar = date_aux.getDate() + (countCols - (date_aux.getDate() % countCols));
      if(isMobile){
        qtd_days_ins_calendar += 1;
      }
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: date_aux.setDate(qtd_days_ins_calendar),
      });
    } else {
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 0 }),
        end: endOfWeek(currentDate, { weekStartsOn: 0 }),
      });
    }
  }, [currentDate, view]);

  const eventsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return mainEvents.filter((event) => isSameDay(parseISO(event.date), selectedDay));
  }, [mainEvents, selectedDay]);
  
  const handleAddUserToTask = () => {
    dispatch(
      generic_actions.GENERIC_CREATE_REQUEST({
        values: {
          task_id: taskFormData.id,
          user_id: coworker.id,
        },
        model: "TaskUser"
      })
    );
    setUpdate(true);
  };

  const handleAddUserToEvent = () => {
    dispatch(
      generic_actions.GENERIC_CREATE_REQUEST({
        values: {
          event_id: eventFormData.id,
          user_id: coworker.id,
        },
        model: "EventUser"
      })
    );
    setUpdate(true);
  };
  

  useEffect(() => {
    if (selectedEvent) {
      const updatedSelectedEvent = mainEvents.find((e) => e.id === selectedEvent.id);
      setSelectedEvent(updatedSelectedEvent);
    }
  }, [mainEvents, selectedEvent]);

  useEffect(() => {
    if (taskFormData?.id) {
      dispatch(generic_actions.GENERICS_REQUEST({ skip: 0, limit: 0, filters: `task_id+eq+${taskFormData.id}`, model: "TaskUser" }));
    }
  }, [dispatch, taskFormData]);

  useEffect(() => {
    if (eventFormData?.id) {
      dispatch(generic_actions.GENERICS_REQUEST({ skip: 0, limit: 0, filters: `event_id+eq+${eventFormData.id}`, model: "EventUser" }));
    }
  }, [dispatch, eventFormData]);

  useEffect(() => {
    if(update){
      dispatch(event_actions.EVENTS_REQUEST({skip: 0, limit: 0, filters: `user_id+eq+${user.user.id}|private+eq+0`}));
      dispatch(user_actions.USERS_REQUEST({skip: 0, limit: 0, filters: ""}));
      setUpdate(false);
    }
  }, [update, user, dispatch]);

  useEffect(() => {
    async function fetchSharedEvents(){
      let share = await GenericSearch(user.token, "generic", 0, 0, `user_id+eq+${user.user.id}`, "EventUser");
      let aux = []
      for(let event of share){
        aux.push(event.values.event_id);
      }
      let sheared_events_id = aux.join(",");

      if(sheared_events_id){
        let shared_events = await GenericSearch(user.token, "event", 0, 0, `id+in+${sheared_events_id}`, "Event");
        setMainEvents([...events, ...shared_events]);
      }else{
        setMainEvents([...events]);
      }
    }

    fetchSharedEvents();
  }, [events, user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
      if (window.innerWidth >= 600) {
        setIsMobile(false);
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); // Verifica o tamanho da tela ao carregar o componente
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <Grid container>
      <Grid
        item={"true"}
        xs={12}
        md={drawerOpen && !isMobile ? 9 : 12} // Ajuste para a largura em mobile
        sx={{
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(drawerOpen &&
            !isMobile && { // Ajuste para a largura em mobile
              width: (theme) => `calc(100% - ${drawerWidth}px)`,
              marginRight: (theme) => `${drawerWidth}px`,
            }),
          width: '100%',
          height: '100%',
        }}
      >
        <CalendarContainer>
          <CalendarHeader>
            <IconButton
              sx={{ width: isMobile ? '25%' : 40 }} // Ajuste para o tamanho do botão em mobile
              onClick={() => handleDateChange(subMonths(currentDate, 1))}
            >
              <ChevronLeft />
            </IconButton>
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ mx: 2, textAlign: 'center', width: isMobile ? '50%' : 'auto' }}>
              {convertDate(currentDate, isMobile ? 'MMM, yyyy' : 'MMMM, yyyy', { locale: ptBR })}
            </Typography>
            <IconButton
              sx={{ width: isMobile ? '25%' : 40 }} // Ajuste para o tamanho do botão em mobile
              onClick={() => handleDateChange(addMonths(currentDate, 1))}
            >
              <ChevronRight />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            
            {isMobile ? ( // Botão para abrir o Drawer em mobile
              <IconButton style={{ width: 40 }} onClick={() => setDrawerOpen(!drawerOpen)}>
                <MenuIcon />
              </IconButton>
            ) : (
              <StyledToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="calendar view"
              >
                <ToggleButton value="month" aria-label="month view">
                  <CalendarToday />
                </ToggleButton>
                <ToggleButton value="week" aria-label="week view">
                  <ViewWeek />
                </ToggleButton>
              </StyledToggleButtonGroup>
            )}
          </CalendarHeader>
          <CalendarGrid view={view} isMobile={isMobile.toString()}>
            {daysInMonth.map((day) => (
              <CalendarDay
                key={day.toString()}
                isCurrentMonth={isSameMonth(day, currentDate)}
                isToday={isSameDay(day, new Date())}
                onClick={() => handleDrawerOpen(day)}
                isMobile={isMobile.toString()}
              >
                <CalendarDayLabel isMobile={isMobile.toString()}>{convertDate(day, 'd')}</CalendarDayLabel>
                <Box sx={{ overflow: 'hidden', width: '100%' }}>
                  {mainEvents
                    .filter((event) => isSameDay(parseISO(event.date), day))
                    .map((event, index) => (
                      <Box
                        key={event.id * index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTimeout(() => {
                            setUpdate(true);
                          }, 100);
                          handleEventClick(event, day);
                        }}
                        sx={{
                          backgroundColor:
                            event?.tasks?.filter(
                              (task) =>
                                new Date() > new Date(task.date) && !task.ready
                            ).length > 0
                              ? 'white'
                              : 'primary.main',
                          color:
                            event?.tasks?.filter(
                              (task) =>
                                new Date() > new Date(task.date) && !task.ready
                            ).length > 0
                              ? 'black'
                              : 'primary.contrastText',
                          padding: 0.5,
                          marginBottom: 0.5,
                          borderRadius: 1,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: isMobile ? '10px' : '12px', // Ajuste para o tamanho da fonte em mobile
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                      >
                        {event.name}
                      </Box>
                    ))}
                </Box>
              </CalendarDay>
            ))}
          </CalendarGrid>
        </CalendarContainer>
      </Grid>
      <Grid item={"true"} xs={12} md={3}>
        <StyledDrawer
          variant={isMobile ? 'temporary' : 'persistent'} // Drawer temporário em mobile
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerClose} // Adicionado para fechar o Drawer em mobile
          ModalProps={{
            keepMounted: true, // Melhor desempenho em mobile
          }}
        >
          <DrawerHeader>
            <Typography variant="h6" sx={{ marginRight: 'auto' }}>
              {selectedDay &&
                convertDate(selectedDay, 'dd MMMM, yyyy', { locale: ptBR })}
            </Typography>
            <IconButton style={{ width: 40 }} onClick={handleDrawerClose}>
              <ChevronRight />
            </IconButton>
          </DrawerHeader>
          <Divider />
          {selectedEvent ? (
            <Box p={2}>
              <Typography variant="h6">
                Tarefas - {selectedEvent.name}
              </Typography>
              <List dense>
                {selectedEvent.tasks.map((task) => (
                  <ListItem
                    key={task.id}
                    secondaryAction={
                      <>
                        <IconButton
                          style={{ width: 40 }}
                          edge="end"
                          aria-label="update"
                          onClick={(e) => {
                            setTaskFormData(task);
                            setTimeout(() => {
                              setIsTaskModalOpen(true);
                            }, 100);
                            setUpdate(true);
                          }}
                        >
                          <UpdateRounded />
                        </IconButton>
                        <ConfirmationDialog 
                        iconChoose={"delete"} 
                        iconColor={theme.palette.danger.delete} 
                        message='Tem certeza que deseja deletar?' 
                        onConfirm={() => {
                            handleDeleteTask(task.id);
                            setUpdate(true);
                        }} 
                        iconButton={true} 
                        title='Confirmação de deleção' 
                        cancelButtonText='Não' 
                        confirmButtonText='Sim' 
                        onCancel={() => {}} />
                      </>
                    }
                  >
                    <IconButton
                      style={{ width: 40 }}
                      onClick={() => {
                        dispatch(
                          task_actions.TASKS_UPDATE_REQUEST({
                            ...task,
                            ready: !task.ready,
                          })
                        );
                        setUpdate(true);
                      }}
                    >
                      {task.ready ? (
                        <CheckCircleOutline />
                      ) : (
                        <RadioButtonUnchecked />
                      )}
                    </IconButton>
                    <ListItemText
                      primary={task.name}
                      secondary={task.desc}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => {
                    setTaskFormData({
                      name: '',
                      desc: '',
                      date: convertDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
                      ready: false,
                      pendding_notifi: true,
                      loop: true,
                      time_to_dispatch: 3.0,
                      private: false
                    });
                    setTimeout(() => {
                      setIsTaskModalOpen(true);
                    }, 100);
                  }}
                >
                  Adicionar Tarefa
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowLeft />}
                  onClick={() => {
                    handleDrawerOpen(selectedDay);
                  }}
                  style={{ marginLeft: 3 }}
                >
                  Voltar
                </Button>
              </Box>

              <Dialog
                open={isTaskModalOpen}
                onClose={() => {
                  setIsTaskModalOpen(false);
                }}
              >
                <DialogTitle sx={{ color: theme.palette.text.third }}>
                  {taskFormData.id ? 'Editar Tarefa' : 'Nova Tarefa'}
                </DialogTitle>
                <DialogContent>
                  <TextFieldStyled
                    autoFocus
                    margin="dense"
                    label="Nome da Tarefa"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={taskFormData.name}
                    onChange={(e) =>
                      handleTaskFormChange('name', e.target.value)
                    }
                    required
                  />
                  <TextFieldStyled
                    margin="dense"
                    label="Descrição"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={taskFormData.desc}
                    onChange={(e) =>
                      handleTaskFormChange('desc', e.target.value)
                    }
                    required
                  />
                  <TextFieldStyled
                    margin="dense"
                    label="Data"
                    type="datetime-local"
                    fullWidth
                    variant="standard"
                    value={taskFormData.date}
                    onChange={(e) =>
                      handleTaskFormChange('date', e.target.value)
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: 'true',
                      },
                    }}
                    required
                  />

                  <TextFieldStyled
                    margin="dense"
                    label="Intervalo das notificações"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={taskFormData.time_to_dispatch}
                    onChange={(e) =>
                      handleTaskFormChange('time_to_dispatch', e.target.value)
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: 'true',
                      },
                    }}
                    required
                  />

                  <FormControlLabel
                    name="pendding_notifi"
                    control={
                      <Checkbox
                        checked={taskFormData.pendding_notifi ?? false}
                        onChange={(e) =>
                          handleEventFormChange('pendding_notifi', e.target.checked)
                        }
                      />
                    }
                    label="Notificação de pendencia?"
                    style={{ color: theme.palette.text.third }}
                  />

                  <FormControlLabel
                    name="loop"
                    control={
                      <Checkbox
                        checked={taskFormData.loop ?? false}
                        onChange={(e) =>
                          handleEventFormChange('loop', e.target.checked)
                        }
                      />
                    }
                    label="Notificação única?"
                    style={{ color: theme.palette.text.third }}
                  />

                  {taskFormData.id ? (
                    <>
                      <AvatarsContainer>
                        <Typography
                          variant="caption"
                          style={{ color: theme.palette.text.third }}
                        >
                          Usuários relacionados
                        </Typography>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          {Array.from(
                            generics['TaskUser'] ?? new Set([])
                          ).map((item, index) => {
                            let user = users.find(
                              (usr) => usr.id === item.values.user_id
                            );
                            return (
                              <React.Fragment key={index}>
                                <Typography
                                  variant="caption"
                                  style={{
                                    color: theme.palette.text.third,
                                    fontSize: '16px',
                                  }}
                                >
                                  {user.name}
                                </Typography>
                                <IconButton
                                  style={{ width: 40 }}
                                  onClick={() => {
                                    dispatch(
                                      generic_actions.GENERIC_DELETE_REQUEST({
                                        id: item.values.id,
                                        model: 'TaskUser',
                                      })
                                    );
                                    setUpdate(true);
                                  }}
                                >
                                  <Delete></Delete>
                                </IconButton>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </AvatarsContainer>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          width: '100%',
                        }}
                      >
                        <Autocomplete
                          options={users}
                          getOptionLabel={(option) => option?.name}
                          value={coworker}
                          onChange={(event, newValue) => {
                            setCoworker(newValue);
                          }}
                          renderInput={(params) => (
                            <TextFieldStyled
                              {...params}
                              label="Selecionar Usuário"
                              variant="standard"
                              margin="normal"
                              sx={{ minWidth: 250 }}
                            />
                          )}
                          slotProps={{
                            paper: {
                              style: {
                                color: theme.palette.text.third, // Cor do texto das opções
                              },
                            },
                            option: {
                              style: {
                                color: theme.palette.text.third, // Cor do texto das opções
                              },
                            },
                            clearIndicator: {
                              // Estilos para o botão de limpar
                              style: {
                                color: theme.palette.text.third,
                                width: 40,
                              },
                            },
                            popupIndicator: {
                              // Estilos para o botão de dropdown
                              style: {
                                color: theme.palette.text.third,
                                width: 40, // Ajuste a largura conforme necessário
                              },
                            },
                          }}
                          sx={{
                            width: '100%',
                          }}
                        />
                        <IconButton
                          style={{ width: 40, margin: 'auto' }}
                          onClick={() => {
                            handleAddUserToTask();
                          }}
                        >
                          <Add />
                        </IconButton>
                      </div>
                    </>
                  ) : null}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsTaskModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={(e) => {
                      taskFormData.id
                        ? handleEditTask(e)
                        : handleCreateTask(e);
                      setUpdate(true);
                    }}
                  >
                    {taskFormData.id ? 'Salvar' : 'Adicionar'}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          ) : (
            <>
              <EventList>
                {eventsForSelectedDay.map((event) => (
                  <ListItem
                    key={event.id}
                    button={"true"}
                    onClick={() => {
                      setSelectedEvent(event);
                    }}
                    secondaryAction={
                      <>
                        <IconButton
                          style={{ width: 40 }}
                          edge="end"
                          aria-label="duplicate"
                          title="Duplicar"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              event_actions.EVENTS_DUPLICATE_CREATE_REQUEST(
                                event
                              )
                            );
                            setTimeout(() => {
                              setUpdate(true);
                            }, 100);
                          }}
                        >
                          <ControlPointDuplicate />
                        </IconButton>
                        <IconButton
                          style={{ width: 40 }}
                          edge="end"
                          aria-label="update"
                          title="Editar"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEventFormData(event);
                            setTimeout(() => {
                              setIsEventModalOpen(true);
                            }, 100);
                            setUpdate(true);
                          }}
                        >
                          <Update />
                        </IconButton>
                        <ConfirmationDialog 
                        iconChoose={"delete"} 
                        iconColor={theme.palette.danger.delete} 
                        message='Tem certeza que deseja deletar?' 
                        onConfirm={() => {
                            handleDeleteEvent(event.id);
                            setUpdate(true);
                        }} 
                        iconButton={true} 
                        title='Confirmação de deleção' 
                        cancelButtonText='Não' 
                        confirmButtonText='Sim' 
                        onCancel={() => {
                          setUpdate(true);
                        }} />
                      </>
                    }
                  >
                    <ListItemText
                      primary={event.name}
                      secondary={
                        <>
                          {convertDate(parseISO(event.date), 'HH:mm', {
                            locale: ptBR,
                          })}
                          {event.desc && ` - ${event.desc}`}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </EventList>

              <Dialog
                open={isEventModalOpen}
                onClose={() => {
                  setIsEventModalOpen(false);
                }}
              >
                <DialogTitle sx={{ color: theme.palette.text.third }}>
                  {eventFormData.id ? 'Editar Evento' : 'Novo Evento'}
                </DialogTitle>
                <DialogContent>
                  {users.length ? (
                    <div>
                      <StyledAvatar
                        alt="User Name"
                        title={
                          users.find((usr) => usr.id === eventFormData.user_id)
                            ?.name
                        }
                      />
                      <Typography style={{ color: theme.palette.text.third }}>
                        {
                          users.find((usr) => usr.id === eventFormData.user_id)
                            ?.name
                        }
                      </Typography>
                    </div>
                  ) : (
                    <CircularProgress />
                  )}
                  <TextFieldStyled
                    autoFocus
                    margin="dense"
                    label="Nome do Evento"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={eventFormData.name}
                    onChange={(e) =>
                      handleEventFormChange('name', e.target.value)
                    }
                    required
                  />
                  <TextFieldStyled
                    margin="dense"
                    label="Descrição"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={eventFormData.desc}
                    onChange={(e) =>
                      handleEventFormChange('desc', e.target.value)
                    }
                    required
                  />
                  <TextFieldStyled
                    margin="dense"
                    label="Data"
                    type="datetime-local"
                    fullWidth
                    variant="standard"
                    value={convertDate(
                      new Date(eventFormData.date),
                      "yyyy-MM-dd'T'HH:mm"
                    )}
                    onChange={(e) =>
                      handleEventFormChange('date', e.target.value)
                    }
                    slotProps={{
                      input: {
                        shrink: 'true',
                      },
                    }}
                    required
                  />
                  {eventFormData.id ? (
                    <>
                      <AvatarsContainer>
                        <Typography
                          variant="caption"
                          style={{ color: theme.palette.text.third }}
                        >
                          Usuários relacionados
                        </Typography>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          {Array.from(
                            generics['EventUser'] ?? new Set([])
                          ).map((item, index) => {
                            let user = users.find(
                              (usr) => usr.id === item.values.user_id
                            );
                            return (
                              <React.Fragment key={index}>
                                <Typography
                                  variant="caption"
                                  style={{
                                    color: theme.palette.text.third,
                                    fontSize: '16px',
                                  }}
                                >
                                  {user.name}
                                </Typography>
                                <IconButton
                                  style={{ width: 40 }}
                                  title="Deletar"
                                  onClick={() => {
                                    dispatch(
                                      generic_actions.GENERIC_DELETE_REQUEST({
                                        id: item.values.id,
                                        model: 'EventUser',
                                      })
                                    );
                                    setUpdate(true);
                                  }}
                                >
                                  <Delete style={{ color: 'red' }} />
                                </IconButton>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </AvatarsContainer>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          width: '100%',
                        }}
                      >
                        <Autocomplete
                          options={users}
                          getOptionLabel={(option) => option?.name}
                          value={coworker}
                          onChange={(event, newValue) => {
                            setCoworker(newValue);
                          }}
                          renderInput={(params) => (
                            <TextFieldStyled
                              {...params}
                              label="Selecionar Usuário"
                              variant="standard"
                              margin="normal"
                              sx={{ minWidth: 250 }}
                            />
                          )}
                          slotProps={{
                            paper: {
                              style: {
                                color: theme.palette.text.third,
                              },
                            },
                            option: {
                              style: {
                                color: theme.palette.text.third,
                              },
                            },
                            clearIndicator: {
                              style: {
                                color: theme.palette.text.third,
                                width: 40,
                              },
                            },
                            popupIndicator: {
                              style: {
                                color: theme.palette.text.third,
                                width: 40,
                              },
                            },
                          }}
                          sx={{
                            width: '100%',
                          }}
                        />
                        <IconButton
                          style={{ width: 40, margin: 'auto' }}
                          title="Adicionar"
                          onClick={() => {
                            handleAddUserToEvent();
                          }}
                        >
                          <Add />
                        </IconButton>
                      </div>
                    </>
                  ) : null}
                  <FormControlLabel
                    name="private"
                    control={
                      <Checkbox
                        checked={eventFormData.private ?? false}
                        onChange={(e) =>
                          handleEventFormChange('private', e.target.checked)
                        }
                      />
                    }
                    label="Particular?"
                    style={{ color: theme.palette.text.third }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsEventModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={(e) => {
                      eventFormData.id
                        ? handleEditEvent(e)
                        : handleCreateEvent(e);
                      setUpdate(true);
                    }}
                  >
                    {eventFormData.id ? 'Salvar' : 'Adicionar'}
                  </Button>
                </DialogActions>
              </Dialog>

              <StyledFab
                color="primary"
                aria-label="add"
                onClick={() => {
                  setEventFormData({
                    name: '',
                    date: selectedDay
                      ? convertDate(selectedDay, "yyyy-MM-dd'T'HH:mm")
                      : convertDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
                    desc: '',
                    private: false,
                  });
                  setTimeout(() => {
                    setIsEventModalOpen(true);
                  }, 100);
                }}
              >
                <Add />
              </StyledFab>
            </>
          )}
        </StyledDrawer>
      </Grid>
    </Grid>
  );
}

export default CalendarPage;