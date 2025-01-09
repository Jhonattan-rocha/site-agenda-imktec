import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import {
  CalendarToday,
  ViewWeek,
  ChevronLeft,
  ChevronRight,
  MoreVert,
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
  addWeeks,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Estilos para o Calendário
const CalendarContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%'
}));

const CalendarHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CalendarGrid = styled('div')(({ theme, view }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gridTemplateRows: view === 'month' ? 'repeat(6, 1fr)' : 'repeat(1, 1fr)', // 6 linhas para o mês, 1 para a semana
  gap: theme.spacing(0),
  padding: theme.spacing(2),
  flexGrow: 1,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  overflow: 'hidden',
  height: '75vh'
}));

const CalendarDay = styled('div')(({ theme, isCurrentMonth, isToday }) => ({
  backgroundColor: isToday
    ? theme.palette.primary.light
    : isCurrentMonth
    ? theme.palette.background.paper
    : theme.palette.grey[200],
  color: isToday
    ? theme.palette.primary.contrastText
    : theme.palette.text.secondary,
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
  overflow: 'hidden', // Esconde conteúdo que ultrapassa os limites do dia
}));

const CalendarDayLabel = styled('span')(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  width: '100%', // Faz a label ocupar toda a largura
  display: 'flex',
  justifyContent: 'center', // Centraliza a label
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
const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    boxShadow: theme.shadows[2],
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
    if (view === 'week'){
        const weekStart = startOfWeek(date, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
        console.log("Início da semana: ", format(weekStart, 'dd/MM/yyyy'));
        console.log("Fim da semana: ", format(weekEnd, 'dd/MM/yyyy'));
    }
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
          height: '100%'
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
            <IconButton
              onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}
              sx={{ ml: 2, width: 40 }}
            >
              <MoreVert />
            </IconButton>
          </CalendarHeader>
          <CalendarGrid view={view}>
            {daysInMonth.map((day) => (
              <CalendarDay
                key={day.toString()}
                isCurrentMonth={isSameMonth(day, currentDate)}
                isToday={isSameDay(day, new Date())}
                onClick={() => {
                    handleDateChange(day);
                  console.log('Abrir detalhes do dia:', day);
                }}
              >
                <CalendarDayLabel>{format(day, 'd')}</CalendarDayLabel>
                {/* Outros conteúdos do dia podem ser adicionados aqui */}
              </CalendarDay>
            ))}
          </CalendarGrid>
        </CalendarContainer>
      </Grid>
      <Grid item xs={12} md={3}>
        <StyledDrawer variant="persistent" anchor="right" open={drawerOpen}>
          <DrawerHeader>
            <IconButton style={{ width: 40 }} onClick={handleDrawerClose}>
              <ChevronRight />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Box p={2}>
            <TextField
              label="Campo de Texto"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Outro Campo"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>
        </StyledDrawer>
      </Grid>
    </Grid>
  );
};

export default CalendarPage;