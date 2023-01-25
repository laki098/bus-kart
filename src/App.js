
import './App.css';
import React, { useState } from 'react';
import LoginComponent from './components/login/login.component';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar/navbar';
import Footer from './components/NavBar/footer';
import RegistrationComponent from './components/registration/registration.component';




function App() {

  return (<>
    <div className='header'>

    </div>
   <div className='main'>
     <LoginComponent />
     <RegistrationComponent />
    </div>
    <div className='footer'>
      
    </div>
  </>
  );
}

export default App;
