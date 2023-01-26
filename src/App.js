import './App.css';
//import Biraj from './Biraj';
//import React, { useState } from 'react';
import LoginComponent from './components/login/login.component';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import NavBar from './components/NavBar/navbar';
import Footer from './components/NavBar/footer';
import RegistrationComponent from './components/registration/registration.component';
import Header from './Header';
import Home from './Home';
import Rezervacija from './components/rezervacija/Rezervacija.js';
import Sediste from './components/rezervacija/Sediste';




function App() {

  return (<>
    <div className='header'>

    </div>
   <div className='main'>
     <LoginComponent />
     <RegistrationComponent />
     <Rezervacija/>
     
    </div>
    <div className='footer'>
      
    </div>
  </>
  );
}

export default App;
