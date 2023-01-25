import RegistrationLogic from "./registration.logic";

const RegistrationComponent = () => {
    const registrationLogic = RegistrationLogic()
    return ( 
        <div>
            <label>Ime:</label>
            <input type="text" name = "ime" required onChange={registrationLogic.changeHandler}></input>
            <label >Prezime:</label>
            <input type="text" name = "prezime" required onChange={registrationLogic.changeHandler}></input>
            <label>Koriscko ime:</label>
            <input type="text" name = "korisnickoIme" required onChange={registrationLogic.changeHandler}></input>
            <label>Lozinka:</label>
            <input type="password" name = "lozinka" required onChange={registrationLogic.changeHandler}></input>
            <label>Broj telefona:</label>
            <input type="text" name = "brojTelefona" required onChange={registrationLogic.changeHandler}></input>
            <label>Email:</label>
            <input type="email" name = "email" required onChange={registrationLogic.changeHandler}></input>
            
            <button onClick={registrationLogic.registracija}>klik</button>
            
        </div>
     );
}
 
export default RegistrationComponent;