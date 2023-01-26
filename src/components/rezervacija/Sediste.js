import Rezervacija from "./Rezervacija";
import { useState } from 'react';



const Sediste = () => {
    return ( 
        <div>
            <div className="styleHome">
            <div className="wrapper">
            <h2>Rezervacija sedišta u autobusu</h2>
            <p>Linija :  <b> Polazak - Dolazak </b></p> 
            <fieldset className="sirinaSet" >
                <table className="table">
                    <tr>
                        <td>Prevoznik: </td>
                        <td>
                        <label> Vreme dolazak</label>
                        </td>
                        <td><label> Vreme dolazak</label></td>
                        <td> Kupi</td>
                        <td> Rezerviši</td>
                    </tr>

                </table>
            </fieldset>
            </div>
            </div>    


        </div>
     );
}
 
export default Sediste;