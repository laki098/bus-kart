import React from 'react'
import PromenaPasworda from '../../prevoznik/PromenaPasworda';
import ResetPasworda from '../../prevoznik/ResetPasworda';
import UpisiRedVoznje from '../../prevoznik/UpisiRedVoznje';
import Rezervacija from '../../rezervacija/Rezervacija';
import ResetLozinke from '../../prevoznik/ResetLozinke';
import Email from '../../prevoznik/Email';
import Email_1 from '../../prevoznik/Email_1';



const Pocetna = () => {
  return (
    <div>
      <br/><br/><br/><br/><br/><br/>
        <UpisiRedVoznje/>
      {/*  <Email_1/>
        <Email/>
  <ResetLozinke/> */}
        <PromenaPasworda/>
        <ResetPasworda/>
        <Rezervacija/>
    </div>
  )
}

export default Pocetna
