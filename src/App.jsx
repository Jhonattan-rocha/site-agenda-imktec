import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppThemeProvider } from './styles/AppThemeProvider';
import store, {persistor} from './store';
import Home from './pages/Main';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <AppThemeProvider>
            <GlobalStyle></GlobalStyle>
            <Home />
            <ToastContainer autoClose={4000}  className="toastcontainer"/>
          </AppThemeProvider>
        </BrowserRouter>   
      </PersistGate>
    </Provider>
  );
}

export default App;
