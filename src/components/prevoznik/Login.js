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
            <td className='desno'><label >Unesite Vaše korisničko ime</label></td>
            <td><input name="korsnickoIme" placeholder='Unesite Vaše korisničko ime'></input></td>
        </tr>
        <tr>
            <td className='desno'><label >Unesite Vašu lozinku</label></td>
            <td><input name="korisnickaLozinka" placeholder='Unesite Vašu lozinku'></input></td>
        </tr>
        <hr/>
        <tr>
            <td className='desno'><label >Slanje zahteva za reset lozinke</label></td>
            <td><button type='Reset'>Reset lozinke</button></td>
        </tr>

        <hr/>
        <tr>
            <td className='desno'><label >Promena lozinke</label></td>
            <td> &nbsp;</td>
        </tr>
        <hr/>
        <tr>
            <td className='desno'><label >Stara lozinka</label></td>
            <td><input name="staraLozinka" placeholder='Unesite Vašu staru lozinku'></input></td>
        </tr>
        <tr>
            <td className='desno'><label >Nova lozinka</label></td>
            <td><input name="staraLozinka" placeholder='Unesite Vašu novu lozinku'></input></td>
        </tr>
        <tr>
            <td className='desno'><label >Ponovo unesite novu lozinka</label></td>
            <td><input name="novaLozinka1" placeholder='Ponovo unesite Vašu novu lozinku'></input></td>
        </tr>
    </table>

    
                  

    </div>
    <br/><br/>
    </div>
  )
}

export default Pretraga

