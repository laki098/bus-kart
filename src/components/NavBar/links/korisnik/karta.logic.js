import ToastNotification from "../../../../toastNotification/ToastNotification";
import KartaApi from "../../../../api/karta.api";

const KorisnikLogic = () => {
  const { notifySuccess, notifyWarn } = ToastNotification();

  const otkazivanjeKarte = async (karte) => {
    try {
      const response = await KartaApi().otkazivanjeKarte(karte);
      console.log("Odgovor backend-a:", response);
      notifySuccess(response.data.message); // Uspešna notifikacija
    } catch (error) {
      console.error("Greška prilikom otkazivanja karte:", error);
      const errorMessage =
        error.response?.data?.message || "Došlo je do greške.";
      notifyWarn(errorMessage); // Notifikacija o grešci
    }
  };

  return { otkazivanjeKarte };
};

export default KorisnikLogic;
