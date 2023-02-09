import React, { useState, useEffect } from 'react'
import LinijeApi from '../../../api/linije.api';
import './pocetna.css';
import helpers from '../../../helpers/helpers';

const Pocetna = () => {
  const [filteredLinije, setFilteredLinije] = useState([])
  const [valueDate, setValueDate] = useState('');
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [polasci, setPolasci] = useState([])
  const [dolasci, setDolasci] = useState([])
  const [linije, setLinije] = useState([])

  const filterLinija = async() => {
    if (!valueDate) return
   
    const response = await LinijeApi().filterLinija(val1,val2, valueDate)
    const data = await response.json()
    setFilteredLinije(data);
  }

  const getLinije = async () => {
    const response = await fetch("http://localhost:5000/linije/linija");
    const data = await response.json();
    const mestaPolaska = data.map(item => item.mestoPolaska).filter(helpers.filterUnique)
    const mestaDolaska = data.map(item => item.mestoDolaska).filter(helpers.filterUnique)

    setLinije(data)
    setPolasci(mestaPolaska)
    setDolasci(mestaDolaska)
    setVal1(data[0].mestoPolaska)
    setVal2(data[0].mestoDolaska)
  }

  useEffect(()=> {
    getLinije();
  }, [])

  const click = () => {
    //ovde mozes upit da napravis da li se val 1 sadrzi u dolasci
    // i da li se val 2 sadrzi u polasci
    // primer polasci.includes(val2)
    
    if (!polasci.includes(val2) || !dolasci.includes(val1)) {
      return;
    }
    
    setVal1(val2)
    setVal2(val1)
  }

  return (
    <div>
        <select className='input' value={val1} onChange={(e) => setVal1(e.target.value)}>
          {polasci.map(linija => {
            return <option key={linija} value={linija}>{linija}</option>
          })} 
        </select>
        <button className='fa-solid fa-repeat buttonSwitch  ' onClick={click}></button>
        <select className='input' value={val2} onChange={(e) => setVal2(e.target.value)}>
          {dolasci.map(linija => {
            return <option key={linija} value={linija}>{linija}</option>
          })}
        
        
          
        </select>
        <label >Datum polaska</label>
        <input type='date' value={valueDate} onChange= {(e) => setValueDate(e.target.value)} />
        <button onClick={filterLinija}>Red voznje</button>

        <div>
          <ul>
          {filteredLinije.map(linija => {
            return <li key={linija.id}>
              vreme polaska: {linija.vremePolaska},
              vreme dolaska: {linija.vremeDolaska},
              prevoznik: {linija.prevoznik},
              mesto polaska: {linija.mestoPolaska},
              mesto dolaska: {linija.mestoDolaska}
              <button>rezervisi</button>
            </li>
          })}
          
          </ul>
        </div>
    </div>
  )
}

export default Pocetna
