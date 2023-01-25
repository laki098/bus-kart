
import logo from './Logo.png';
import React from 'react';


const Header = () => {
    return ( 
        <>
        <table >
            <tr>
             <td >   
            <img src={logo} alt="Logo" style={{width: 150, height: 100}} /></td>
            <td>
            <h3 style={{color: '#159' }}>Skysoft is everything you need </h3></td></tr>
        </table>   
        </>
     );
}
 
export default Header;