import React from "react";
/* import { Link } from 'react-router-dom'; */

import "./footer.css";


const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="footer-col">
            <h4>Prevoz putnika</h4>
            <ul>
              <li className="footer-li">Red vožnje</li>
              <li className="footer-li">Rezervacija karata</li>
              <li className="footer-li">Popusti</li>
              <li className="footer-li">Prodajna mesta</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Prava putnika</h4>
            <ul>
              <li className="footer-li">Otkazivanje karte</li>
              <li className="footer-li">Povlastice za invalide</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Usluge</h4>
            <ul>
              <li className="footer-li">Iznajmljivanje vozila</li>
              <li className="footer-li">Popravka vozila</li>
              <lli className="footer-li"i>Slanje pošiljki</lli>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Pratite nas</h4>
            <div className="social-links ">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://rs.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
        </div>
        <hr />
       
        <div className="data">
          <p className="logo-footer">EUROCOMPASS</p>
          <p className="p-footer">Eurocompass postoji od (možemo da stavimo godinu ovde) godine. Osnovna delatnost preduzeća je prevoz putnika gradskim, međugradskim i međunarodnim linijama.</p>
        </div>
       
      </div>
    </div>
  );
};

export default Footer;
