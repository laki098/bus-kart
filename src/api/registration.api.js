
import axios from "axios";
const RegistracijaApi = () => {
    const getKorisnik = async () => {
        return await fetch("http://localhost:5000/korisnik");
    }
    const registracija = async (korisnickoIme, lozinka, ime, prezime, email, brojTelefona) => {
        console.log({korisnickoIme:korisnickoIme, lozinka:lozinka, ime:ime, prezime:prezime, email:email, brojTelefona:brojTelefona})
        return await axios.post("http://localhost:5000/korisnik/registration", {korisnickoIme:korisnickoIme, lozinka:lozinka, ime:ime, prezime:prezime, email:email, brojTelefona:brojTelefona})
    }
    return { getKorisnik,  registracija};
}
 
export default RegistracijaApi;