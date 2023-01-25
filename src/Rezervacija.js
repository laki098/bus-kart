import  "./index.css";
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Rezervacija = () => {

    const [prevoznik, setPrevoznik] = useState('Nišekspres');
    const [linija, setLinija] = useState('Niš Beograd');
    const [vrstakarte, setVrstakarte]=useState('Jednosmerna');
    const [value, onChange] = useState(new Date());
    
    
    return ( 
        <div className="styleHome">
            <div className="wrapper">
            <h1>Rezervacija karata u autobuskom prevozu</h1>
            <fieldset className="sirinaSet" >
                <table className="table">
                    <tr>
                        <td><label>Odaberite prevoznika</label></td>
                        <td><label >Polazna stanica</label></td>
                        <td><label>Dolazna stanica</label></td>
                     {/*   <td><label>Datum polaska</label></td>    */}
                        <td><label>Tip karte</label></td>
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
                        <td><input type="text" name="polaznast" className="inputText"/></td>
                        <td><input type="text" name="dolaznast" className="inputText"/></td>
                     {/*   <td>
                        <Calendar
                            onChange={onChange}
                            value={value}
                            
                        />

                        </td>   */}
                        <td>
                        <select
                            value={vrstakarte}
                            onChange={(e) => setVrstakarte(e.target.value)}
                            >
                            <option value="Jednosmerna">Jednosmerna</option>
                            <option value="Povratna">Povratna</option>
                        </select>
                        </td>
                    </tr>
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
                    </tr>

                </table>


            </fieldset>
            </div>
        </div>
     );
}
 
export default Rezervacija;