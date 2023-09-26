import React, { Component } from "react";
import QrReader from "react-qr-scanner";

class QRScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "", //? Stanje koje će sadržati rezultat skeniranja QR koda
      oznakaRezervacije: null, //? Stanje koje će sadržati oznaku rezervacije
    };
  }

  //? Ova funkcija će se pozvati kada se QR kod uspešno skenira(kada kamera očita qr)
  handleScan = (data) => {
    if (data) {
      const regex = /oznakaRezervacije:\s*(\d+)/;
      const match = data.text.match(regex);

      if (match) {
        //? Izvlačenje broja rezervacije iz teksta QR koda
        const novaOznakaRezervacije = match[1];

        //? Formiranje URL-a za slanje HTTP zahteva
        const url = `http://localhost:5000/linija/cekiranje/${novaOznakaRezervacije}`;

        //? Kreiranje tela HTTP zahteva
        const requestBody = {
          qrCodeData: data,
        };

        //? Slanje HTTP zahteva
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          credentials: "include",
        })
          .then((response) => {
            this.props.onScanSuccess("Uspješno ste skenirali QR kod.");
            /* alert("Uspesno cekirana karta"); */
            if (!response.ok) {
              alert("Karta je iskoriscena");
              throw new Error("HTTP zahtev nije uspio");
            } else {
              alert("Karta je uspesno cekirana");
            }
          })
          .catch((error) => {
            console.error(error);
          });

        //? Da vrati da je uspešno očitan qrCode i šalje kroz prop da bi se kamera ugasila prilikom očitavanja
        this.props.onScanSuccess();

        //? Ažuriranje stanja komponente
        this.setState({
          result: data,
          oznakaRezervacije: novaOznakaRezervacije,
        });
      } else {
        console.error("Nije moguće izdvojiti broj iz očitanog QR koda.");
      }
    }
  };

  //? Ova funkcija će se pozvati u slučaju greške pri skeniranju QR koda
  handleError = (error) => {
    console.error(error);
  };

  render() {
    const { result } = this.state;
    const textResult = result ? result.text : "";
    return (
      <div>
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
        />
        <p>QR Kod rezultat: {textResult}</p>
      </div>
    );
  }
}

export default QRScanner;
