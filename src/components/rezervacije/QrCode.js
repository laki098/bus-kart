import { useState } from "react";
import QRCode from "react-qr-code";
import QrScanner from 'qr-scanner';


const Qrcode = (props) => {
    const[showQRCode , setShowQRCode] = useState(false);
    
    const [result, setResult] = useState("")
    const code = props.code;
    const[inputValue, setInputValue] = useState('')
    const qrcode = `Korisnik je kupio kartu od mesta ${code.mestoPolaska} do mesta  ${code.mestoDolaska}  i to datuma  ${code.datumPolaska} za vreme ${code.vremePolaska} casova  i dolazi ${code.datumDolaska}  to u vremenu ${code.vremeDolaska} casova i bira osvezenje ${code.osvezenje}.Korisnik je izabrao kartu ${code.radio} i cena te karte je ${code.cena} dinara. Korisnik je rezervisao sediste broj ${code.sediste + ''} `; 
    
    
    

    const download = () =>{
        const svg = document.getElementById("QRCode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");

          // ime slike
          downloadLink.download = `${inputValue}`;
          downloadLink.href = `${pngFile}`;
          downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }

    // ime slike
        const readCode = (e) => {
            const file = e.target.files[0];
            if (!file) {
                return;
            }
            QrScanner.scanImage(file, { returnDetailedScanResult: true })
                .then(result => setResult(result.data) )
                .catch(e => console.log(e));
        }

    return ( 
            
            <div className="proba">
                <h3>QRCode generator i dugme za download: 
                </h3>
                
                <div style={{height:"auto", margin:"0 auto", maxWidth:100, width:"100%"}}>
                    {showQRCode &&
                    <QRCode
                    size={256}
                    style={{height:"auto", maxWidth:"100%", width:"100%"}}
                    value={qrcode} /*JSON.stringify(blog) -moze i na ovaj nacin*/
                    viewBox={`0 0 256 256`}
                    id="QRCode"
                    />}
                </div>

                {/*<input type="text" onChange={(e) => setInputValue(e.target.value)}/>*/}
                <button onClick={() => setShowQRCode(true) }>show QR Code</button>
                <input type="button" onClick={download} value="Download"/>


                <h3>2, QRCode reader </h3><br />
                <input type="file" onChange={(e) => readCode(e)} /><br />
                <p>  {result }</p>
                

            </div>
        
     );
}
 
export default Qrcode;