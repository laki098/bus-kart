import React from 'react';
import { useState } from 'react';
import './index.css';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 

import DatePicker from "react-datepicker";   
import "react-datepicker/dist/react-datepicker.css";  

const Pretraga = () => {

const [prevoznik, setPrevoznik] = useState('Eurocompass');
const [polaznaStanica, setPolaznastanica]=useState('');
const [dolaznaStanica, setDolaznastanica]=useState('');
const [vrstakarte, setVrstakarte]=useState('Jednosmerna');
const [value, setValue] = useState(new Date());
const [putnik, setPutnik] = useState('Odrasli');
const [startDate, setStartDate] = useState(new Date());  
 


  return (
    <div className='kutija'>
    <br/><br/>
    <div className='box_3'>
    <table className="table">
                    <tr> 
                        <td><label>Odaberite prevoznika</label></td>
                        <td><label >Polazna stanica</label></td>
                        <td><label>Dolazna stanica</label></td>
                        <td><label>Datum polaska</label></td>    
                                    
                        <td >&nbsp;</td>
                    </tr>
                    <tr className="inputText">
                        <td>  <select className="inputText"
                            value={prevoznik}
                            onChange={(e) => setPrevoznik(e.target.value)}
                            >
                            <option value="Nišekspres">Nišekspres</option>
                            <option value="Lasta">Lasta</option>
                            <option value="Kanin">Kanin</option>
                            <option value="Eurocompass">Eurocompass</option>
                            <option value="Jeremić prevoz">Jeremić prevoz</option>
                        </select></td>

                        <td ><input  type="text" name="polaznast" className="inputText" value={polaznaStanica} onChange={(e) => setPolaznastanica(e.target.value)}/></td>
                        <td><input type="text" name="dolaznast" className="inputText" value={dolaznaStanica} onChange={(e) => setDolaznastanica(e.target.value)}/></td>
                        <td>
                            <DatePicker className="inputText" selected={startDate} value={value} onChange={(date) =>   
                            setStartDate(date)} />  
                        </td>    
                        <td><button className='button-43'>Traži </button> </td>
                        
                    </tr>
    </table> 

                    <hr/>  
    <p className='tekst'>Polasci &emsp; <b>{prevoznik} </b> :&emsp;  <b>{polaznaStanica} </b>&ensp; - &ensp; <b> {dolaznaStanica} </b> &ensp;za  &ensp; {}  &ensp; su:</p>
    <table className='table'>
        
        <tr>
        <td className="inputText"><label >Vreme polaska</label></td>
        <td><label >Vreme dolaska</label></td>
        <td><label >Vrsta karte</label></td>
        <td><label >Putnik</label></td>
        <td>&nbsp;</td> 
        <td>&nbsp;</td>  
        </tr>

        <tr >
        <td><input className="inputText" type="time" placeholder="Time"></input></td>
        <td><input className="inputText" type="time" placeholder="Time"></input></td>
        <td>
            <select         className="inputText"
                            value={vrstakarte}
                            onChange={(e) => setVrstakarte(e.target.value)}
                            >
                            <option value="Jednosmerna">Jednosmerna</option>
                            <option value="Povratna">Povratna</option>
            </select>
        </td>
        <td>
            <select         className="inputText"
                            value={putnik}
                            onChange={(e) => setVrstakarte(e.target.value)}
                            >
                            <option value="Odrasli">Odrasli</option>
                            <option value="Deca">Deca</option>
            </select>
        </td>  
        <td><button className='button-43'>Kupi </button> </td> 
        <td><button className='button-43'>Rezerviši </button> </td>
        </tr>

    </table>                      

    </div>
    <br/><br/>
    </div>
  )
}

export default Pretraga

