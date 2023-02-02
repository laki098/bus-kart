import  "./index.css";
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Rezervacija = () => {

    const [prevoznik, setPrevoznik] = useState('');
    const [linija, setLinija] = useState('Niš Beograd');
    const [vrstakarte, setVrstakarte]=useState('Jednosmerna');
    const [value, onChange] = useState(new Date());
    const [putnik, setPutnik] = useState('Odrasli');
    const [polaznaStanica, setPolaznastanica]=useState('');
    const [dolaznaStanica, setDolaznastanica]=useState('');
    const [brPolazaka, setBrPolazaka]=useState('3');
    const brPol=true;
    
    
    return ( 
        <div className="styleHome">
            <div className="wrapper levo">
            <h1>Rezervacija karata u autobuskom prevozu</h1>
            <fieldset className="sirinaSet" >
                <table className="table">
                    <tr>
                        <td><label>Odaberite prevoznika</label></td>
                        <td><label >Polazna stanica</label></td>
                        <td><label>Dolazna stanica</label></td>
                        <td><label>Datum polaska</label></td>    
                     {/*   <td><label>Tip karte</label></td>
                        <td><label>Putnik</label></td>              */}
                        <tr><button>Trazi</button></tr>
                    </tr>
                    <tr>
                        <td>
                        <select
                            value={prevoznik}
                            onChange={(e) => setPrevoznik(e.target.value)}
                            >
                            <option value="Nišekspres">Nišekspres</option>
                            <option value="Lasta">Lasta</option>
                            <option value="Kanin">Kanin</option>
                            <option value="Sinplon">Sinplon</option>
                            <option value="Jeremić prevoz">Jeremić prevoz</option>
                        </select>

                        </td>
                        <td><input type="text" name="polaznast" className="inputText" value={polaznaStanica} onChange={(e) => setPolaznastanica(e.target.value)}/></td>
                        <td><input type="text" name="dolaznast" className="inputText" value={dolaznaStanica} onChange={(e) => setDolaznastanica(e.target.value)}/></td>
                        <td colSpan={2}>
                        <label >Datum polaska</label> &emsp;&ensp;
                        <br/><br/>
                        <Calendar
                            onChange={onChange}
                            value={value}
                        />
                        </td>
                    {/*    <td>
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
                    </td>               */}

                    </tr>              
                    {/*
                        <tr>
                        <td colSpan={2}>
                        <label >Datum polaska</label> &emsp;&ensp;
                        <br/><br/>
                        <Calendar
                            onChange={onChange}
                            value={value}
                        />
                        </td>
                        <td></td>
                        <td></td>
                        <td><button>Traži</button></td>
                        </tr>
                */}    

                </table>


            </fieldset>
<hr/>

            <h2>Rezervacija sedišta u autobusu</h2>
            <p>Linija :  <b> {polaznaStanica} - {dolaznaStanica} </b></p> 
            <fieldset className="sirinaSet" >
                <table className="table">
                    <tr>
                        <td>Prevoznik </td>
                        <td>
                        <label> Vreme dolaska</label>
                        </td>
                        <td><label> Vreme polaska</label></td>
                        <td><label> Broj slobodnih mesta</label></td>
                        <td> Kupi / Rezerviši</td>    
                    </tr>

                        <tr>
                        <td>Prevoznik </td>
                        <td>
                        <label> Vreme dolaska</label>
                        </td>
                        <td><label> Vreme polaska</label></td>
                        <td><label> Broj slobodnih mesta</label></td>
                        <td> Kupi / Rezerviši</td> 
                        </tr>  
                </table>
            </fieldset>
<hr/>
            </div>
        </div>
     );
}
 
export default Rezervacija;