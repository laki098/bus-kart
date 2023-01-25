import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import LoginComponent from './components/login/login.component';
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
