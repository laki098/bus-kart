import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import LoginComponent from './components/login/login.component';
import RegistrationComponent from './components/registration/registration.component';

function App() {
 
  return (
   <div>
    <LoginComponent />
    <RegistrationComponent />
    </div>
  

  );
}

export default App;
