import axios from "axios";

const CeneApi = () => {
    const upisCene = async (pocetnaStanica, krajnjaStanicaR,cenaKarte) => {
        console.log({
            pocetnaStanica: pocetnaStanica,
            krajnjaStanicaR: krajnjaStanicaR,
            cenaKarte:cenaKarte,
        });
        return await axios.post(
            "http://localhost:5000/cena",
            {
                pocetnaStanica:pocetnaStanica,
                krajnjaStanicaR: krajnjaStanicaR,
                cenaKarte:cenaKarte,
            }
        );
    }

    const filterCeneId = async(id) => {
        return await axios.get(`http://localhost:5000/cena/${id}`, {})
    };

    const brisanjeCene = async (id) => {
        return await axios.delete(`http://localhost:5000/cena/${id}`, {});
    };

    const editCene = async (id,pocetnaStanica,krajnjaStanicaR,cenaKarte) => {
        console.log(id,pocetnaStanica,krajnjaStanicaR,cenaKarte);
        return await axios.put(`http://localhost:5000/cena/${id}`, {
            pocetnaStanica: pocetnaStanica,
            krajnjaStanicaR: krajnjaStanicaR,
            cenaKarte:cenaKarte,
        });
    };
    
    return {
        upisCene,
        filterCeneId,
        brisanjeCene,
        editCene,
    };
};

export default CeneApi;

