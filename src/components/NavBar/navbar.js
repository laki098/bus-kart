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

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuEnter = () => {
    setMenuOpen(true);
  };

  const handleMenuLeave = () => {
    setMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // kada korisnik pretisne dugme logout izloguje se i strana se refresuje
  const clickBaitLogout = () => {
    loginApi()
      .logout()
      .then(() => {
        window.location.href = "pocetna";
      });
  };

  //? izvlacenje korisnika iz cookisa
  let userData = cookies.get("userData");
  let userPars = {};

  //? pitamo ga da li je prijvljen, ako nije da ne odradi to parsiranje u json.
  if (userData != undefined) {
    userPars = JSON.parse(userData);
  }
  const renderLink = (role, path, text) => {
    return userPars.rola === role ? (
      <li className="item-li">
        <Link to={path}>
          <i className="fa-solid fa-users nav-links"></i>
          {text}
        </Link>
      </li>
    ) : (
      ""
    );
  };

  return (
    <nav className="navbar ">
      {/*  <Link to='/pocetna' className='logo'><img src={logo} alt='logo' className='logosajt'/></Link>      */}

      <Link to="/pocetna" className="logo">
        <img src={logo} alt="logo" className="logosajt" />
      </Link>

      <ul
        className={isMobile ? "nav-links-mobile" : "nav-menu"}
        onClick={() => setIsMobile(false)}
      >
        {renderLink("admin", "/adminpanel", "Admin panel")}
        {renderLink("stjuardesa", "/stjuardesa", "Čekiranje")}
        {renderLink("biletar", "/biletar", "Rezervacija karata")}

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
        <div className="logins">
          {Object.keys(userPars).length === 0 ? (
            <li>
              <Link to="/login.component">
                <i className="fa fa-user-circle nav-links item-lii"></i>Prijavi
                se
              </Link>
            </li>
          ) : (
            <>
              {/* <div
                className="menu"
                onClick={() => setMenuOpen(!menuOpen)}
              ></div> */}
              <ul className={menuOpen ? "open" : ""}>
                <li
                  className="item-lii "
                  onClick={handleMenuEnter}
                  onMouseLeave={handleMenuLeave}
                >
                  {/* stavi sta hoces samo ne LINK!!!  umesto ovog diva ispod*/}
                  <div onClick={toggleDropdown}>
                    <i className="fa fa-user-circle nav-links"></i>
                    {userPars.ime}
                  </div>
                  {isDropdownOpen && (
                    <ul className="dropdown" onMouseLeave={handleMenuLeave}>
                      <li className="dropdown-item item-li">
                        <Link to="/korisnik">
                          <i className="fa-regular fa-user nav-links "></i>
                          <li className="item-li">Profil</li>
                        </Link>
                      </li>
                      <li className="dropdown-item item-li">
                        <Link to="/karta">
                          <i className="fa-solid fa-ticket nav-links "></i>
                          <li className="item-li">Karte</li>
                        </Link>
                      </li>
                      <li className="dropdown-item item-li">
                        {/* stavi sta hoces samo ne LINK!!! umesto ovog diva ispod*/}
                        <div className="test-dropdown">
                          <p onClick={clickBaitLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket nav-links "></i>
                            Logout
                          </p>
                        </div>
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
