import loginApi from "../../api/login.api";
import { useState } from "react";
import LoginComponent from "./login.component";

const LoginLogic = () => {
    let [email, setEmail] = useState();
    let [password, setPassword] = useState();
    const login = () =>{

        loginApi().login(email, password)
    }
    return {setEmail, setPassword, login};
}
 
export default LoginLogic;