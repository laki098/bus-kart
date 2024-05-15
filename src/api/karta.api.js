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

  const cekiranjeKarte = async (rezervacijaId, linijaId, idLinijaFront) => {
    console.log(rezervacijaId, linijaId, idLinijaFront);
    return await axios.post(
      `${apiUrl}/linija/cekiranje/${rezervacijaId}`,
      {
        linijaId,
        idLinijaFront,
      },
      {
        withCredentials: true,
      }
    );
  };

  return { otkazivanjeKarte, cekiranjeKarte };
};

export default KartaApi;
