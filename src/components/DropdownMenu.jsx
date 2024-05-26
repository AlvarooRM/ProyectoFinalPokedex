import React from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = () => {
  return (
    <div className="dropdown">
      <button className="dropbtn">Menu</button>
      <div className="dropdown-content">
        <Link to="/my-team">Mi Equipo</Link>
        <Link to="/comparator">Comparador</Link>
      </div>
    </div>
  );
};

export default DropdownMenu;
