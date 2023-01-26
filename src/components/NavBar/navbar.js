import React from 'react';
import './main.css';
import { Link } from 'react-router-dom';




const Navbar = () => {

  
  

    return (
      <nav className="navbar">
        <h1 className='logo'>React<i className="fa fa-bus"></i></h1>
        
        <ul className='nav-menu'>
          <li><Link to='/pocetna'><i className='fa-solid fa-house-user nav-links'></i>Pocetna</Link></li>
          <li><Link to='/'><i className='fa-solid fa-circle-info nav-links'></i>Informacije</Link></li>
          <li><Link to='/'><i className='fa fa-ticket nav-links'></i>Rezervacija Karte</Link></li>
          <li><Link to='/'><i className='fa-solid fa-address-book nav-links'></i>Kontakt</Link></li>
          <li><Link to='/login.component'><i className='fa fa-user-circle nav-links'></i>Prijavi se</Link></li>
          </ul>
      </nav>
    );
  }
   
  export default Navbar;