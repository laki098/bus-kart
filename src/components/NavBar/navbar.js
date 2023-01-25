import { Link } from 'react-router-dom';
import img1 from '../images/eurocompass.png'

const Navbar = () => {
    return (
      <nav className="navbar">
        <img src={img1}></img>
        <div className="links">
          <Link to ="/">Pocetna</Link>
          <Link to ="/informacije">informacije</Link>
          <Link to ="/kontakt">Kontakt</Link>
          <Link to ="/rezervacijakarte">Rezervacija Karte</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
    );
  }
   
  export default Navbar;