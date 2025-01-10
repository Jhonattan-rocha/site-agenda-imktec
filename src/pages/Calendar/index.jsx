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
  Fab
} from '@mui/material';
import {
  CalendarToday,
  ViewWeek,
  ChevronLeft,
  ChevronRight,
  MoreVert,
  Add,
  Delete,
  CheckCircleOutline,
  RadioButtonUnchecked,
  Update,
  BackHand,
  ArrowLeft
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

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
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

  const handleTaskFormChange = (field, value) => {
    setTaskFormData({
      ...taskFormData,
      [field]: value,
    });
  };

  const handleCreateTask = () => {
    const newTask = {
      ...taskFormData,
      id: Math.max(...selectedEvent.tasks.map((t) => t.id), 0) + 1,
      event_id: selectedEvent.id,
    };
    setEvents((prevEvents) => {
      return prevEvents.map((event) => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            tasks: [...event.tasks, newTask],
          };
        }
        return event;
      });
    });
    setTaskFormData({
      name: '',
      desc: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      ready: false,
    });
    setIsTaskModalOpen(false);
  };

  const handleEditTask = () => {
    setEvents((prevEvents) => {
      return prevEvents.map((event) => {
        if (event.id === selectedEvent.id) {
          const updatedTasks = event.tasks.map((task) =>
            task.id === taskFormData.id ? { ...task, ...taskFormData } : task
          );
          return { ...event, tasks: updatedTasks };
        }
        return event;
      });
    });
    setTaskFormData({
      name: '',
      desc: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      ready: false,
    });
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    setEvents((prevEvents) => {
      return prevEvents.map((event) => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            tasks: event.tasks.filter((task) => task.id !== taskId),
          };
        }
        return event;
      });
    });
    if (taskFormData.id === taskId) {
      setTaskFormData({
        name: '',
        desc: '',
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        ready: false,
      });
      setIsTaskModalOpen(false);
    }
  };

  const handleEventFormChange = (field, value) => {
    setEventFormData({
      ...eventFormData,
      [field]: value,
    });
  };

  const handleCreateEvent = () => {
    const newEvent = {
      ...eventFormData,
      id: Math.max(...events.map((e) => e.id), 0) + 1,
      user_id: 1, // Defina o user_id conforme necessário
      tasks: [],
      date: new Date(eventFormData.date).toISOString(),
    };
    setEvents([...events, newEvent]);
    setEventFormData({
      name: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      desc: '',
    });
    setIsEventModalOpen(false);
  };

  const handleEditEvent = () => {
    const updatedEvents = events.map((event) =>
      event.id === eventFormData.id
        ? { ...event, ...eventFormData, date: new Date(eventFormData.date).toISOString() }
        : event
    );
    setEvents(updatedEvents);
    setEventFormData({
      name: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      desc: '',
    });
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
    if (eventFormData.id === eventId) {
      setEventFormData({
        name: '',
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        desc: '',
      });
      setIsEventModalOpen(false);
    }
  };

  const handleDrawerOpen = (day) => {
    setSelectedDay(day);
    setDrawerOpen(true);
    setSelectedEvent(null);
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
    if (view === 'week') {
      const weekStart = startOfWeek(date, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
      console.log('Início da semana: ', format(weekStart, 'dd/MM/yyyy'));
      console.log('Fim da semana: ', format(weekEnd, 'dd/MM/yyyy'));
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
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
        item
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
                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                  {events
                    .filter((event) => isSameDay(parseISO(event.date), day))
                    .map((event) => (
                      <Box
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
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
                          }
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
      <Grid item xs={12} md={3}>
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
                        {selectedEvent.tasks.map((task) => (
                            <ListItem key={task.id}
                                secondaryAction={
                                    <IconButton style={{ width: 40 }} edge="end" aria-label="delete" onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(task.id);
                                      }}>
                                        <Delete />
                                    </IconButton>
                                }
                            >
                                <IconButton style={{ width: 40 }} onClick={() => {
                                    setTaskFormData(task);
                                    setIsTaskModalOpen(true);
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
                            setSelectedEvent({})
                          }}
                          style={{marginLeft: 3}}
                      >
                        Voltar
                      </Button>
                    </Box>

                    <Dialog open={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
                        <DialogTitle>{taskFormData.id ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nome da Tarefa"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={taskFormData.name}
                                onChange={(e) => handleTaskFormChange('name', e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Descrição"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={taskFormData.desc}
                                onChange={(e) => handleTaskFormChange('desc', e.target.value)}
                            />
                            <TextField
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
                                button
                                onClick={() => {
                                    setSelectedEvent(event);
                                }}
                                secondaryAction={
                                    <>
                                      <IconButton style={{ width: 40 }} edge="end" aria-label="delete" onClick={(e) => {
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
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nome do Evento"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={eventFormData.name}
                                onChange={(e) => handleEventFormChange('name', e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Descrição"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={eventFormData.desc}
                                onChange={(e) => handleEventFormChange('desc', e.target.value)}
                            />
                            <TextField
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