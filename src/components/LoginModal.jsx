import React, { useState } from 'react';
import RegisterModal from './RegisterModal';
import pokeball from '../assets/pokeball.png';

const LoginModal = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogin = async () => {
    const response = await fetch('http://localhost/pokedex/login.php', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password }),
    });

    try {
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Error al procesar la respuesta JSON:', error);
      setErrorMessage('Error en la comunicación con el servidor');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>
            <img src={pokeball} alt="Pokeball" className="icon" />
            Iniciar Sesión
            <img src={pokeball} alt="Pokeball" className="icon" />
          </h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input 
            type="text" 
            placeholder="Usuario" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            onKeyPress={handleKeyPress}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleLogin}>Iniciar Sesión</button>
          <p>¿No tienes cuenta? <span className="register-link" onClick={() => setShowRegisterModal(true)}>¡Regístrate ahora!</span></p>
        </div>
      </div>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
};

export default LoginModal;
