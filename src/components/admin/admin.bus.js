import React from "react";

const submitHandler = (event) => {
    event.preventDefault(); 
};




const Bus = () => {
    return ( 
        <form onSubmit={submitHandler}>
            <label>Registracija</label>
            <br />
             <input  type="text" placeholder="Izaberite bus" />
             <br />
             <label>Broj mesta</label>
             <br />
             <input type="text" placeholder="Broj sedista" />
             <br />
             <button>Dodaj nov autobus</button>
        </form>        
     );
}
 
export default Bus;