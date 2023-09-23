import React, { Component } from "react";
import QrReader from "react-qr-scanner";

class QRScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      oznakaRezervacije: null,
    };
  }

  handleScan = (data) => {
    if (data) {
      const regex = /oznakaRezervacije:\s*(\d+)/;
      const match = data.text.match(regex);

      if (match) {
        const novaOznakaRezervacije = match[1];
        const url = `http://localhost:5000/linija/cekiranje/${novaOznakaRezervacije}`;
        const requestBody = {
          qrCodeData: data,
        };

        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("HTTP zahtjev nije uspio");
            }
          })
          .catch((error) => {
            console.error(error);
          });

        this.props.onScanSuccess();
        this.setState({
          result: data,
          oznakaRezervacije: novaOznakaRezervacije,
        });
      } else {
        console.error("Nije moguće izdvojiti broj iz očitanog QR koda.");
      }
    }
  };

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
