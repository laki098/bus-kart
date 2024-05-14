import axios from "axios";
import apiUrl from "../apiConfig";

const KartaApi = () => {
  const otkazivanjeKarte = async (karte) => {
    console.log({
      rezervacijaId: karte.id,
      linijaId: karte.linijaId,
      pocetnaStanicaId: karte.pocetnaStanicaId,
      krajnjaStanicaId: karte.krajnjaStanicaId,
      brojMesta: karte.brojMesta,
    });
    return await axios.put(`${apiUrl}/karta/otkazivanje`, {
      rezervacijaId: karte.id,
      linijaId: karte.linijaId,
      pocetnaStanicaId: karte.pocetnaStanicaId,
      krajnjaStanicaId: karte.krajnjaStanicaId,
      brojMesta: karte.brojMesta,
    });
  };

  return { otkazivanjeKarte };
};

export default KartaApi;
