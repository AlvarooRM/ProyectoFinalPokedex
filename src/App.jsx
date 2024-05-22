import { useState } from 'react';
import { AppRouter } from './AppRouter';
import { PokemonProvider } from './context/PokemonProvider';
import LoginModal from './components/LoginModal';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
