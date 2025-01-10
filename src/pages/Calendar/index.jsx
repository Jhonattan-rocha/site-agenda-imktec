import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Fab
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
  UpdateRounded
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
import { ptBR } from 'date-fns/locale';
import * as event_actions from '../../store/modules/eventsReducer/actions';
import * as task_actions from '../../store/modules/tasksReducer/actions';
import { useDispatch, useSelector } from 'react-redux';

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

const CalendarGrid = styled('div')(({ theme, view }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gridTemplateRows: view === 'month' ? 'repeat(6, 1fr)' : 'repeat(1, 1fr)',
  gap: theme.spacing(0),
  padding: theme.spacing(2),
  flexGrow: 1,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  overflow: 'hidden',
  height: '75vh',
}));

const CalendarDay = styled('div')(({ theme, isCurrentMonth, isToday }) => ({
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
}));

const CalendarDayLabel = styled('span')(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.third,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
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

// Estilos para a Barra Lateral
const drawerWidth = 350;

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

function CalendarPage(){
  const user = useSelector(state => state.authreducer);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const events = useSelector(state => state.eventsReducer.events);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [update, setUpdate] = useState(true);
  const dispatch = useDispatch();
  const [eventFormData, setEventFormData] = useState({
    name: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    desc: '',
  });

  const [taskFormData, setTaskFormData] = useState({
    name: '',
    desc: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    ready: false,
  });

  useEffect(() => {
    if(update){
      dispatch(event_actions.EVENTS_REQUEST({skip: 0, limit: 0, filters: ""}));
      setUpdate(false);
    }
  }, [update]);

  const handleTaskFormChange = (field, value) => {
    setTaskFormData({
      ...taskFormData,
      [field]: value,
    });
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
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      ready: false,
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
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      ready: false,
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
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        ready: false,
      });
      setIsTaskModalOpen(false);
    }
    setUpdate(true);
  };

  const handleEventFormChange = (field, value) => {
    setEventFormData({
      ...eventFormData,
      [field]: value,
    });
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
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      desc: '',
    });
    setIsEventModalOpen(false);
    setUpdate(true);
  };

  const handleEditEvent = () => {
      dispatch(event_actions.EVENTS_CREATE_REQUEST({
      
      }));
      setEventFormData({
        name: '',
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
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
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        desc: '',
      });
      setIsEventModalOpen(false);
    }
    setUpdate(true);
  };

  const handleDrawerOpen = (day) => {
    setSelectedDay(day);
    setDrawerOpen(true);
    setSelectedEvent(null);
    setUpdate(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedEvent(null);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const handleEventClick = (event, day) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
    setSelectedDay(day);
  };

  const daysInMonth = useMemo(() => {
    if (view === 'month') {
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
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
    return events.filter((event) => isSameDay(parseISO(event.date), selectedDay));
  }, [events, selectedDay]);

  useEffect(() => {
    if (selectedEvent) {
      const updatedSelectedEvent = events.find((e) => e.id === selectedEvent.id);
      setSelectedEvent(updatedSelectedEvent);
    }
  }, [events, selectedEvent]);
  
  return (
    <Grid container>
      <Grid
        item={"true"}
        xs={12}
        md={drawerOpen ? 9 : 12}
        sx={{
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(drawerOpen && {
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
              style={{ width: 40 }}
              onClick={() => handleDateChange(subMonths(currentDate, 1))}
            >
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2 }}>
              {format(currentDate, 'MMMM, yyyy', { locale: ptBR })}
            </Typography>
            <IconButton
              style={{ width: 40 }}
              onClick={() => handleDateChange(addMonths(currentDate, 1))}
            >
              <ChevronRight />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />

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

          </CalendarHeader>
          <CalendarGrid view={view}>
            {daysInMonth.map((day) => (
              <CalendarDay
                key={day.toString()}
                isCurrentMonth={isSameMonth(day, currentDate)}
                isToday={isSameDay(day, new Date())}
                onClick={() => handleDrawerOpen(day)}
              >
                <CalendarDayLabel>{format(day, 'd')}</CalendarDayLabel>
                <Box sx={{overflow: 'hidden', width: '100%' }}>
                  {events
                    .filter((event) => isSameDay(parseISO(event.date), day))
                    .map((event) => (
                      <Box
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event, day);
                        }}
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          padding: 0.5,
                          marginBottom: 0.5,
                          borderRadius: 1,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            opacity: 0.8
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
      <Grid item="true" xs={12} md={3}>
        <StyledDrawer variant="persistent" anchor="right" open={drawerOpen}>
            <DrawerHeader>
                <Typography variant='h6' sx={{marginRight: 'auto'}}>
                    {selectedDay && format(selectedDay, 'dd MMMM, yyyy', { locale: ptBR })}
                </Typography>
                <IconButton style={{ width: 40 }} onClick={handleDrawerClose}>
                <ChevronRight />
                </IconButton>
            </DrawerHeader>
            <Divider />
            {selectedEvent ? (
                <Box p={2}>
                    <Typography variant="h6">Tarefas - {selectedEvent.name}</Typography>
                    <List dense>
                        {selectedEvent.tasks.map((  task) => (
                            <ListItem key={task.id}
                                secondaryAction={
                                  <>
                                    <IconButton style={{ width: 40 }} edge="end" aria-label="update" onClick={(e) => {
                                        setTaskFormData(task);
                                        setIsTaskModalOpen(true);
                                      }}>
                                        <UpdateRounded />
                                    </IconButton>
                                    <IconButton style={{ width: 40 }} edge="end" aria-label="delete" onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(task.id);
                                      }}>
                                        <Delete />
                                    </IconButton>
                                  </>
                                }
                            >
                                <IconButton style={{ width: 40 }} onClick={() => {
                                    dispatch(task_actions.TASKS_UPDATE_REQUEST({...task, ready: !task.ready}));
                                    setUpdate(true);
                                }}>
                                    {task.ready ? <CheckCircleOutline /> : <RadioButtonUnchecked />}
                                </IconButton>
                                <ListItemText primary={task.name} secondary={task.desc} />
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
                              date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                              ready: false,
                            });
                            setIsTaskModalOpen(true);
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
                          style={{marginLeft: 3}}
                      >
                        Voltar
                      </Button>
                    </Box>

                    <Dialog open={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
                        <DialogTitle>{taskFormData.id ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
                        <DialogContent>
                            <TextFieldStyled
                                autoFocus
                                margin="dense"
                                label="Nome da Tarefa"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={taskFormData.name}
                                onChange={(e) => handleTaskFormChange('name', e.target.value)}
                            />
                            <TextFieldStyled
                                margin="dense"
                                label="Descrição"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={taskFormData.desc}
                                onChange={(e) => handleTaskFormChange('desc', e.target.value)}
                            />
                            <TextFieldStyled
                                margin="dense"
                                label="Data"
                                type="datetime-local"
                                fullWidth
                                variant="standard"
                                value={taskFormData.date}
                                onChange={(e) => handleTaskFormChange('date', e.target.value)}
                                slotProps={{
                                  inputLabel: {
                                    shrink: true,
                                  }
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsTaskModalOpen(false)}>Cancelar</Button>
                            <Button onClick={taskFormData.id ? handleEditTask : handleCreateTask}>
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
                                      <IconButton style={{ width: 40 }} edge="end" aria-label="update" onClick={(e) => {
                                          e.stopPropagation();
                                          setEventFormData(event);
                                          setIsEventModalOpen(true);
                                        }}>
                                          <Update />
                                      </IconButton>
                                      <IconButton style={{ width: 40 }} edge="end" aria-label="delete" onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteEvent(event.id);
                                        }}>
                                          <Delete />
                                      </IconButton>
                                    </>
                                }
                            >
                                <ListItemText
                                    primary={event.name}
                                    secondary={
                                        <>
                                            {format(parseISO(event.date), "HH:mm", { locale: ptBR })}
                                            {event.desc && ` - ${event.desc}`}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </EventList>

                    <Dialog open={isEventModalOpen} onClose={() => setIsEventModalOpen(false)}>
                        <DialogTitle>{eventFormData.id ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
                        <DialogContent>
                            <TextFieldStyled
                                autoFocus
                                margin="dense"
                                label="Nome do Evento"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={eventFormData.name}
                                onChange={(e) => handleEventFormChange('name', e.target.value)}
                            />
                            <TextFieldStyled
                                margin="dense"
                                label="Descrição"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={eventFormData.desc}
                                onChange={(e) => handleEventFormChange('desc', e.target.value)}
                            />
                            <TextFieldStyled
                                margin="dense"
                                label="Data"
                                type="datetime-local"
                                fullWidth
                                variant="standard"
                                value={format(new Date(eventFormData.date), "yyyy-MM-dd'T'HH:mm")}
                                onChange={(e) => handleEventFormChange('date', e.target.value)}
                                slotProps={{
                                    input: {
                                      shrink: true,
                                  }
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsEventModalOpen(false)}>Cancelar</Button>
                            <Button onClick={eventFormData.id ? handleEditEvent : handleCreateEvent}>
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
                            ? format(selectedDay, "yyyy-MM-dd'T'HH:mm")
                            : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                          desc: '',
                        });
                        setIsEventModalOpen(true);
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
};

export default CalendarPage;