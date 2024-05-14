import { useState } from "react";

import { toast } from "react-toastify";
import KartaApi from "../../../../api/karta.api";

const KorisnikLogic = () => {
  const otkazivanjeKarte = async (karte) => {
    KartaApi()
      .otkazivanjeKarte(karte)
      .then((response) => {
        console.log(response);
        notifySuccest(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });

    const notifySuccest = (message) => {
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    };
    const notifyWarn = (message) => {
      toast.warn(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    };
  };

  return { otkazivanjeKarte };
};

export default KorisnikLogic;
