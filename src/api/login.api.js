import axios from "axios";


  const loginApi = () => {

    const getUsers = async () => {
        return await fetch("http://localhost:5000/korisnici");
      }

      const login = async (username, password) => {
        console.log({username:username, password:password})
        /* return await fetch("http://localhost:5000/users/login", {"method":"POST", "body":{username:username, password:password}}); */
        return await axios.post("http://localhost:5000/users/login", {username:username, password:password})
      }
    
    return {getUsers, login};
}
 
export default loginApi;