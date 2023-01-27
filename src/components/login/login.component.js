import LoginLogic from "./login.logic";
import './loginStyle.css';


const LoginComponent = () => {
    const loginLogic = LoginLogic()
    return ( 
    <>
        <input className="input1" type="text" name="korisnickoIme" required onChange={loginLogic.changeHandler}></input>
        <input className="input1" type="password" name="lozinka" required onChange={loginLogic.changeHandler}></input>
        <button className="button" onClick={loginLogic.login}>Login</button>
    </> );
}
 
export default LoginComponent;