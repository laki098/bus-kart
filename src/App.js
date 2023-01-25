//import logo from './logo.svg';
import './App.css';
//import Biraj from './Biraj';
//import React, { useState } from 'react';
import LoginComponent from './components/login/login.component';
import RegistrationComponent from './components/registration/registration.component';
import Header from './Header';
import Home from './Home';
import Rezervacija from './components/rezervacija/Rezervacija.js';

function App() {
 
  return (
   <div>
    <Header/>
   {/* <LoginComponent />
    <RegistrationComponent />
  
    <Home/>   */}
    <Rezervacija/>
    </div>
  

  );
}

export default App;
