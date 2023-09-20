import axios from "axios";

const StaniceApi = () => {
    const upisStanice = async (naziv, adresa) => {
        console.log({
            naziv: naziv,
            adresa: adresa,
        });
        return await axios.post("http://localhost:5000/stanica", {
            naziv: naziv,
            adresa: adresa,
        });
    };


    const filterStaniceId = async(id) => {
        return await axios.get(`http://localost:5000/stanica/${id}`, {});
    };


    const brisanjeStanice = async (id) => {
        return await axios.delete (
            `http://localhost:5000/stanica/${id}`, {}
        );
    };
    
    const editStanice = async (id, naziv, adresa) => {
        return await axios.put(`http://localhost:5000/stanica/${id}`, {
            id: id,
            naziv: naziv,
            adresa:adresa,
        });
    };

    return {
        upisStanice,
        brisanjeStanice,
        editStanice,
        filterStaniceId,
    };

};  

export default StaniceApi