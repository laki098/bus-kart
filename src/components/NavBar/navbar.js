import React, { useState, useEffect } from "react";
import "./main.css";
import { Link } from "react-router-dom";
import loginApi from "../../api/login.api";
import cookies from "js-cookie";
import logo from "./../images/logo.png";
import logo1 from "./../images/eurocompass.png";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  //?dropdown za logovanog korisnika
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  let userData = cookies.get("userData");
  let userPars = {};

  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }

  return (
    <nav className="navbar">
      {/*  <Link to='/pocetna' className='logo'><img src={logo} alt='logo' className='logosajt'/></Link>      */}

      <Link to="/pocetna" className="logo">
        <img src={logo1} alt="logo" className="logosajt" />
      </Link>

      <ul
        className={isMobile ? "nav-links-mobile" : "nav-menu"}
        onClick={() => setIsMobile(false)}
      >
        <li>
          {userPars.rola === "admin" ? (
            <Link to="/adminpanel">
              <i className="fa-solid fa-users nav-links"></i>Admin panel
            </Link>
          ) : (
            <p></p>
          )}
        </li>
        <li>
          <Link to="/pocetna">
            <i className="fa-solid fa-house-user nav-links"></i>Početna
          </Link>
        </li>
        <li>
          <Link to="/kontakt">
            <i className="fa-solid fa-address-book nav-links"></i>Kontakt
          </Link>
        </li>
        <div>
          {Object.keys(userPars).length === 0 ? (
            <li>
              <Link to="/login.component">
                <i className="fa fa-user-circle nav-links"></i>Prijavi se
              </Link>
            </li>
          ) : (
            <li>
              <button onClick={toggleDropdown}>
                <p>Ime: {userPars.ime}</p>
              </button>
              {isDropdownOpen && (
                <ul className="dropdown">
                  <li>Profil</li>
                  <li>Postavke</li>
                  <button onClick={loginApi().logout}>Logout</button>
                </ul>
              )}
            </li>
          )}
        </div>
      </ul>
      <button
        className="mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}
      >
        {isMobile ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-bars"></i>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
