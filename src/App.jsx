import axios from 'axios';
axios.defaults.withCredentials = true;

import { useState, useEffect } from 'react';
import { AppRouter } from './AppRouter';
import { PokemonProvider } from './context/PokemonProvider';
import LoginModal from './components/LoginModal';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('/check-session.php')
      .then(response => {
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(error => {
        console.error("Error al verificar la sesión: ", error);
      });
  }, []);

  return (
    <PokemonProvider>
      <div className="app-container">
        <div className={`content ${isAuthenticated ? '' : 'blurred'}`}>
          <AppRouter />
        </div>
        {!isAuthenticated && <LoginModal setIsAuthenticated={setIsAuthenticated} />}
      </div>
    </PokemonProvider>
  );
}

export default App;
