import React from 'react'
import PromenaPasworda from '../../prevoznik/PromenaPasworda';
import ResetPasworda from '../../prevoznik/ResetPasworda';
import UpisiRedVoznje from '../../prevoznik/UpisiRedVoznje';
import Rezervacija from '../../rezervacija/Rezervacija';
import Rezervacija_1 from '../../rezervacija/Rezervacija_1';
import ResetLozinke from '../../prevoznik/ResetLozinke';
import Email from '../../prevoznik/Email';
import Email_1 from '../../prevoznik/Email_1';
import Pretraga from '../../rezervacija/Pretraga';
import UpisPolazaka from '../../prevoznik/UpisPolazaka';
import Login from '../../prevoznik/Login';



const Pocetna = () => {
  return (
    <div>
      
       <Pretraga/>   
       <UpisPolazaka/>
       <br/><br/><br/><br/>
       <Login />
    </div>
  )
}

export default Pocetna
