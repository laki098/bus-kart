import React from 'react';
import { useState } from 'react';
import './index.css';
//import Button from '@mui/material/Button'; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 

const Pretraga = () => {

const [prevoznik, setPrevoznik] = useState('Eurocompass');
const [polaznaStanica, setPolaznastanica]=useState('');
const [dolaznaStanica, setDolaznastanica]=useState('');
const [vrstakarte, setVrstakarte]=useState('Jednosmerna');
const [value, onChange] = useState(new Date());
const [putnik, setPutnik] = useState('Odrasli');

  return (
    <div className='kutija '>
    <br/><br/>
    <div className='box_3'>
    <table className="table">
                    <tr> 
                        <td><label>Odaberite prevoznika</label></td>
                        <td><label >Polazna stanica</label></td>
                        <td><label>Dolazna stanica</label></td>
                        <td><label>Datum polaska</label></td>    
                        <td><label>Tip karte</label></td>
                        <td><label>Putnik</label></td>              
                        <td colSpan={2}><button className='button-43'>Traži</button></td>
                    </tr>
                    <tr>
                        <td>  <select
                            value={prevoznik}
                            onChange={(e) => setPrevoznik(e.target.value)}
                            >
                            <option value="Nišekspres">Nišekspres</option>
                            <option value="Lasta">Lasta</option>
                            <option value="Kanin">Kanin</option>
                            <option value="Eurocompass">Eurocompass</option>
                            <option value="Jeremić prevoz">Jeremić prevoz</option>
                        </select></td>

                        <td><input type="text" name="polaznast" className="inputText" value={polaznaStanica} onChange={(e) => setPolaznastanica(e.target.value)}/></td>
                        <td><input type="text" name="dolaznast" className="inputText" value={dolaznaStanica} onChange={(e) => setDolaznastanica(e.target.value)}/></td>
                    <td>Datum</td>    
                        <td>
                        <select
                            value={vrstakarte}
                            onChange={(e) => setVrstakarte(e.target.value)}
                            >
                            <option value="Jednosmerna">Jednosmerna</option>
                            <option value="Povratna">Povratna</option>
                        </select>
                        </td>
                        <td>
                        <select
                            value={putnik}
                            onChange={(e) => setVrstakarte(e.target.value)}
                            >
                            <option value="Odrasli">Odrasli</option>
                            <option value="Deca">Deca</option>
                        </select>
                        </td>
                    
                        <td><button className='button-43'>Kupi </button> </td>
                        <td> <button className='button-43'>Rezerviši</button></td>
                    </tr>
                    </table>          

    </div>
    <br/><br/>
    </div>
  )
}

export default Pretraga

