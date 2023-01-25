import { useState } from "react";
import RegistracijaApi from "../../api/registration.api";

const RegistrationLogic = () => {
    
    let [data, setData] = useState({})
    const changeHandler = (e) => setData({
        ...data,
        [e.target.name]: e.target.value
      })

      const registracija = () => {
        RegistracijaApi().registracija(data.korisnickoIme, data.lozinka, data.ime, data.prezime, data.email, data.brojTelefona).then((rasponse)=>{
            console.log(rasponse)
            alert("konacno")
        })
        .catch((error) => {
            console.log(error)
        })
      }
      
    return { 
        changeHandler, setData, registracija
    };
}
 
export default RegistrationLogic;