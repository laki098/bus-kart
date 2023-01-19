import LoginLogic from "./login.logic";
import 'loginStyle.css';


const LoginComponent = () => {
    
    return ( 
    <>
        <input className="input1" type="text" required onChange={(e) => LoginLogic().setEmail(e.target.value)}></input>
        <input type="text"></input>
        <button onClick={LoginLogic().login}>Login</button>
    </> );
}
 
export default LoginComponent;