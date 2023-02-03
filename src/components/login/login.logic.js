import loginApi from "../../api/login.api";
import { useState } from "react";

const LoginLogic = () => {
    let [data, setData] = useState({})
    console.log(data)
    const login = () =>{

        loginApi().login(data.korisnickoIme, data.lozinka)
            .then((response)=>{
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