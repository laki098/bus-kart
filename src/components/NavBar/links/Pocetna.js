import React, { useState, useEffect } from 'react'
import LinijeApi from '../../../api/linije.api';
import './pocetna.css';

const Pocetna = () => {
  const [filteredLinije, setFilteredLinije] = useState([])
  const [valueDate, setValueDate] = useState('');
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
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
    setLinije(data)
    setVal1(data[0].mestoPolaska)
    setVal2(data[0].mestoDolaska)
  }

  useEffect(()=> {
    getLinije();
  }, [])

  const click = () => {
    
    setVal1(val2)
    setVal2(val1)
  }

  return (
    <div>
        <select className='input' value={val1} onChange={(e) => setVal1(e.target.value)}>
          {linije.map(linija => {
            return <option key={linija.id} value={linija.mestoPolaska}>{linija.mestoPolaska}</option>
            
          })} 
        </select>
        <button className='fa-solid fa-repeat buttonSwitch  ' onClick={click}></button>
        <select className='input' value={val2} onChange={(e) => setVal2(e.target.value)}>
          {linije.map(linija => {
            return <option key={linija.id} value={linija.mestoDolaska}>{linija.mestoDolaska}</option>
          })}
        
        
          
        </select>
        <label >Datum polaska</label>
        <input type='date' value={valueDate} onChange= {(e) => setValueDate(e.target.value)} />
        <button onClick={filterLinija}>Red voznje</button>

        <div>
          <ul>
          {filteredLinije.map(linija => {
            return <li key={linija.id}>
              vreme dolaska: {linija.datumDolaska},
              vreme polaska: {linija.datumPolaska},
              prevoznik: {linija.prevoznik}
            </li>
          })}
          </ul>
        </div>
    </div>
  )
}

export default Pocetna
