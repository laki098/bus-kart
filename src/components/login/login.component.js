import LoginLogic from "./login.logic";
import './loginStyle.css';


const LoginComponent = () => {
    const loginLogic = LoginLogic()
    return ( 
    <>
        <input className="input1" type="text" name="username" required onChange={loginLogic.changeHandler}></input>
        <input type="password" name="password" required onChange={loginLogic.changeHandler}></input>
        <button onClick={loginLogic.login}>Login</button>
    </> );
}
 
export default LoginComponent;