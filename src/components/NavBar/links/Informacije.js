import React from 'react';

import Pretraga from '../../rezervacija/Pretraga';
import UpisPolazaka from '../../prevoznik/UpisPolazaka';
import Login from '../../prevoznik/Login';

const informacije = () => {
  return (
    <div>
       <Pretraga/>   
       <UpisPolazaka/>
       <br/><br/>
       <Login />
       <br/><br/>
    </div>
  )
}

export default informacije
