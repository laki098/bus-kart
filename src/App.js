import './App.css';
import LoginComponent from './components/login/login.component';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/NavBar/navbar';
import Pocetna from './components/NavBar/links/Pocetna';
import Rezervacija from './components/rezervacija/Rezervacija';
import UpisiRedVoznje from './components/prevoznik/UpisiRedVoznje';




function App() {

  return (<>
    <div className='header'>
      {/* <Router>
      <Navbar />
      <Switch>
        <Route path="links/pocetna">
          <Pocetna /> 
        </Route>
        <Route path='login.component'>
          <LoginComponent />
        </Route>
      </Switch>
      </Router> */}
    </div>
   <div className='main'>
   <UpisiRedVoznje/>
   <Rezervacija/>
    </div>
    <div className='footer'>
    
    
    </div>
  </>
  );
}

export default App;
