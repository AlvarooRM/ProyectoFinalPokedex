// src/components/LoginModal.jsx
import React, { useState } from 'react';

const LoginModal = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await fetch('http://localhost/pokedex/login.php', { // Cambia 'myapp' por el nombre real de tu carpeta
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password }),
    });
    const data = await response.json();
    if (data.success) {
      setIsAuthenticated(true);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Iniciar Sesión</h2>
        <input 
          type="text" 
          placeholder="Usuario" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={handleLogin}>Iniciar Sesión</button>
      </div>
    </div>
  );
};

export default LoginModal;
