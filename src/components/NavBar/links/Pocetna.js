import React, { useState, useEffect } from 'react'
import LinijeApi from '../../../api/linije.api';
import './pocetna.css';

const Pocetna = () => {
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [linije, setLinije] = useState([])

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
        <select className='input' value={val1} onChange={(e) => {setVal1(e.target.value)}}>
          {linije.map(linija => {
            return <option key={linija.id} value={linija.mestoPolaska}>{linija.mestoPolaska}</option>
          })} 
        </select>
        <button className='fa-solid fa-repeat buttonSwitch  ' onClick={click}></button>
        <select className='input' value={val2} onChange={(e) => {setVal2(e.target.value)}}>
          {linije.map(linija => {
            return <option key={linija.id} value={linija.mestoDolaska}>{linija.mestoDolaska}</option>
          })}
          
        </select>
    </div>
  )
}

export default Pocetna
