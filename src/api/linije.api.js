// import axios from "axios";


  const LinijeApi = () => {

    const filterLinija = async (mestoPolaska,mestoDolaska, datumPolaska) => {
      // return await axios.get("http://localhost:5000/linije/filterLinija", {
      //     mestoPolaska:mestoPolaska, mestoDolaska:mestoDolaska, datumPolaska:datumPolaska
      // })

      return await fetch("http://localhost:5000/linije/filterLinija", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "mestoPolaska": mestoPolaska,
          "mestoDolaska": mestoDolaska,
          "datumPolaska": datumPolaska
        })
      })
      
    }

    return {filterLinija}
}
 
export default LinijeApi;