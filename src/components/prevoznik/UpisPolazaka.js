import React from 'react';
import { useState } from 'react';
import './index.css';

const Pretraga = () => {

  return (
    <div className='kutija'>
    <br/><br/>
    <div className='box_3'>


    <table className='table'>
        <tr>
            <td className='desno'><label >Unesite mesto polaska</label></td>
            <td><input name="mestoPolaska"></input></td>
        </tr>
        <tr>
            <td className='desno'><label >Unesite mesto dolaska</label></td>
            <td><input name="mestoDolaska"></input></td>
        </tr>
        <tr>
            <td className='desno'><label >Unesite broj mesta u autobusu</label></td>
            <td><input name="brPutnika"></input></td>
        </tr>
    </table>

    <table className="table">
                    <tr>
                        <td colSpan={2}>Radni dani</td>
                        <td colSpan={2}>Subota</td>
                        <td colSpan={2}>Nedelja</td>
                        <td colSpan={2}>Vandredni polazak</td>
                        <td>Upis/Promena</td>
                    </tr>
                    <tr>
                        <td><input type="time" placeholder="Time" name="polazakRadniDan"></input></td>
                        <td><input type="time" placeholder="Time" name="dolazakRadniDan"></input></td>
                        <td><input type="time" placeholder="Time" name="polazakSubota"></input></td>
                        <td><input type="time" placeholder="Time" name="dolazakSubota"></input></td>
                        <td><input type="time" placeholder="Time" name="polazakNedelja"></input></td>
                        <td><input type="time" placeholder="Time" name="dolazakNedelja"></input></td>
                        <td><input type="time" placeholder="Time" name="polazakVandredno"></input></td>
                        <td><input type="time" placeholder="Time" name="dolazakRedovno"></input></td>
                        <td> <button>Upis</button> <button>Promena</button> <button>Brisanje</button> </td>
                    </tr>

    </table>
                  

    </div>
    <br/><br/>
    </div>
  )
}

export default Pretraga

