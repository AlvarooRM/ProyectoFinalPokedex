import React, { useState } from 'react';
import pikachu from '../assets/pikachu.png';
import ash from '../assets/ash.png';
import misty from '../assets/misty.png';

const RegisterModal = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sexo, setSexo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !sexo) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    const response = await fetch('http://localhost/pokedex/register.php', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password, sexo }),
    });

    try {
      const data = await response.json();
      if (data.success) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        onClose();
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
      handleRegister();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          <img src={pikachu} alt="Pikachu" className="icon" />
          Regístrate
          <img src={pikachu} alt="Pikachu" className="icon" />
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
        <div className="character-selection">
          <p>¿Quién eres?</p>
          <div className="characters">
            <div 
              className={`character ${sexo === '1' ? 'selected' : ''}`} 
              onClick={() => setSexo('1')}
            >
              <img src={ash} alt="Ash" />
            </div>
            <div 
              className={`character ${sexo === '2' ? 'selected' : ''}`} 
              onClick={() => setSexo('2')}
            >
              <img src={misty} alt="Misty" />
            </div>
          </div>
        </div>
        <button onClick={handleRegister}>Registrarse</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default RegisterModal;
