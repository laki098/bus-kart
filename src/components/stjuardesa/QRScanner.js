import React, { Component } from "react";
import QrReader from "react-qr-scanner";

class QRScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "", //? Stanje koje će sadržati rezultat skeniranja QR koda
      oznakaRezervacije: null, //? Stanje koje će sadržati oznaku rezervacije
      linijaId: null, //? Stanje koje će sadržati linijaId
    };
  }

  //? Ova funkcija će se pozvati kada se QR kod uspešno skenira(kada kamera očita qr)
  handleScan = (data) => {
    if (data) {
      //? iz skeniranog qr dobijam oznaku busa
      const regex = /oznakaRezervacije:\s*(\d+)/;
      const match = data.text.match(regex);

      //? iz skeniranog qr dobijam linijuId na kojoj je rezervisana
      const linijaIdRegex = /LinijaId:\s*(\d+)/;
      const linijaIdMatch = data.text.match(linijaIdRegex);

      const idLinijaFront = this.props.idLinije;

      if (match && linijaIdMatch) {
        //? Izvlačenje broja rezervacije iz teksta QR koda
        const novaOznakaRezervacije = match[1];
        //? Izvlačenje broja linije id
        const linijaId = linijaIdMatch[1];

        //? Formiranje URL-a za slanje HTTP zahteva
        const url = `http://localhost:5000/linija/cekiranje/${novaOznakaRezervacije}`;

        //? Kreiranje tela HTTP zahteva
        const requestBody = {
          qrCodeData: data,
          linijaId: linijaId,
          idLinijaFront: idLinijaFront,
        };

        //? Slanje HTTP zahteva
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              //? u slucaju da nije tacno, da dolazi do greske ovde ispise
              return response.json().then((data) => {
                alert(data.message);
                throw new Error("HTTP zahtjev nije uspio");
              });
            }
          })
          .then((data) => {
            //? ovde rukujemo sa uspesnim cekiranjem
            console.log(data);
            alert(data.message);
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
          linijaId: linijaId,
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
        <p className="labela-stanica">QR Kod rezultat: {textResult}</p>
      </div>
    );
  }
}

export default QRScanner;
