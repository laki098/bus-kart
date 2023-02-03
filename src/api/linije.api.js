import axios from "axios";


  const LinijeApi = () => {

    const getLinija = async () => {
        let response = await fetch("http://localhost:5000/linije/linija");
        let data = await response.json()
        return data;
      }
    return {getLinija}
      
}
 
export default LinijeApi;