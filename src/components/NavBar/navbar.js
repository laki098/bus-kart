import React, { useState } from "react";
import "./main.css";
import { Link } from "react-router-dom";
import loginApi from "../../api/login.api";
import cookies from "js-cookie";
import logo from "./../images/logo.png";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  //?dropdown za logovanog korisnika
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuEnter = () => {
    setMenuOpen(true);
  };

  const handleMenuLeave = () => {
    setMenuOpen(false);
  };

  // kada korisnik pretisne dugme logout izloguje se i strana se refresuje
  const clickBaitLogout = () => {
    loginApi().logout();
    window.location.reload();
    window.location.href = "pocetna";
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
        <img src={logo} alt="logo" className="logosajt" />
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
        {userPars.rola === "stjuardesa" ? (
          <li>
            <Link to="/stjuardesa">
              <i className="fa-solid fa-users nav-links"></i>Cekiranje
            </Link>
          </li>
        ) : (
          ""
        )}

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
            <>
              <div
                className="menu"
                onClick={() => setMenuOpen(!menuOpen)}
              ></div>
              <ul className={menuOpen ? "open" : ""}>
                <li
                  onMouseEnter={handleMenuEnter}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link on>
                    {" "}
                    <i className="fa fa-user-circle nav-links"></i>
                    {userPars.ime}
                  </Link>
                  {menuOpen && (
                    <ul className="dropdown">
                      <li className="dropdown-item">
                        <Link to="/korisnik">
                          <i className="fa-regular fa-user nav-links "></i>
                          <li>Profil</li>
                        </Link>
                      </li>
                      <li className="dropdown-item">
                        <Link to="/karta">
                          <i className="fa-solid fa-ticket nav-links "></i>
                          <li>Karte</li>
                        </Link>
                      </li>
                      <li className="dropdown-item">
                        <Link>
                          <li onClick={clickBaitLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket nav-links "></i>
                            Logout
                          </li>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </>
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
