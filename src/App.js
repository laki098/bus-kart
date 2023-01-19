import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import loginComponent from './components/login/login.component';

function App() {
  /* const getUsers = async () => {
    return await fetch("http://localhost:5000/korisnici");
  }
  let [users, setUsers]=useState([]);
  getUsers().then((response)=>response.json().then((users)=>{setUsers(users)})) */
  return (
    /* users &&
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {users.map((user)=>{
          return <>
          <p>{user["ime"]}</p>
          <p>{user["prezime"]}</p>
          </>
        })}
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div> */

    loginComponent()

    
    
  );
}

export default App;
