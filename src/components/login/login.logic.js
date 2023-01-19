import loginApi from "../../api/login.api";
import { useState } from "react";
import LoginComponent from "./login.component";

const LoginLogic = () => {
    let [data, setData] = useState({})
    const login = () =>{

        loginApi().login(data.username, data.password).then((response)=>{
            console.log(response)
            alert("Konacccno")
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    const changeHandler = (e) => setData({
        ...data,
        [e.target.name]: e.target.value
      })
    return {setData, login, changeHandler};
}
 
export default LoginLogic;