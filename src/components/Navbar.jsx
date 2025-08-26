import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav>
      <Link to="/">Inicio</Link>
      {!user && <><Link to="/inicio-sesion">Login</Link><Link to="/registro">Registro</Link></>}
      {user && <>
        <Link to="/productos">Productos</Link>
        <Link to="/usuarios">Usuarios</Link>
        <span style={{marginLeft:8, marginRight:8}}>
          <b>{user.nombre}</b>
          <span style={{
            background: user.rol === 'admin' ? '#673ab7' : user.rol === 'moderador' ? '#2196f3' : '#4caf50',
            color: 'white',
            borderRadius: '8px',
            padding: '2px 8px',
            marginLeft: '6px',
            fontSize: '0.85em',
            fontWeight: 600
          }}>{user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}</span>
        </span>
        <button onClick={logout}>Logout</button>
      </>}
      {user && user.rol === 'admin' && <Link to="/usuarios">Panel Admin</Link>}
    </nav>
  );
};

export default Navbar;
