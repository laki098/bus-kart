import React from 'react';
import './main.css';
import { Link } from 'react-router-dom';




const Navbar = () => {

  
  

    return (
      <nav className="navbar">
        <Link to='/pocetna' className='logo'><i className="fa fa-bus"></i></Link>
        
        <ul className='nav-menu'>
          <li><Link to='/pocetna'><i className='fa-solid fa-house-user nav-links'>Pocetna</i></Link></li>
          <li><Link to='/informacije'><i className='fa-solid fa-circle-info nav-links'></i>Informacije</Link></li>
          <li><Link to='/rezervacijakarte'><i className='fa fa-ticket nav-links'></i>Rezervacija Karte</Link></li>
          <li><Link to='/kontakt'><i className='fa-solid fa-address-book nav-links'></i>Kontakt</Link></li>
          <li><Link to='/login.component'><i className='fa fa-user-circle nav-links'></i>Prijavi se</Link></li>
          </ul>
      </nav>

     
    );
  }
   
  export default Navbar;