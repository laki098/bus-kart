

  const loginApi = () => {

    const getUsers = async () => {
        return await fetch("http://localhost:5000/korisnici");
      }

      const login = async (email, password) => {
        console.log(email, password)
        //return await fetch("http://localhost:5000/login");
      }
    
    return {getUsers, login};
}
 
export default loginApi;