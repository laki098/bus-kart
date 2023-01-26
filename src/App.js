
import './App.css';
import LoginComponent from './components/login/login.component';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/NavBar/navbar';
import Pocetna from './components/NavBar/links/Pocetna';



function App() {

  return (<>
  <Router>
    <div className='header'>
      
      <Navbar />
        
      
    </div>
   <div className='main'>
   <Switch>
          <Route path="links/pocetna">
            <Pocetna /> 
          </Route>
          <Route path='/login.component'>
            <LoginComponent />
          </Route>
        </Switch>
    </div>
    <div className='footer'>
    
    </div>
    </Router>
  </>
  );
}

export default App;
