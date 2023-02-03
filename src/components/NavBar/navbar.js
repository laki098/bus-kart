import React, { useState } from 'react';
import './main.css';
import { Link } from 'react-router-dom';




const Navbar = () => {

  const [isMobile, setIsMobile] = useState(false);
  

    return (
      <nav className="navbar">
        <Link to='/pocetna' className='logo'><i className="fa fa-bus"></i></Link>
        
        <ul className={isMobile ? "nav-links-mobile" : "nav-menu"}
        onClick={() => setIsMobile(false)}>
          <li><Link to='/pocetna'><i className='fa-solid fa-house-user nav-links'></i>Pocetna</Link></li>
          <li><Link to='/informacije'><i className='fa-solid fa-circle-info nav-links'></i>Informacije</Link></li>
          <li><Link to='/rezervacijakarte'><i className='fa fa-ticket nav-links'></i>Rezervacija Karte</Link></li>
          <li><Link to='/kontakt'><i className='fa-solid fa-address-book nav-links'></i>Kontakt</Link></li>
          <li><Link to='/login.component'><i className='fa fa-user-circle nav-links'></i>Prijavi se</Link></li>
          </ul>
          <button className='mobile-menu-icon'
          onClick={() => setIsMobile(!isMobile)}>
            {isMobile ? (<i className='fas fa-times'></i> ) 
            : (
              <i className='fas fa-bars'></i>
            ) }
          </button>
      </nav>

     
    );
  }
   
  export default Navbar;